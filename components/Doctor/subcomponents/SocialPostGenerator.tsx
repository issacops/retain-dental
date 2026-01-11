import React, { useRef, useState, useEffect } from 'react';
import { X, Upload, Download, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { Clinic } from '../../types';

interface SocialPostGeneratorProps {
    clinic: Clinic;
    onClose: () => void;
}

const SocialPostGenerator: React.FC<SocialPostGeneratorProps> = ({ clinic, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Canvas dimensions for Instagram Story (9:16 aspect ratio, high res)
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1920;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (type === 'before') setBeforeImage(event.target?.result as string);
                else setAfterImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const drawCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsGenerating(true);

        const PADDING = 60;
        const HEADER_HEIGHT = 180;
        const FOOTER_HEIGHT = 150;
        const CONTENT_WIDTH = CANVAS_WIDTH - (PADDING * 2);

        // Helper to load image
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(e);
                img.src = src;
            });
        };

        // 1. Background (Light Editorial Look)
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Accent Shapes (Subtle)
        ctx.fillStyle = clinic.primaryColor || '#4f46e5';
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH, 0, 600, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // 3. HEADER: Logo + Name (Top Left)
        if (clinic.logoUrl) {
            try {
                const logoImg = await loadImage(clinic.logoUrl);
                const logoSize = 100;
                const scale = Math.min(logoSize / logoImg.width, logoSize / logoImg.height);
                const w = logoImg.width * scale;
                const h = logoImg.height * scale;
                ctx.drawImage(logoImg, PADDING, PADDING, w, h);

                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 45px "Inter", sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(clinic.name.toUpperCase(), PADDING + w + 30, PADDING + (logoSize / 2));
            } catch (e) {
                ctx.fillStyle = clinic.primaryColor || '#000';
                ctx.font = 'black 60px "Inter", sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(clinic.name, PADDING, PADDING + 50);
            }
        } else {
            ctx.fillStyle = clinic.primaryColor || '#000';
            ctx.font = 'black 60px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(clinic.name, PADDING, PADDING + 50);
        }



        const drawImageCard = (img: HTMLImageElement | null, yPos: number, label: string) => {
            const cardHeight = ((CANVAS_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 100) / 2) - 40;

            // Shadow & Card
            ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
            ctx.shadowBlur = 40;
            ctx.shadowOffsetY = 20;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(PADDING, yPos, CONTENT_WIDTH, cardHeight, 40);
            ctx.fill();
            ctx.shadowColor = "transparent";

            // Image Clip
            const imgPad = 20;
            const imgW = CONTENT_WIDTH - (imgPad * 2);
            const imgH = cardHeight - (imgPad * 2);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(PADDING + imgPad, yPos + imgPad, imgW, imgH, 24);
            ctx.clip();

            if (img) {
                const scale = Math.max(imgW / img.width, imgH / img.height);
                const xOffset = (imgW - (img.width * scale)) / 2;
                const yOffset = (imgH - (img.height * scale)) / 2;
                ctx.drawImage(img, PADDING + imgPad + xOffset, yPos + imgPad + yOffset, img.width * scale, img.height * scale);
            } else {
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(PADDING + imgPad, yPos + imgPad, imgW, imgH);
                ctx.fillStyle = '#cbd5e1';
                ctx.font = 'bold 30px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("Upload Photo", PADDING + (CONTENT_WIDTH / 2), yPos + (cardHeight / 2));
            }
            ctx.restore();

            // Floating Label
            const labelW = 180;
            const labelH = 50;
            const labelX = PADDING + 40;
            const labelY = yPos - 25;

            ctx.fillStyle = clinic.primaryColor || '#4f46e5';
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            ctx.beginPath();
            ctx.roundRect(labelX, labelY, labelW, labelH, 25);
            ctx.fill();
            ctx.shadowColor = "transparent";

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, labelX + (labelW / 2), labelY + (labelH / 2) + 2);
        };

        try {
            const img1 = beforeImage ? await loadImage(beforeImage) : null;
            const img2 = afterImage ? await loadImage(afterImage) : null;

            const cardH = ((CANVAS_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - 100) / 2) - 40;
            drawImageCard(img1, HEADER_HEIGHT + 60, "BEFORE");
            drawImageCard(img2, HEADER_HEIGHT + 60 + cardH + 80, "AFTER");

            // 5. Footer CTA
            const footerStart = CANVAS_HEIGHT - FOOTER_HEIGHT;
            ctx.fillStyle = '#334155';
            ctx.font = '500 28px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("Ready for your new smile?", CANVAS_WIDTH / 2, footerStart + 40);

            ctx.fillStyle = clinic.primaryColor || '#4f46e5';
            ctx.font = 'bold 36px "Inter", sans-serif';
            ctx.fillText(`Book now at ${clinic.slug}.retain.os`, CANVAS_WIDTH / 2, footerStart + 90);

        } catch (err) {
            console.error("Canvas draw error", err);
        }

        setIsGenerating(false);
    };

    useEffect(() => {
        // Initial blank draw or redraw when images change
        const timeout = setTimeout(drawCanvas, 100);
        return () => clearTimeout(timeout);
    }, [beforeImage, afterImage, clinic]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `Transformation-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-2xl relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={24} className="text-slate-600" />
                </button>

                {/* Left: Controls */}
                <div className="w-[400px] bg-slate-50 p-10 flex flex-col justify-center gap-8 border-r border-slate-200">
                    <div>
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Social Studio</h2>
                        <p className="text-slate-500 mt-2 font-medium">Generate premium "Before & After" stories for Instagram.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Before Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Before Photo</label>
                            <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group overflow-hidden relative">
                                {beforeImage ? (
                                    <img src={beforeImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500">
                                        <Upload size={24} />
                                        <span className="text-xs font-bold mt-2">Upload</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'before')} />
                            </label>
                        </div>

                        {/* After Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">After Photo</label>
                            <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group overflow-hidden relative">
                                {afterImage ? (
                                    <img src={afterImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500">
                                        <Upload size={24} />
                                        <span className="text-xs font-bold mt-2">Upload</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'after')} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200">
                        <button
                            onClick={downloadImage}
                            disabled={!beforeImage || !afterImage}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                        >
                            <Download size={20} />
                            Download Story
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold">1080x1920 • PNG Format</p>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="flex-1 bg-slate-200 flex items-center justify-center p-10 relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-[20px_20px] opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative shadow-2xl rounded-[30px] overflow-hidden" style={{ height: '80%', aspectRatio: '9/16' }}>
                        <canvas
                            ref={canvasRef}
                            width={1080}
                            height={1920}
                            className="w-full h-full object-contain bg-white"
                        />
                        {isGenerating && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <RefreshCw className="text-white animate-spin" size={40} />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SocialPostGenerator;
