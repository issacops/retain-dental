import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    X, Upload, Download, Sparkles, LayoutTemplate, Star, BadgePercent, Megaphone, Stethoscope,
    Copy, Check, ShieldCheck, AlertTriangle, Loader2,
} from 'lucide-react';
import { Clinic } from '../../../types';
import { cn } from '../ui/primitives';

interface SocialPostGeneratorProps {
    clinic: Clinic;
    onClose: () => void;
}

// --- CONTENT PILLARS (recommended dental posting mix) ---
type Pillar = 'Education' | 'Social proof' | 'Culture' | 'Promotion';
const PILLARS: Record<Pillar, { share: number; tone: string; dot: string }> = {
    Education: { share: 40, tone: 'bg-sun-soft text-sun-deep', dot: 'bg-sun' },
    'Social proof': { share: 25, tone: 'bg-leaf-soft text-leaf-deep', dot: 'bg-leaf' },
    Culture: { share: 20, tone: 'bg-mist-soft text-mist-deep', dot: 'bg-mist' },
    Promotion: { share: 5, tone: 'bg-blush-soft text-blush-deep', dot: 'bg-blush' },
};

type TemplateCategory = Pillar;
interface InputDef { key: string; label: string; type: 'text' | 'image' | 'textarea' | 'number'; placeholder?: string; }
interface TemplateConfig {
    id: string;
    label: string;
    category: TemplateCategory;
    icon: React.ReactNode;
    description: string;
    theme: 'light' | 'dark';
    consent?: boolean;
    inputs: InputDef[];
}

const TEMPLATES: TemplateConfig[] = [
    {
        id: 'transformation', label: 'Transformation', category: 'Social proof', icon: <Sparkles size={18} />,
        description: 'Before & after showcase', theme: 'dark', consent: true,
        inputs: [
            { key: 'beforeImage', label: 'Before photo', type: 'image' },
            { key: 'afterImage', label: 'After photo', type: 'image' },
            { key: 'procedure', label: 'Procedure', type: 'text', placeholder: 'e.g. Invisalign' },
        ],
    },
    {
        id: 'review', label: 'Patient review', category: 'Social proof', icon: <Star size={18} />,
        description: 'Highlight patient feedback', theme: 'dark', consent: true,
        inputs: [
            { key: 'mainImage', label: 'Patient photo', type: 'image' },
            { key: 'reviewText', label: 'Review', type: 'textarea', placeholder: 'The kindest team I have ever met...' },
            { key: 'patientName', label: 'Patient name', type: 'text', placeholder: 'Sarah J.' },
            { key: 'stars', label: 'Star rating', type: 'number', placeholder: '5' },
        ],
    },
    {
        id: 'myth', label: 'Myth buster', category: 'Education', icon: <Stethoscope size={18} />,
        description: 'Correct a common belief', theme: 'light',
        inputs: [
            { key: 'myth', label: 'The myth', type: 'text', placeholder: 'Root canals hurt' },
            { key: 'fact', label: 'The reality', type: 'text', placeholder: 'They relieve pain, fast' },
        ],
    },
    {
        id: 'offer', label: 'Limited offer', category: 'Promotion', icon: <BadgePercent size={18} />,
        description: 'Drive bookings with urgency', theme: 'light',
        inputs: [
            { key: 'offerTitle', label: 'Offer headline', type: 'text', placeholder: '20% OFF' },
            { key: 'offerSub', label: 'Sub-text', type: 'text', placeholder: 'New patient cleaning' },
            { key: 'expiry', label: 'Valid until', type: 'text', placeholder: 'March 31' },
        ],
    },
    {
        id: 'announcement', label: 'Clinic update', category: 'Culture', icon: <Megaphone size={18} />,
        description: 'Hours, team, or news', theme: 'light',
        inputs: [
            { key: 'title', label: 'Headline', type: 'text', placeholder: 'We are open Sundays' },
            { key: 'message', label: 'Message', type: 'textarea', placeholder: 'From this month, the clinic is open 10am to 2pm every Sunday.' },
            { key: 'mainImage', label: 'Optional photo', type: 'image' },
        ],
    },
];

