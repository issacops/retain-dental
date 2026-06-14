import React from 'react';

interface PhoneMockupProps {
    children?: React.ReactNode;
    className?: string;
    imgSrc?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className = "", imgSrc }) => {
    return (
        <div className={`relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl ${className}`}>
            {/* Dynamic Island */}
            <div className="w-[148px] h-[35px] bg-black top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20 flex items-center justify-center">
                <div className="w-20 h-4 bg-[#1a1a1a] rounded-full flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0a0f1e]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#063b69]"></div>
                </div>
            </div>

            {/* Side Buttons */}
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-950 relative">
                {/* Status Bar */}
                <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 text-[10px] font-bold text-white z-10">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-4 h-2.5 bg-white rounded-[2px]" />
                    </div>
                </div>

                {imgSrc ? (
                    <img src={imgSrc} alt="App Screen" className="w-full h-full object-cover" />
                ) : children}
            </div>
        </div>
    );
};

export default PhoneMockup;
