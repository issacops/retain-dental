import React, { useRef, useState, useEffect } from 'react';
import { X, Upload, Download, Sparkles, RefreshCw, LayoutTemplate, Star, BadgePercent, Megaphone, Stethoscope, ChevronRight } from 'lucide-react';
import { Clinic } from '../../../types';

interface SocialPostGeneratorProps {
    clinic: Clinic;
    onClose: () => void;
}

// --- TEMPLATE DEFINITIONS ---
type TemplateCategory = 'Trust' | 'Education' | 'Sales' | 'Engagement';

interface TemplateConfig {
    id: string;
    label: string;
    category: TemplateCategory;
    icon: React.ReactNode;
    description: string;
    inputs: {
        key: string;
        label: string;
        type: 'text' | 'image' | 'textarea' | 'number' | 'date';
        placeholder?: string;
    }[];
}

const TEMPLATES: TemplateConfig[] = [
    {
        id: 'transformation',
        label: 'Transformation Story',
        category: 'Trust',
        icon: <Sparkles size={18} />,
        description: 'Classic Before & After showcase',
        inputs: [
            { key: 'beforeImage', label: 'Before Photo', type: 'image' },
            { key: 'afterImage', label: 'After Photo', type: 'image' },
            { key: 'procedure', label: 'Procedure Name', type: 'text', placeholder: 'e.g. Invisalign' }
        ]
    },
    {
        id: 'review',
        label: 'Hero Review',
        category: 'Trust',
        icon: <Star size={18} />,
        description: 'Highlight patient feedback',
        inputs: [
            { key: 'mainImage', label: 'Patient Photo', type: 'image' },
            { key: 'reviewText', label: 'Review', type: 'textarea', placeholder: '"Best experience ever..."' },
            { key: 'patientName', label: 'Patient Name', type: 'text', placeholder: 'Sarah J.' },
            { key: 'stars', label: 'Star Rating', type: 'number', placeholder: '5' }
        ]
    },
    {
        id: 'myth',
        label: 'Myth Buster',
        category: 'Education',
        icon: <Stethoscope size={18} />,
        description: 'Educate patients on facts',
        inputs: [
            { key: 'myth', label: 'The Myth (Red)', type: 'text', placeholder: 'Root canals hurt' },
            { key: 'fact', label: 'The Fact (Green)', type: 'text', placeholder: 'They relieve pain instantly' }
        ]
    },
    {
        id: 'offer',
        label: 'Limited Offer',
        category: 'Sales',
        icon: <BadgePercent size={18} />,
        description: 'Drive urgency for sales',
        inputs: [
            { key: 'offerTitle', label: 'Offer Title', type: 'text', placeholder: '₹500 OFF' },
            { key: 'offerSub', label: 'Sub-text', type: 'text', placeholder: 'On all cleaning services' },
            { key: 'expiry', label: 'Valid Until', type: 'text', placeholder: 'Aug 31st' }
        ]
    },
    {
        id: 'announcement',
        label: 'Clinic Update',
        category: 'Engagement',
        icon: <Megaphone size={18} />,
        description: 'Hours, holidays, or news',
        inputs: [
            { key: 'title', label: 'Headline', type: 'text', placeholder: 'We are Open!' },
            { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Now open on Sundays from 10am...' },
            { key: 'mainImage', label: 'Optional Photo', type: 'image' }
        ]
    }
];

const SocialPostGenerator: React.FC<SocialPostGeneratorProps> = ({ clinic, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    // Canvas dimensions for Instagram Story (9:16 aspect ratio, high res)
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1920;

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                handleInputChange(key, event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CANVAS DRAWING LOGIC ---
    useEffect(() => {
        const draw = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            setIsGenerating(true);

            // Common Utilities
            const loadImage = (src: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                    img.src = src;
                });
            };

            // 1. Clear & Background
            const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            gradient.addColorStop(0, '#f8fafc');
            gradient.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 2. Render Template Specifics
            try {
                if (selectedTemplate.id === 'transformation') {
                    await drawTransformation(ctx, formData, clinic, loadImage);
                } else if (selectedTemplate.id === 'review') {
                    await drawReview(ctx, formData, clinic, loadImage);
                } else if (selectedTemplate.id === 'myth') {
                    await drawMyth(ctx, formData, clinic);
                } else if (selectedTemplate.id === 'offer') {
                    await drawOffer(ctx, formData, clinic);
                } else if (selectedTemplate.id === 'announcement') {
                    await drawAnnouncement(ctx, formData, clinic, loadImage);
                }

                // 3. Footer Branding (Common)
                await drawFooter(ctx, clinic, loadImage);

            } catch (err) {
                console.error("Draw error", err);
            }

            setIsGenerating(false);
        };

        const timeout = setTimeout(draw, 100);
        return () => clearTimeout(timeout);
    }, [selectedTemplate, formData, clinic]);

    // --- TEMPLATE DRAWERS ---

    const drawTransformation = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        const PADDING = 50;

        // Background: Subtle modern gradient
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Header: Minimal & Clean
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(40, 40, CANVAS_WIDTH - 80, 160, 80);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Logo in Header
        if (clinic.logoUrl) {
            try {
                const logo = await loadImg(clinic.logoUrl);
                const size = 100;
                const scale = Math.min(size / logo.width, size / logo.height);
                ctx.drawImage(logo, 80, 70, logo.width * scale, logo.height * scale);

                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 36px "Inter"';
                ctx.textAlign = 'left';
                ctx.fillText(clinic.name.toUpperCase(), 200, 125);
            } catch (e) { }
        }

        // Title 
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 28px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText((data.procedure || "SMILE TRANSFORMATION").toUpperCase(), CANVAS_WIDTH / 2, 260);

        // Image Cards (Vertical Stack)
        const cardW = CANVAS_WIDTH - (PADDING * 2);
        const cardH = 620;

        const drawImgCard = (img: HTMLImageElement | null, y: number, label: string) => {
            // Card Base
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.roundRect(PADDING, y, cardW, cardH, 40);
            ctx.fill();
            ctx.shadowColor = 'transparent';

            // Image Clip
            const innerPad = 15;
            const imgX = PADDING + innerPad;
            const imgY = y + innerPad;
            const imgW = cardW - (innerPad * 2);
            const imgH = cardH - (innerPad * 2);

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(imgX, imgY, imgW, imgH, 25);
            ctx.clip();

            if (img) {
                // Object Fit: Cover (Critical Fix)
                const scale = Math.max(imgW / img.width, imgH / img.height);
                const xOffset = (imgW - (img.width * scale)) / 2;
                const yOffset = (imgH - (img.height * scale)) / 2;
                ctx.drawImage(img, imgX + xOffset, imgY + yOffset, img.width * scale, img.height * scale);
            } else {
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(imgX, imgY, imgW, imgH);
                ctx.fillStyle = '#cbd5e1';
                ctx.textAlign = 'center';
                ctx.fillText("Upload Photo", imgX + imgW / 2, imgY + imgH / 2);
            }
            ctx.restore();

            // Glassmorphism Badge
            const badgeW = 220;
            const badgeH = 70;
            const badgeX = PADDING + 40;
            const badgeY = y - 35; // Floating overlap

            // Glass BG
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 35);
            ctx.fill();
            ctx.shadowColor = 'transparent';

            // Text
            ctx.fillStyle = clinic.primaryColor || '#000';
            ctx.font = 'bold 28px "Inter"';
            ctx.textAlign = 'center';
            ctx.fillText(label, badgeX + (badgeW / 2), badgeY + 45);
        };

        const img1 = data.beforeImage ? await loadImg(data.beforeImage) : null;
        const img2 = data.afterImage ? await loadImg(data.afterImage) : null;

        drawImgCard(img1, 320, "BEFORE");
        drawImgCard(img2, 1020, "AFTER");
    };

    // 2. HERO REVIEW (Yelp/Google Style Refined)
    const drawReview = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        // Background Photo (Blurred)
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);

            // Heavy Blur Overlay
            ctx.fillStyle = 'rgba(0,0,0,0.6)'; // Darker for contrast
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
            // Gradient fallback
            const grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // The Card
        const cardY = 600;
        const cardW = 900;
        const cardH = 900;
        const x = (CANVAS_WIDTH - cardW) / 2;

        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 60; ctx.shadowOffsetY = 30;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardW, cardH, 50);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Giant Quote Icon
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 300px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText('“', CANVAS_WIDTH / 2, cardY + 250);

        // Stars
        const stars = parseInt(data.stars) || 5;
        let starStr = "";
        for (let i = 0; i < stars; i++) starStr += "★ ";
        ctx.fillStyle = '#f59e0b'; // Amber-500
        ctx.font = '60px "Inter"';
        ctx.fillText(starStr.trim(), CANVAS_WIDTH / 2, cardY + 120);

        // Review Text
        ctx.fillStyle = '#1e293b';
        ctx.font = 'medium 52px "Inter"';
        // We need a tighter wrap for the card
        drawTextMultiline(ctx, data.reviewText || "Write your review here...", CANVAS_WIDTH / 2, cardY + 400, cardW - 100, 75);

        // Patient Name
        ctx.fillStyle = clinic.primaryColor || '#4f46e5';
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText("- " + (data.patientName || "Patient Name"), CANVAS_WIDTH / 2, cardY + cardH - 100);

        // Patient Photo (Avatar)
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            ctx.save();
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH / 2, cardY - 80, 80, 0, Math.PI * 2);
            ctx.clip();
            const sc = Math.max(160 / img.width, 160 / img.height);
            ctx.drawImage(img, (CANVAS_WIDTH / 2) - (img.width * sc / 2), cardY - 80 - (img.height * sc / 2), img.width * sc, img.height * sc);
            ctx.restore();
            // Border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 10;
            ctx.stroke();
        }
    };

    // 3. MYTH BUSTER (Modern Split Cards)
    const drawMyth = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        // Bg
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Header
        ctx.fillStyle = clinic.primaryColor || 'black';
        ctx.font = 'bold 50px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText("DENTAL TRUTHS", CANVAS_WIDTH / 2, 150);

        // Myth Card (Red Scheme)
        const cardW = 900;
        const cardH = 650;

        // Card 1
        ctx.fillStyle = '#fef2f2'; // Red-50
        ctx.beginPath();
        ctx.roundRect((CANVAS_WIDTH - cardW) / 2, 250, cardW, cardH, 40);
        ctx.fill();
        // Accent stroke
        ctx.strokeStyle = '#fee2e2'; ctx.lineWidth = 6; ctx.stroke();

        ctx.fillStyle = '#ef4444'; // Red-500
        ctx.font = 'bold 30px "Inter"';
        ctx.fillText("MYTH", CANVAS_WIDTH / 2, 320);

        ctx.fillStyle = '#7f1d1d';
        ctx.font = 'bold 60px "Inter"';
        drawTextMultiline(ctx, data.myth || "Wearing braces hurts all the time", CANVAS_WIDTH / 2, 450, 800, 80);

        // VS Check
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, 250 + cardH + 60, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText("VS", CANVAS_WIDTH / 2, 250 + cardH + 75);

        // Fact Card (Teal/Green Scheme)
        const y2 = 250 + cardH + 120;
        ctx.fillStyle = '#f0fdf4'; // Green-50
        ctx.beginPath();
        ctx.roundRect((CANVAS_WIDTH - cardW) / 2, y2, cardW, cardH, 40);
        ctx.fill();
        ctx.strokeStyle = '#dcfce7'; ctx.stroke();

        ctx.fillStyle = '#22c55e'; // Green-500
        ctx.font = 'bold 30px "Inter"';
        ctx.fillText("FACT", CANVAS_WIDTH / 2, y2 + 70);

        ctx.fillStyle = '#14532d';
        ctx.font = 'bold 60px "Inter"';
        drawTextMultiline(ctx, data.fact || "New tech makes it comfortable!", CANVAS_WIDTH / 2, y2 + 200, 800, 80);
    };

    // 4. OFFER (Premium Gift Card Style)
    const drawOffer = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        // Dark Luxury Bg
        const bg = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        bg.addColorStop(0, '#0f172a');
        bg.addColorStop(1, '#1e293b');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Gold Confetti (Dots)
        ctx.fillStyle = '#d4af37'; // Gold
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // The Ticket
        const cardW = 900;
        const cardH = 1000;
        const x = (CANVAS_WIDTH - cardW) / 2;
        const y = (CANVAS_HEIGHT - cardH) / 2 - 100;

        // Gold Border Gradient
        const borderGrad = ctx.createLinearGradient(x, y, x + cardW, y + cardH);
        borderGrad.addColorStop(0, '#fcd34d');
        borderGrad.addColorStop(0.5, '#fffbeb');
        borderGrad.addColorStop(1, '#d97706');

        ctx.lineWidth = 20;
        ctx.strokeStyle = borderGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, cardH, 40);
        ctx.stroke();

        // Inner Dark Card
        ctx.fillStyle = '#1e1b4b'; // Indigo-950 (Rich)
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, cardW - 20, cardH - 20, 30);
        ctx.fill();

        // Content
        ctx.fillStyle = '#fbbf24'; // Amber-400
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText("EXCLUSIVE OFFER", CANVAS_WIDTH / 2, y + 150);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 160px "Inter"';
        ctx.fillText(data.offerTitle || "50% OFF", CANVAS_WIDTH / 2, y + 450);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '40px "Inter"';
        ctx.fillText(data.offerSub || "On Dental Implants", CANVAS_WIDTH / 2, y + 600);

        // Button style
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect((CANVAS_WIDTH - 400) / 2, y + 750, 400, 100, 50);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.font = 'bold 36px "Inter"';
        ctx.fillText("CLAIM NOW", CANVAS_WIDTH / 2, y + 815);

        // Expiry
        ctx.fillStyle = '#64748b';
        ctx.font = '30px "Inter"';
        ctx.fillText("Valid until " + (data.expiry || "soon"), CANVAS_WIDTH / 2, y + 930);
    };

    // 5. ANNOUNCEMENT (Frosted Glass)
    const drawAnnouncement = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
        } else {
            ctx.fillStyle = clinic.primaryColor || '#4f46e5';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            // Pattern
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.arc(0, 0, 800, 0, Math.PI * 2);
            ctx.fill();
        }

        // Frosted Card
        const cardY = 800;
        const cardH = 900;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.roundRect(50, cardY, CANVAS_WIDTH - 100, cardH, 50);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Icon
        ctx.fillStyle = clinic.primaryColor || '#000';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, cardY - 80, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'white';
        // Simplified Bell/Megaphone shape
        ctx.fillStyle = 'white';
        ctx.font = 'bold 100px "Inter"';
        ctx.fillText("!", CANVAS_WIDTH / 2, cardY - 45);

        // Text
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 70px "Inter"';
        ctx.textAlign = 'center';
        drawTextMultiline(ctx, (data.title || "We Have News").toUpperCase(), CANVAS_WIDTH / 2, cardY + 150, 800, 90);

        ctx.fillStyle = '#475569';
        ctx.font = '45px "Inter"';
        drawTextMultiline(ctx, data.message || "Message here...", CANVAS_WIDTH / 2, cardY + 350, 800, 70);
    };

    const drawFooter = async (ctx: CanvasRenderingContext2D, clinic: Clinic, loadImg: any) => {
        const y = CANVAS_HEIGHT - 100;

        // Logo
        if (clinic.logoUrl) {
            try {
                const img = await loadImg(clinic.logoUrl);
                // Circular branding
                ctx.save();
                ctx.beginPath();
                ctx.arc(CANVAS_WIDTH / 2, y - 80, 60, 0, Math.PI * 2);
                ctx.clip();
                ctx.fillStyle = 'white';
                ctx.fill();
                // Draw logo centered
                const size = 100;
                const scale = Math.min(size / img.width, size / img.height);
                ctx.drawImage(img, (CANVAS_WIDTH / 2) - (img.width * scale / 2), y - 80 - (img.height * scale / 2), img.width * scale, img.height * scale);
                ctx.restore();
            } catch (e) { }
        }

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 30px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText(clinic.slug + ".retain.os", CANVAS_WIDTH / 2, y + 40);
    };

    const drawTextMultiline = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `${clinic.slug}-${selectedTemplate.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-[1400px] h-[90vh] flex overflow-hidden shadow-2xl">
                {/* COL 1: Template Gallery */}
                <div className="w-[320px] bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <LayoutTemplate size={20} className="text-indigo-600" />
                            Templates
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setSelectedTemplate(t); setFormData({}); }}
                                className={`w-full p-4 rounded-xl text-left border transition-all ${selectedTemplate.id === t.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTemplate.id === t.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {t.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-sm">{t.label}</h3>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.category}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* COL 2: Editor */}
                <div className="w-[400px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-lg">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Edit Content</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {selectedTemplate.inputs.map(input => (
                            <div key={input.key} className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-400">{input.label}</label>

                                {input.type === 'text' && (
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}

                                {input.type === 'number' && (
                                    <input
                                        type="number"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}

                                {input.type === 'textarea' && (
                                    <textarea
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                        placeholder={input.placeholder}
                                        value={formData[input.key] || ''}
                                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    />
                                )}

                                {input.type === 'image' && (
                                    <label className="flex flex-col items-center justify-center h-40 w-full border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer overflow-hidden relative">
                                        {formData[input.key] ? (
                                            <img src={formData[input.key]} className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <Upload size={24} className="mb-2" />
                                                <span className="text-xs font-bold">Upload</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, input.key)} />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-6 border-t border-slate-200 bg-slate-50">
                        <button onClick={downloadImage} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]">
                            <Download size={20} />
                            Download Post
                        </button>
                    </div>
                </div>

                {/* COL 3: Preview */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-[20px_20px] opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="absolute top-6 right-6 z-20">
                        <button onClick={onClose} className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="h-full aspect-[9/16] bg-white shadow-2xl rounded-[20px] overflow-hidden relative ring-8 ring-white">
                        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialPostGenerator;