// --- FORMATS ---
const FORMATS = [
    { id: 'story', label: 'Story', ratio: '9:16', w: 1080, h: 1920 },
    { id: 'portrait', label: 'Portrait', ratio: '4:5', w: 1080, h: 1350 },
    { id: 'square', label: 'Square', ratio: '1:1', w: 1080, h: 1080 },
] as const;
type Format = typeof FORMATS[number];

type Dims = { w: number; h: number };
type LoadImg = (src: string) => Promise<HTMLImageElement>;

const F = {
    display: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
    sans: '"Plus Jakarta Sans", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
};

const BRAND_MARK = '/icon-192.png';

// --- low-level canvas helpers ---
const roundRectPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
};

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = String(text ?? '').split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
};

interface FitOpts {
    x: number; y: number; maxWidth: number; maxLines: number;
    family: string; weight: number; size: number; color: string;
    align?: CanvasTextAlign; lineRatio?: number; minSize?: number;
}
const drawFit = (ctx: CanvasRenderingContext2D, text: string, o: FitOpts): number => {
    const lineRatio = o.lineRatio ?? 1.16;
    const minSize = o.minSize ?? 22;
    let size = o.size;
    let lines: string[] = [];
    for (let guard = 0; guard < 60; guard++) {
        ctx.font = `${o.weight} ${size}px ${o.family}`;
        lines = wrapLines(ctx, text, o.maxWidth);
        const fits = lines.length <= o.maxLines;
        if (fits || size <= minSize) break;
        size *= 0.94;
    }
    const lineHeight = size * lineRatio;
    ctx.fillStyle = o.color;
    ctx.textAlign = o.align ?? 'center';
    ctx.textBaseline = 'alphabetic';
    lines.forEach((l, i) => ctx.fillText(l, o.x, o.y + i * lineHeight));
    return o.y + (lines.length - 1) * lineHeight;
};

const coverDraw = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
};

const pill = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) => {
    ctx.fillStyle = fill;
    roundRectPath(ctx, x, y, w, h, r);
    ctx.fill();
};

const drawBrandMark = async (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, loadImg: LoadImg) => {
    try {
        const logo = await loadImg(BRAND_MARK);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.clip();
        const s = Math.min((r * 2) / logo.width, (r * 2) / logo.height);
        ctx.drawImage(logo, cx - (logo.width * s) / 2, cy - (logo.height * s) / 2, logo.width * s, logo.height * s);
        ctx.restore();
    } catch {
        /* brand mark is optional */
    }
};

