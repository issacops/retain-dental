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

    // --- UTILS ---
    const drawNoise = (ctx: CanvasRenderingContext2D) => {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const idata = ctx.getImageData(0, 0, w, h);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;
        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.1) {
                // Add subtle noise 
                idata.data[i * 4] = Math.min(255, idata.data[i * 4] + 5);
                idata.data[i * 4 + 1] = Math.min(255, idata.data[i * 4 + 1] + 5);
                idata.data[i * 4 + 2] = Math.min(255, idata.data[i * 4 + 2] + 5);
            }
        }
        ctx.putImageData(idata, 0, 0);
    };

    // --- V4 WORLD CLASS TEMPLATES ---

    // 1. TRANSFORMATION: "The Split" (Maximized Visuals)
    const drawTransformation = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        // Fill BG
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const img1 = data.beforeImage ? await loadImg(data.beforeImage) : null;
        const img2 = data.afterImage ? await loadImg(data.afterImage) : null;

        // Layout: Top Half (Before), Bottom Half (After)
        // Split Point
        const splitY = CANVAS_HEIGHT / 2;

        const drawHalf = (img: HTMLImageElement | null, y: number, h: number, label: string, isTop: boolean) => {
            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, y, CANVAS_WIDTH, h);
                ctx.clip();
                // Objective: Cover
                const scale = Math.max(CANVAS_WIDTH / img.width, h / img.height);
                const xOff = (CANVAS_WIDTH - (img.width * scale)) / 2;
                const yOff = y + (h - (img.height * scale)) / 2;
                ctx.drawImage(img, xOff, yOff, img.width * scale, img.height * scale);
                ctx.restore();
            } else {
                ctx.fillStyle = isTop ? '#f1f5f9' : '#e2e8f0';
                ctx.fillRect(0, y, CANVAS_WIDTH, h);
                ctx.fillStyle = '#94a3b8';
                ctx.font = 'bold 40px "Inter"';
                ctx.textAlign = 'center';
                ctx.fillText("Upload Photo", CANVAS_WIDTH / 2, y + h / 2);
            }

            // Tag (High Contrast)
            const tagY = isTop ? y + 60 : y + h - 140;
            const tagX = 60;

            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 20;
            ctx.fillStyle = clinic.primaryColor || 'black';
            ctx.beginPath();
            ctx.roundRect(tagX, tagY, 240, 80, 40);
            ctx.fill();
            ctx.shadowColor = 'transparent';

            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px "Inter"';
            ctx.textAlign = 'center';
            ctx.fillText(label, tagX + 120, tagY + 50);
        };

        drawHalf(img1, 0, splitY, "BEFORE", true);
        drawHalf(img2, splitY, splitY, "AFTER", false);

        // The "Split" Interface Line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(0, splitY);
        ctx.lineTo(CANVAS_WIDTH, splitY);
        ctx.stroke();

        // Center "Slider" Icon
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, splitY, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Arrows / Icon
        ctx.fillStyle = clinic.primaryColor || 'black';
        ctx.beginPath();
        // Simple arrows
        ctx.font = 'bold 60px "Inter"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("↕", CANVAS_WIDTH / 2, splitY + 5);

        // Header (Floating Overlay)
        if (clinic.logoUrl) {
            try {
                const logo = await loadImg(clinic.logoUrl);
                ctx.save();
                // Draw logo top right with white glow
                ctx.shadowColor = 'white'; ctx.shadowBlur = 20;
                const size = 120;
                const scale = Math.min(size / logo.width, size / logo.height);
                ctx.drawImage(logo, CANVAS_WIDTH - 150, 50, logo.width * scale, logo.height * scale);
                ctx.restore();
            } catch (e) { }
        }
    };

    // 2. HERO REVIEW (Yelp/Google Style Refined)
    // 2. REVIEW: "The Editorial Quote"
    const drawReview = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        // Deep Brand Background
        const bgParams = clinic.primaryColor || '#4f46e5';
        ctx.fillStyle = bgParams; // Solid Brand Color
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Gradient Overlay (Top to Bottom: Light to Dark)
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Background Watermark (Quote Mark)
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.font = 'bold 1000px "Times New Roman"'; // Serif for class
        ctx.textAlign = 'center';
        ctx.fillText("”", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200);

        // Patient Photo (Large circle top)
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            ctx.save();
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH / 2, 400, 150, 0, Math.PI * 2);
            ctx.clip();
            // Cover
            const s = Math.max(300 / img.width, 300 / img.height);
            ctx.drawImage(img, (CANVAS_WIDTH / 2) - (img.width * s) / 2, 400 - (img.height * s) / 2, img.width * s, img.height * s);
            ctx.restore();

            // Gold Border
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(CANVAS_WIDTH / 2, 400, 154, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Stars
        const stars = parseInt(data.stars) || 5;
        let starStr = "";
        for (let i = 0; i < stars; i++) starStr += "★";
        ctx.fillStyle = '#fbbf24';
        ctx.font = '80px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText(starStr, CANVAS_WIDTH / 2, 650);

        // The Quote
        ctx.fillStyle = 'white';
        // Elegant Serif for quote
        ctx.font = '400 italic 70px "Georgia", serif';
        // We use slightly smaller width to create "Air"
        drawTextMultiline(ctx, `"${data.reviewText || "Best dental experience."}"`, CANVAS_WIDTH / 2, 850, 850, 100);

        // Name
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText((data.patientName || "Satisfied Patient").toUpperCase(), CANVAS_WIDTH / 2, 1400);

        // Clinic Branding (Bottom)
        ctx.font = '30px "Inter"';
        ctx.fillText(clinic.name, CANVAS_WIDTH / 2, 1460);

        drawNoise(ctx);
    };

    // 3. MYTH BUSTER (Modern Split Cards)
    // 3. MYTH: "Infographic Style"
    const drawMyth = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Header Bar
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, 200);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText("DENTAL FACTS 101", CANVAS_WIDTH / 2, 120);

        // Section 1: The Myth (X)
        const y1 = 300;
        ctx.fillStyle = '#ef4444'; // Red Icon
        ctx.font = 'bold 120px "Inter"';
        ctx.fillText("✕", 150, y1 + 100);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#991b1b';
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText("THE MYTH", 300, y1 + 50);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 60px "Inter"';
        drawTextMultiline(ctx, data.myth || "Wait...", 300, y1 + 140, 700, 80);

        // Divider
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 800);
        ctx.lineTo(CANVAS_WIDTH - 100, 800);
        ctx.stroke();

        // Section 2: The Fact (Check)
        const y2 = 900;
        ctx.textAlign = 'center'; // Reset for icon
        ctx.fillStyle = '#22c55e';
        ctx.fillText("✓", 150, y2 + 100);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 40px "Inter"';
        ctx.fillText("THE REALITY", 300, y2 + 50);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 60px "Inter"';
        drawTextMultiline(ctx, data.fact || "Truth!", 300, y2 + 140, 700, 80);

        // Bottom Callout
        ctx.fillStyle = clinic.primaryColor || 'black';
        ctx.fillRect(100, 1400, CANVAS_WIDTH - 200, 200);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = 'bold 50px "Inter"';
        ctx.fillText("Don't believe everything you hear.", CANVAS_WIDTH / 2, 1515);
    };

    // 4. OFFER (Premium Gift Card Style)
    // 4. OFFER: "Swiss Grid"
    const drawOffer = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        // Bright Vibrant BG
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Huge Typography Layout
        ctx.fillStyle = '#000';
        ctx.font = 'bold 350px "Inter"';
        ctx.textAlign = 'center';
        // E.g. "50%"
        const title = data.offerTitle || "SALE";
        ctx.fillText(title, CANVAS_WIDTH / 2, 600);

        // Background box for subtitle
        ctx.fillStyle = clinic.primaryColor || 'blue';
        ctx.fillRect(0, 700, CANVAS_WIDTH, 400);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 100px "Inter"';
        drawTextMultiline(ctx, (data.offerSub || "Special Offer").toUpperCase(), CANVAS_WIDTH / 2, 900, 900, 120);

        // Grid lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.strokeRect(40, 40, CANVAS_WIDTH - 80, CANVAS_HEIGHT - 80);
        ctx.beginPath();
        ctx.moveTo(40, 1200);
        ctx.lineTo(CANVAS_WIDTH - 40, 1200);
        ctx.stroke();

        // Footer details
        ctx.fillStyle = '#000';
        ctx.font = '50px "Inter"';
        ctx.fillText("VALID UNTIL " + (data.expiry || "FOREVER"), CANVAS_WIDTH / 2, 1400);

        drawNoise(ctx);
    };

    // 5. ANNOUNCEMENT: "Blur & Type"
    const drawAnnouncement = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
        } else {
            ctx.fillStyle = clinic.primaryColor || '#000';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Heavy frost
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.strokeRect(80, 80, CANVAS_WIDTH - 160, CANVAS_HEIGHT - 160);

        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.font = 'bold 60px "Inter"';
        ctx.fillText(clinic.name.toUpperCase(), CANVAS_WIDTH / 2, 200);

        ctx.font = 'bold 150px "Inter"';
        drawTextMultiline(ctx, data.title || "UPDATE", CANVAS_WIDTH / 2, 600, 900, 160);

        ctx.font = '50px "Inter"';
        drawTextMultiline(ctx, data.message || "Details...", CANVAS_WIDTH / 2, 1000, 800, 80);

        drawNoise(ctx);
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
