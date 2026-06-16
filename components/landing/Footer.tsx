import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">

                    <div className="col-span-2 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
                                <LayoutGrid className="text-white" size={14} />
                            </div>
                            <span className="text-lg font-black text-white tracking-tighter">Retain<span className="text-teal-500">OS</span></span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            The Operating System for modern dental retention. Replacing the fragmented stack with a unified patient experience.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                                <span className="text-amber-400">&starf;</span> 4.9/5 from 200+ practices
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-white text-xs font-bold uppercase tracking-widest">Product</h5>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">PatientOS</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">ClinicOS</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">LoyaltyEngine</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-white text-xs font-bold uppercase tracking-widest">Solutions</h5>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">General Practice</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Orthodontics</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Implantology</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">DSO / Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-white text-xs font-bold uppercase tracking-widest">Compare</h5>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">vs Weave</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">vs RevenueWell</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">vs Mental Dental</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">vs NexHealth</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-white text-xs font-bold uppercase tracking-widest">Company</h5>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">About</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-xs">
                        &copy; 2024 RetainOS Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-600 hover:text-white text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-600 hover:text-white text-xs transition-colors">Terms of Service</a>
                        <a href="#" className="text-slate-600 hover:text-white text-xs transition-colors">HIPAA BAA</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