// --- template drawers ---
const drawTransformation = async (ctx: CanvasRenderingContext2D, d: any, clinic: Clinic, dims: Dims, loadImg: LoadImg) => {
    const { w: W, h: H } = dims;
    const k = W / 1080;
    const splitY = H / 2;

    ctx.fillStyle = '#0E1110';
    ctx.fillRect(0, 0, W, H);

    const half = async (src: string | undefined, y: number, h: number, label: string, isTop: boolean) => {
        if (src) {
            try {
                const img = await loadImg(src);
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, y, W, h);
                ctx.clip();
                coverDraw(ctx, img, 0, y, W, h);
                ctx.restore();
            } catch { /* ignore bad upload */ }
        } else {
            ctx.fillStyle = isTop ? '#1B201E' : '#242A28';
            ctx.fillRect(0, y, W, h);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = `600 ${36 * k}px ${F.sans}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isTop ? 'Add a before photo' : 'Add an after photo', W / 2, y + h / 2);
        }

        const tagY = isTop ? y + 60 * k : y + h - 300 * k;
        pill(ctx, 60 * k, tagY, 250 * k, 84 * k, 42 * k, clinic.primaryColor || '#0F766E');
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${30 * k}px ${F.mono}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 60 * k + 125 * k, tagY + 44 * k);
    };

    await half(d.beforeImage, 0, splitY, 'BEFORE', true);
    await half(d.afterImage, splitY, splitY, 'AFTER', false);

    // split seam + handle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14 * k;
    ctx.beginPath();
    ctx.moveTo(0, splitY);
    ctx.lineTo(W, splitY);
    ctx.stroke();

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 26 * k;
    ctx.beginPath();
    ctx.arc(W / 2, splitY, 76 * k, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = clinic.primaryColor || '#0F766E';
    ctx.font = `700 ${56 * k}px ${F.display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↕', W / 2, splitY + 4 * k);

    if (d.procedure) {
        const label = String(d.procedure).toUpperCase();
        ctx.font = `700 ${30 * k}px ${F.mono}`;
        const tw = ctx.measureText(label).width;
        const pw = tw + 70 * k;
        pill(ctx, W - 60 * k - pw, splitY + 60 * k, pw, 84 * k, 42 * k, 'rgba(14,17,16,0.82)');
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, W - 60 * k - pw / 2, splitY + 102 * k);
    }
};

const drawReview = async (ctx: CanvasRenderingContext2D, d: any, clinic: Clinic, dims: Dims, loadImg: LoadImg) => {
    const { w: W, h: H } = dims;
    const k = W / 1080;

    ctx.fillStyle = clinic.primaryColor || '#0F766E';
    ctx.fillRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.font = `700 ${760 * k}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('”', W / 2, H * 0.52);

    if (d.mainImage) {
        try {
            const img = await loadImg(d.mainImage);
            const cy = H * 0.2;
            const r = 150 * k;
            ctx.save();
            ctx.beginPath();
            ctx.arc(W / 2, cy, r, 0, Math.PI * 2);
            ctx.clip();
            coverDraw(ctx, img, W / 2 - r, cy - r, r * 2, r * 2);
            ctx.restore();
            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.lineWidth = 4 * k;
            ctx.beginPath();
            ctx.arc(W / 2, cy, r + 4 * k, 0, Math.PI * 2);
            ctx.stroke();
        } catch { /* ignore */ }
    }

    const stars = Math.max(1, Math.min(5, parseInt(d.stars) || 5));
    ctx.fillStyle = '#FBBF24';
    ctx.font = `600 ${72 * k}px ${F.display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★'.repeat(stars), W / 2, H * 0.35);

    drawFit(ctx, `“${d.reviewText || 'Best dental experience.'}”`, {
        x: W / 2, y: H * 0.45, maxWidth: W * 0.8, maxLines: 5,
        family: 'Georgia, "Times New Roman", serif', weight: 400, size: 68 * k,
        color: '#ffffff', align: 'center', lineRatio: 1.28,
    });

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `700 ${36 * k}px ${F.mono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(String(d.patientName || 'Satisfied patient').toUpperCase(), W / 2, H * 0.74);

    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = `500 ${32 * k}px ${F.sans}`;
    ctx.fillText(clinic.name, W / 2, H * 0.785);
};

const drawMyth = (ctx: CanvasRenderingContext2D, d: any, clinic: Clinic, dims: Dims) => {
    const { w: W, h: H } = dims;
    const k = W / 1080;

    ctx.fillStyle = '#F7F4EC';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#0E1110';
    ctx.fillRect(0, 0, W, H * 0.1);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${42 * k}px ${F.display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DENTAL FACTS 101', W / 2, H * 0.05);

    const iconX = W * 0.14;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#DC2626';
    ctx.font = `700 ${110 * k}px ${F.display}`;
    ctx.fillText('✕', iconX, H * 0.255);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#B91C1C';
    ctx.font = `700 ${32 * k}px ${F.mono}`;
    ctx.fillText('THE MYTH', W * 0.26, H * 0.205);
    drawFit(ctx, d.myth || 'Add the myth', {
        x: W * 0.26, y: H * 0.26, maxWidth: W * 0.66, maxLines: 3,
        family: F.display, weight: 700, size: 58 * k, color: '#111111', align: 'left',
    });

    ctx.strokeStyle = '#D9D4C7';
    ctx.lineWidth = 2 * k;
    ctx.beginPath();
    ctx.moveTo(W * 0.08, H * 0.47);
    ctx.lineTo(W * 0.92, H * 0.47);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#16A34A';
    ctx.font = `700 ${110 * k}px ${F.display}`;
    ctx.fillText('✓', iconX, H * 0.635);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#15803D';
    ctx.font = `700 ${32 * k}px ${F.mono}`;
    ctx.fillText('THE REALITY', W * 0.26, H * 0.585);
    drawFit(ctx, d.fact || 'Add the fact', {
        x: W * 0.26, y: H * 0.64, maxWidth: W * 0.66, maxLines: 3,
        family: F.display, weight: 700, size: 58 * k, color: '#111111', align: 'left',
    });

    const cbY = H * 0.76;
    const cbH = H * 0.085;
    pill(ctx, W * 0.08, cbY, W * 0.84, cbH, 26 * k, clinic.primaryColor || '#0F766E');
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${42 * k}px ${F.display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ask us anything. We are glad to explain.', W / 2, cbY + cbH / 2);
};

const drawOffer = (ctx: CanvasRenderingContext2D, d: any, clinic: Clinic, dims: Dims) => {
    const { w: W, h: H } = dims;
    const k = W / 1080;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#0E1110';
    ctx.font = `700 ${30 * k}px ${F.mono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('LIMITED OFFER', W / 2, H * 0.11);

    drawFit(ctx, d.offerTitle || 'SPECIAL', {
        x: W / 2, y: H * 0.24, maxWidth: W * 0.86, maxLines: 2,
        family: F.display, weight: 700, size: 280 * k, color: '#0E1110', align: 'center', lineRatio: 1.0, minSize: 60,
    });

    const by = H * 0.42;
    const bh = H * 0.17;
    ctx.fillStyle = clinic.primaryColor || '#0F766E';
    ctx.fillRect(0, by, W, bh);
    drawFit(ctx, String(d.offerSub || 'Special offer').toUpperCase(), {
        x: W / 2, y: by + bh * 0.34, maxWidth: W * 0.82, maxLines: 2,
        family: F.display, weight: 700, size: 88 * k, color: '#ffffff', align: 'center', lineRatio: 1.12, minSize: 40,
    });

    ctx.strokeStyle = '#0E1110';
    ctx.lineWidth = 4 * k;
    ctx.strokeRect(40 * k, 40 * k, W - 80 * k, H - 80 * k);
    ctx.beginPath();
    ctx.moveTo(40 * k, H * 0.7);
    ctx.lineTo(W - 40 * k, H * 0.7);
    ctx.stroke();

    ctx.fillStyle = '#0E1110';
    ctx.font = `700 ${40 * k}px ${F.mono}`;
    ctx.textAlign = 'center';
    ctx.fillText(`VALID UNTIL ${String(d.expiry || 'FURTHER NOTICE').toUpperCase()}`, W / 2, H * 0.76);
};

const drawAnnouncement = async (ctx: CanvasRenderingContext2D, d: any, clinic: Clinic, dims: Dims, loadImg: LoadImg) => {
    const { w: W, h: H } = dims;
    const k = W / 1080;

    if (d.mainImage) {
        try {
            const img = await loadImg(d.mainImage);
            coverDraw(ctx, img, 0, 0, W, H);
        } catch {
            ctx.fillStyle = clinic.primaryColor || '#0E1110';
            ctx.fillRect(0, 0, W, H);
        }
    } else {
        ctx.fillStyle = clinic.primaryColor || '#0E1110';
        ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = 'rgba(250,247,240,0.94)';
    roundRectPath(ctx, 60 * k, 60 * k, W - 120 * k, H - 120 * k, 32 * k);
    ctx.fill();
    ctx.strokeStyle = '#0E1110';
    ctx.lineWidth = 3 * k;
    roundRectPath(ctx, 60 * k, 60 * k, W - 120 * k, H - 120 * k, 32 * k);
    ctx.stroke();

    ctx.fillStyle = '#6B7280';
    ctx.font = `700 ${28 * k}px ${F.mono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(clinic.name.toUpperCase(), W / 2, H * 0.14);

    drawFit(ctx, d.title || 'UPDATE', {
        x: W / 2, y: H * 0.28, maxWidth: W * 0.74, maxLines: 3,
        family: F.display, weight: 700, size: 130 * k, color: '#0E1110', align: 'center', lineRatio: 1.1, minSize: 44,
    });
    drawFit(ctx, d.message || 'Add your message', {
        x: W / 2, y: H * 0.5, maxWidth: W * 0.72, maxLines: 5,
        family: F.sans, weight: 500, size: 48 * k, color: '#374151', align: 'center', lineRatio: 1.3, minSize: 26,
    });
};

const drawFooter = async (ctx: CanvasRenderingContext2D, clinic: Clinic, dims: Dims, loadImg: LoadImg, theme: 'light' | 'dark') => {
    const { w: W, h: H } = dims;
    const k = W / 1080;
    const y = H - 92 * k;

    if (theme === 'dark') {
        const text = `${clinic.name} · retaindental.com`;
        ctx.font = `600 ${28 * k}px ${F.mono}`;
        const tw = ctx.measureText(text).width;
        const pw = tw + 96 * k;
        pill(ctx, (W - pw) / 2, y - 40 * k, pw, 80 * k, 40 * k, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, W / 2, y);
    } else {
        await drawBrandMark(ctx, W / 2, y - 44 * k, 40 * k, loadImg);
        ctx.fillStyle = '#374151';
        ctx.font = `600 ${28 * k}px ${F.mono}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('retaindental.com', W / 2, y + 38 * k);
    }
};

// --- caption suggestions ---
const captionFor = (id: string, d: Record<string, any>, clinic: Clinic): string => {
    switch (id) {
        case 'transformation':
            return `${d.procedure || 'This smile'}, start to finish.\n\nEvery case is different, but the goal is the same: a smile you are glad to show off. Book a consultation with us at ${clinic.name}.`;
        case 'review':
            return `"${d.reviewText || 'The best dental experience.'}"\n\nThank you, ${d.patientName || 'friend'}. Reviews like this are why we do what we do.`;
        case 'myth':
            return `Myth: ${d.myth || '...'}\n\nReality: ${d.fact || '...'}\n\nQuestions about your own teeth? Send us a message and we will explain.`;
        case 'offer':
            return `${d.offerTitle || 'Special offer'} — ${d.offerSub || 'this month only'}.\n\nValid until ${d.expiry || 'further notice'}. Mention this post when you book with ${clinic.name}.`;
        default:
            return `${d.title || 'Update'}\n\n${d.message || ''}`;
    }
};
const hashtagsFor = (clinic: Clinic) => `#dentist #dentalcare #oralhealth #smile #${String(clinic.slug || 'clinic').replace(/[^a-z0-9]/gi, '')}`;

const SocialPostGenerator: React.FC<SocialPostGeneratorProps> = ({ clinic, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [format, setFormat] = useState<Format>(FORMATS[0]);
    const [consent, setConsent] = useState(false);
    const [fontsReady, setFontsReady] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await Promise.all([
                    document.fonts.load('700 64px "Space Grotesk"'),
                    document.fonts.load('600 64px "Plus Jakarta Sans"'),
                    document.fonts.load('700 32px "JetBrains Mono"'),
                ]);
                await document.fonts.ready;
            } catch { /* fonts are best-effort */ }
            if (mounted) setFontsReady(true);
        })();
        return () => { mounted = false; };
    }, []);

    const handleInputChange = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => handleInputChange(key, event.target?.result as string);
        reader.readAsDataURL(file);
    };

    const caption = useMemo(() => captionFor(selectedTemplate.id, formData, clinic), [selectedTemplate.id, formData, clinic]);
    const hashtags = useMemo(() => hashtagsFor(clinic), [clinic]);
    const fullCaption = `${caption}\n\n${hashtags}`;

    const hasPatientPhoto = selectedTemplate.inputs.some((i) => i.type === 'image' && !!formData[i.key]);
    const needsConsent = !!selectedTemplate.consent && hasPatientPhoto;
    const canExport = !needsConsent || consent;

    const dims: Dims = { w: format.w, h: format.h };

    useEffect(() => {
        if (!fontsReady) return;
        let cancelled = false;

        const loadImage: LoadImg = (src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('image load failed'));
            img.src = src;
        });

        const draw = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            setIsGenerating(true);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, dims.w, dims.h);

            try {
                if (selectedTemplate.id === 'transformation') await drawTransformation(ctx, formData, clinic, dims, loadImage);
                else if (selectedTemplate.id === 'review') await drawReview(ctx, formData, clinic, dims, loadImage);
                else if (selectedTemplate.id === 'myth') drawMyth(ctx, formData, clinic, dims);
                else if (selectedTemplate.id === 'offer') drawOffer(ctx, formData, clinic, dims);
                else if (selectedTemplate.id === 'announcement') await drawAnnouncement(ctx, formData, clinic, dims, loadImage);

                if (!cancelled) await drawFooter(ctx, clinic, dims, loadImage, selectedTemplate.theme);
            } catch (err) {
                console.error('Social post draw failed', err);
            }
            if (!cancelled) setIsGenerating(false);
        };

        const timeout = setTimeout(draw, 140);
        return () => { cancelled = true; clearTimeout(timeout); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTemplate, formData, clinic, format, fontsReady]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setExportError(null);
        try {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${clinic.slug}-${selectedTemplate.id}-${format.id}.png`;
            link.href = url;
            link.click();
        } catch {
            setExportError('This image could not be exported. Try re-uploading the photo.');
        }
    };

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(fullCaption);
        } catch {
            const el = document.createElement('textarea');
            el.value = fullCaption;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const grouped = useMemo(() => {
        const order: TemplateCategory[] = ['Social proof', 'Education', 'Culture', 'Promotion'];
        return order.map((cat) => ({ cat, items: TEMPLATES.filter((t) => t.category === cat) })).filter((g) => g.items.length);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-md sm:p-6">
            <div className="flex h-[92vh] w-full max-w-[1400px] overflow-hidden rounded-[24px] bg-white shadow-lift">
                {/* COL 1: templates */}
                <div className="flex w-[300px] shrink-0 flex-col border-r border-ink-950/10 bg-cream-100">
                    <div className="border-b border-ink-950/10 p-5">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-950">
                            <LayoutTemplate size={18} className="text-primary" />
                            Social Studio
                        </h2>
                        <p className="mt-1 text-xs text-ink-500">Make on-brand posts in a minute.</p>
                    </div>

                    <div className="border-b border-ink-950/10 px-5 py-4">
                        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Posting mix</p>
                        <div className="flex h-2 overflow-hidden rounded-full">
                            {Object.entries(PILLARS).map(([name, p]) => (
                                <span key={name} className={p.dot} style={{ width: `${p.share}%` }} />
                            ))}
                        </div>
                        <div className="mt-3 space-y-1.5">
                            {(Object.keys(PILLARS) as Pillar[]).map((name) => (
                                <div key={name} className="flex items-center gap-2 text-[11px] text-ink-500">
                                    <span className={cn('h-1.5 w-1.5 rounded-full', PILLARS[name].dot)} />
                                    <span className="flex-1">{name}</span>
                                    <span className="font-mono text-ink-400">{PILLARS[name].share}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        {grouped.map(({ cat, items }) => (
                            <div key={cat} className="space-y-2">
                                <p className="px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">{cat}</p>
                                {items.map((t) => {
                                    const active = selectedTemplate.id === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => { setSelectedTemplate(t); setFormData({}); setConsent(false); setExportError(null); }}
                                            className={cn(
                                                'w-full rounded-2xl border p-3 text-left transition-all',
                                                active ? 'border-primary bg-white ring-1 ring-primary' : 'border-ink-950/10 bg-white/60 hover:border-primary/40',
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', active ? 'bg-primary/10 text-primary' : 'bg-ink-950/5 text-ink-400')}>
                                                    {t.icon}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-bold text-ink-800">{t.label}</span>
                                                    <span className="block truncate text-[11px] text-ink-400">{t.description}</span>
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COL 2: editor */}
                <div className="flex w-[400px] shrink-0 flex-col border-r border-ink-950/10 bg-white">
                    <div className="flex items-center justify-between border-b border-ink-950/10 p-5">
                        <h2 className="font-bold text-ink-950">Content</h2>
                        <span className={cn('rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider', PILLARS[selectedTemplate.category].tone)}>
                            {selectedTemplate.category}
                        </span>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto p-5">
                        <div>
                            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Format</p>
                            <div className="grid grid-cols-3 gap-2">
                                {FORMATS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f)}
                                        className={cn(
                                            'rounded-xl border px-2 py-2.5 text-center transition-all',
                                            format.id === f.id ? 'border-primary bg-primary/5 text-primary' : 'border-ink-950/10 text-ink-500 hover:border-primary/40',
                                        )}
                                    >
                                        <span className="block text-xs font-bold">{f.label}</span>
                                        <span className="block font-mono text-[10px] text-ink-400">{f.ratio}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedTemplate.inputs.map((input) => (
                            <div key={input.key} className="space-y-1.5">
                                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">{input.label}</label>
                                {input.type === 'text' && (
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-ink-950/10 bg-cream-100 p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}
                                {input.type === 'number' && (
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        className="w-full rounded-xl border border-ink-950/10 bg-cream-100 p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}
                                {input.type === 'textarea' && (
                                    <textarea
                                        className="h-24 w-full resize-none rounded-xl border border-ink-950/10 bg-cream-100 p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}
                                {input.type === 'image' && (
                                    <label className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink-950/10 hover:bg-cream-100">
                                        {formData[input.key] ? (
                                            <>
                                                <img src={formData[input.key]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                                <span className="absolute bottom-2 right-2 rounded-lg bg-ink-950/70 px-2 py-1 font-mono text-[10px] font-bold text-white">Replace</span>
                                            </>
                                        ) : (
                                            <span className="flex flex-col items-center text-ink-400">
                                                <Upload size={22} className="mb-1.5" />
                                                <span className="text-xs font-bold">Upload</span>
                                            </span>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, input.key)} />
                                    </label>
                                )}
                            </div>
                        ))}

                        {selectedTemplate.consent && (
                            <label className={cn(
                                'flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors',
                                consent ? 'border-leaf/40 bg-leaf-soft' : 'border-blush/40 bg-blush-soft',
                            )}>
                                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-leaf" />
                                <span className="text-xs leading-relaxed text-ink-600">
                                    <span className="flex items-center gap-1.5 font-bold text-ink-800">
                                        {consent ? <ShieldCheck size={14} className="text-leaf-deep" /> : <AlertTriangle size={14} className="text-blush-deep" />}
                                        Patient photo consent
                                    </span>
                                    I have written permission from this patient to share their photo and details publicly.
                                </span>
                            </label>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Caption</label>
                                <button onClick={copyCaption} className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                                    {copied ? <Check size={13} /> : <Copy size={13} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                readOnly
                                value={fullCaption}
                                className="h-32 w-full resize-none rounded-xl border border-ink-950/10 bg-cream-100 p-3 text-xs leading-relaxed text-ink-600 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-ink-950/10 bg-cream-100 p-5">
                        {exportError && <p className="text-center text-xs font-semibold text-blush-deep">{exportError}</p>}
                        {needsConsent && !consent && (
                            <p className="text-center text-[11px] font-semibold text-blush-deep">Confirm photo consent to download.</p>
                        )}
                        <button
                            onClick={downloadImage}
                            disabled={!canExport}
                            className={cn(
                                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white shadow-soft transition-all active:scale-[0.98]',
                                canExport ? 'bg-primary hover:brightness-110' : 'cursor-not-allowed bg-ink-300',
                            )}
                        >
                            <Download size={18} />
                            Download PNG
                        </button>
                    </div>
                </div>

                {/* COL 3: preview */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-cream-200 p-10">
                    <button onClick={onClose} className="absolute right-5 top-5 z-20 rounded-full bg-white p-2.5 shadow-sm transition-all hover:shadow-md">
                        <X size={18} className="text-ink-400" />
                    </button>

                    <div className="relative flex h-full items-center justify-center">
                        <div
                            className="overflow-hidden rounded-[20px] bg-white shadow-lift ring-8 ring-white"
                            style={{ aspectRatio: `${format.w} / ${format.h}`, maxHeight: '100%', maxWidth: '100%', height: '100%' }}
                        >
                            <canvas ref={canvasRef} width={format.w} height={format.h} className="h-full w-full" />
                        </div>
                        {(!fontsReady || isGenerating) && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-white/50 backdrop-blur-[1px]">
                                <Loader2 size={26} className="animate-spin text-primary" />
                            </div>
                        )}
                    </div>

                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">
                        {format.w} × {format.h} · {format.ratio}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SocialPostGenerator;
