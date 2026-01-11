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
        const PADDING = 60;
        const HEADER_H = 200;

        // Header
        ctx.fillStyle = clinic.primaryColor || '#000';
        ctx.font = 'bold 40px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(clinic.name.toUpperCase(), CANVAS_WIDTH / 2, 120);

        ctx.fillStyle = '#64748b';
        ctx.font = '30px "Inter", sans-serif';
        ctx.fillText((data.procedure || "Smile Transformation").toUpperCase(), CANVAS_WIDTH / 2, 170);

        const cardH = 650;
        const cardW = CANVAS_WIDTH - (PADDING * 2);

        const drawCard = (imgSrc: string, y: number, label: string) => {
            // Shadow
            ctx.shadowColor = "rgba(0,0,0,0.1)";
            ctx.shadowBlur = 30; ctx.shadowOffsetY = 20;
            ctx.fillStyle = 'white';
            ctx.roundRect(PADDING, y, cardW, cardH, 40);
            ctx.fill();
            ctx.shadowColor = 'transparent';

            // Image setup
            if (imgSrc) {
                // We need to load inside here, but for now assuming pre-loaded or we handle async outside.
                // The main useEffect handles async, but here we need to await. 
            }
        };

        // For simplicity in this refactor, I'll inline the image logic briefly or assume wrapper helper handles it.
        // Re-using the logic from previous version but simplified:

        const img1 = data.beforeImage ? await loadImg(data.beforeImage) : null;
        const img2 = data.afterImage ? await loadImg(data.afterImage) : null;

        const drawImg = (img: any, y: number, label: string) => {
            ctx.fillStyle = 'white';
            ctx.roundRect(PADDING, y, cardW, cardH, 40);
            ctx.fill();

            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(PADDING + 20, y + 20, cardW - 40, cardH - 40, 20);
                ctx.clip();

                // Cover
                const scale = Math.max((cardW - 40) / img.width, (cardH - 40) / img.height);
                ctx.drawImage(img, PADDING + 20, y + 20, img.width * scale, img.height * scale);
                ctx.restore();
            } else {
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(PADDING + 20, y + 20, cardW - 40, cardH - 40);
                ctx.fillStyle = '#94a3b8';
                ctx.font = 'bold 30px "Inter"';
                ctx.fillText("Upload Photo", CANVAS_WIDTH / 2, y + cardH / 2);
            }

            // Badge
            ctx.fillStyle = clinic.primaryColor || 'black';
            ctx.roundRect(PADDING + 40, y - 25, 200, 60, 30);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px "Inter"';
            ctx.fillText(label, PADDING + 140, y + 15);
        };

        drawImg(img1, 250, "BEFORE");
        drawImg(img2, 950, "AFTER");
    };

    const drawReview = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        // Background Photo
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);

            // Dark Overlay
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
            // Pattern bg
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Speech Bubble Card
        const cardY = 1100;
        const cardH = 500;

        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 50;
        ctx.fillStyle = 'white';
        ctx.roundRect(80, cardY, CANVAS_WIDTH - 160, cardH, 40);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Stars
        const stars = parseInt(data.stars) || 5;
        let starStr = "★".repeat(stars);
        ctx.fillStyle = '#fbbf24'; // Amber
        ctx.font = '80px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText(starStr, CANVAS_WIDTH / 2, cardY + 120);

        // Quote
        ctx.fillStyle = '#1e293b';
        ctx.font = 'italic 50px "Inter"';
        drawTextMultiline(ctx, data.reviewText || "Amazing service!", CANVAS_WIDTH / 2, cardY + 220, 800, 70);

        // Name
        ctx.fillStyle = clinic.primaryColor || 'black';
        ctx.font = 'bold 35px "Inter"';
        ctx.fillText("- " + (data.patientName || "Happy Patient"), CANVAS_WIDTH / 2, cardY + 420);
    };

    const drawMyth = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        // Split Screen
        // Top Red
        ctx.fillStyle = '#fee2e2'; // Red-100
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT / 2);

        // Bottom Green
        ctx.fillStyle = '#dcfce7'; // Green-100
        ctx.fillRect(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT / 2);

        // Text
        ctx.fillStyle = '#991b1b'; // Red-800
        ctx.font = 'bold 80px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText("MYTH", CANVAS_WIDTH / 2, 300);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 50px "Inter"';
        drawTextMultiline(ctx, data.myth || "Waiting", CANVAS_WIDTH / 2, 450, 900, 70);

        // VS Badge
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 60px "Inter"';
        ctx.fillText("VS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        // Fact
        ctx.fillStyle = '#166534'; // Green-800
        ctx.font = 'bold 80px "Inter"';
        ctx.fillText("FACT", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 300);

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 50px "Inter"';
        drawTextMultiline(ctx, data.fact || "Action", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 450, 900, 70);
    };

    const drawOffer = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic) => {
        // Dark Bg
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Big number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 180px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText(data.offerTitle || "SALE", CANVAS_WIDTH / 2, 800);

        // Sub
        ctx.fillStyle = clinic.primaryColor || '#4f46e5';
        ctx.font = 'bold 60px "Inter"';
        ctx.fillText(data.offerSub || "Limited Time", CANVAS_WIDTH / 2, 1000);

        // Date
        ctx.fillStyle = '#94a3b8';
        ctx.font = '40px "Inter"';
        ctx.fillText("Valid until " + (data.expiry || "soon"), CANVAS_WIDTH / 2, 1200);
    };

    const drawAnnouncement = async (ctx: CanvasRenderingContext2D, data: any, clinic: Clinic, loadImg: any) => {
        if (data.mainImage) {
            const img = await loadImg(data.mainImage);
            const scale = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(100, 500, CANVAS_WIDTH - 200, 800);
        } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.strokeStyle = clinic.primaryColor || 'black';
            ctx.lineWidth = 20;
            ctx.strokeRect(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100);
        }

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.font = 'bold 80px "Inter"';
        ctx.fillText(data.title || "Update", CANVAS_WIDTH / 2, 800);

        ctx.font = '40px "Inter"';
        drawTextMultiline(ctx, data.message || "Message here", CANVAS_WIDTH / 2, 1000, 700, 60);
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
