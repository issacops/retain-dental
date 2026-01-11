import React from 'react';
import { LayoutGrid, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <LayoutGrid className="text-white" size={16} />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">Retain<span className="text-indigo-500">OS</span></span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The Operating System for modern dental retention.
                            Replacing the fragmented stack with a unified patient experience.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-6">
                        <h5 className="text-white font-bold">Product</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">PatientOS</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">ClinicOS</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">LoyaltyEngine</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-white font-bold">Solutions</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">General Practice</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Orthodontics</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Implantology</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">DSO / Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-white font-bold">Compare</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">vs Weave</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">vs RevenueWell</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">vs Mental Dental</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">vs NexHealth</a></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-white font-bold">Company</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">About</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Blog</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-400 text-sm transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-xs">
                        © 2024 RetainOS Inc. All rights reserved.
                    </p>
                    <div className="flex gap-8">
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
