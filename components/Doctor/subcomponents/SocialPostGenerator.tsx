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

        // 1. Background Fill (Clinic Primary Color Gradient)
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#0f172a'); // Slate-900 top
        gradient.addColorStop(1, clinic.primaryColor || '#4f46e5'); // Clinic color bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Noise Texture Overlay (Simulated)
        // We'll draw semi-transparent noise if we had an image, but for canvas perf, 
        // let's just do a subtle pattern or overlay if possible. 
        // For now, let's keep it clean gradient.

        // 3. Header Branding
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(clinic.name.toUpperCase(), CANVAS_WIDTH / 2, 120);

        ctx.font = '30px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('Transformation Story', CANVAS_WIDTH / 2, 170);

        // 4. Images Layout (Vertical Stack)
        const margin = 80;
        const imgWidth = CANVAS_WIDTH - (margin * 2);
        const imgHeight = (CANVAS_HEIGHT - 400) / 2; // Approximate height available for each

        // Helper to load image
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        const drawImageContainer = (img: HTMLImageElement | null, x: number, y: number, label: string) => {
            // Shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 20;

            // Border/Bg
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(x - 10, y - 10, imgWidth + 20, imgHeight + 20, 30);
            ctx.fill();

            // Image clipping
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, imgWidth, imgHeight, 20);
            ctx.clip();

            if (img) {
                // Object Fit: Cover simulation
                const scale = Math.max(imgWidth / img.width, imgHeight / img.height);
                const xOffset = (imgWidth - (img.width * scale)) / 2;
                const yOffset = (imgHeight - (img.height * scale)) / 2;
                ctx.drawImage(img, x + xOffset, y + yOffset, img.width * scale, img.height * scale);
            } else {
                // Placeholder
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(x, y, imgWidth, imgHeight);
                ctx.fillStyle = '#cbd5e1';
                ctx.font = 'bold 40px sans-serif';
                ctx.fillText("Upload Photo", x + imgWidth / 2, y + imgHeight / 2);
            }
            ctx.restore();

            // Reset Shadow
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;

            // Label Badge
            const badgeW = 200;
            const badgeH = 60;
            const badgeX = x + 30;
            const badgeY = y + 30;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 15);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, badgeX + 30, badgeY + 38);
        };

        try {
            const img1 = beforeImage ? await loadImage(beforeImage) : null;
            const img2 = afterImage ? await loadImage(afterImage) : null;

            drawImageContainer(img1, margin, 250, "BEFORE");
            drawImageContainer(img2, margin, 250 + imgHeight + 60, "AFTER");

            // 5. Footer Branding
            const footerY = CANVAS_HEIGHT - 120;

            if (clinic.logoUrl) {
                // Draw actual logo
                try {
                    const logoImg = await loadImage(clinic.logoUrl);

                    // Circular clip for logo
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(CANVAS_WIDTH / 2, footerY - 50, 50, 0, Math.PI * 2);
                    ctx.clip();

                    // Draw white background behind logo
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    // Draw logo
                    // Aspect ratio safe draw cover/contain
                    const logoSize = 100;
                    const scale = Math.max(logoSize / logoImg.width, logoSize / logoImg.height);
                    const xOffset = (logoSize - (logoImg.width * scale)) / 2;
                    const yOffset = (logoSize - (logoImg.height * scale)) / 2;

                    // Draw image centered in the circle
                    ctx.drawImage(logoImg, (CANVAS_WIDTH / 2) - 50, footerY - 100, 100, 100);
                    ctx.restore();

                    // Add a white ring border
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(CANVAS_WIDTH / 2, footerY - 50, 52, 0, Math.PI * 2);
                    ctx.stroke();

                } catch (e) {
                    // Fallback if logo load fails
                    console.error("Failed to load logo", e);
                    drawFallbackLogo(ctx, footerY);
                }
            } else {
                drawFallbackLogo(ctx, footerY);
            }

            ctx.fillStyle = '#ffffff';
            ctx.font = '24px "Inter", sans-serif';
            ctx.fillText("Start your journey today.", CANVAS_WIDTH / 2, footerY + 40);

        } catch (err) {
            console.error("Canvas draw error", err);
        }

        setIsGenerating(false);
    };

    const drawFallbackLogo = (ctx: CanvasRenderingContext2D, footerY: number) => {
        // Logo placeholder circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2, footerY - 50, 40, 0, Math.PI * 2);
        ctx.fill();

        // Clinic Logo inside (if available) - simplified as text/icon for now
        ctx.fillStyle = clinic.primaryColor || '#000';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(clinic.name.charAt(0), CANVAS_WIDTH / 2, footerY - 35);
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
