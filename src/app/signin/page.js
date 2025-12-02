"use client"

import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [modalData, setModalData] = useState({ confirmPassword: '', code: '' });
    const router = useRouter();

    const handleOpenCodeModal = () => {
        setIsModalOpen(true);
    }

    // Hàm giả lập prevent reload
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempt:", { email });
    };

    const handleVerifyComplete = (e) => {
        e.preventDefault();
        console.log("Mockup: Signup Complete", { ...formData, ...modalData });
        alert("Flow demo kết thúc. Chuyển hướng...");
        router.push('/home');
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-neutral-900 overflow-hidden selection:bg-black selection:text-white">
            <style jsx global>{`
                /* Hiệu ứng gạch chân input khi focus */
                .input-underline {
                    width: 0;
                    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .group:focus-within .input-underline {
                    width: 100%;
                }
                
                /* Animation xuất hiện nhẹ nhàng */
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* --- LEFT SIDE: TYPOGRAPHY BRANDING (VGC) --- */}
            <div className="hidden lg:flex w-1/2 bg-neutral-950 relative flex-col justify-between p-12 overflow-hidden text-white">
                {/* Background Pattern nhỏ */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Top Brand Name */}
                <div className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase opacity-60">
                    VGC News Agency
                </div>

                {/* Main Typography VGC */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="relative">
                        {/* Chữ VGC lớn */}
                        <h1 className="text-[12rem] leading-none font-medium tracking-tighter text-white mix-blend-difference select-none">
                            <span className="relative z-10">V</span>
                            <span className="relative -ml-16 italic font-light text-neutral-400 z-0">G</span>
                            <span className="relative -ml-12 z-10">C</span>
                        </h1>
                        <div className="absolute -bottom-8 right-0 text-sm tracking-widest uppercase border-t border-white/30 pt-4 w-32 text-right">
                            Est. 2024
                        </div>
                    </div>
                </div>

                {/* Bottom Quote */}
                <div className="relative z-10 text-sm font-light text-neutral-400 max-w-md">
                    "Veritas. Gravitas. Claritas."<br />
                    <span className="text-xs opacity-50 mt-2 block">Premium Content Management System</span>
                </div>
            </div>

            {/* --- RIGHT SIDE: FORM UI --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white relative px-8 lg:px-20">
                <div className="w-full max-w-md animate-fade-in">

                    {/* Header */}
                    <div className="mb-16">
                        <div className="lg:hidden mb-8 text-4xl font-bold tracking-tighter">VGC.</div>
                        <h2 className="text-4xl font-light text-black mb-4">
                            Welcome Back
                        </h2>
                        <p className="text-neutral-500 text-sm font-medium tracking-wide">
                            Please enter your credentials to access the workspace.
                        </p>
                    </div>

                    {/* Form Structure */}
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Email Input */}
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full px-0 py-3 border-b border-neutral-200 bg-transparent text-black placeholder-transparent focus:outline-none focus:border-transparent transition-all duration-300 font-medium text-lg"
                                placeholder="Email"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 -top-3.5 text-neutral-400 text-xs transition-all 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-3 
                                peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs font-bold uppercase tracking-wider"
                            >
                                Email Address
                            </label>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-black input-underline"></div>
                        </div>
                        {/* Button Login */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="group relative w-full py-4 bg-black text-white overflow-hidden transition-all duration-300 hover:shadow-xl"
                                onClick={handleOpenCodeModal}
                            >
                                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-[0.2em] uppercase text-xs">
                                    Sign In
                                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-md p-10 animate-modal shadow-2xl border border-neutral-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <form onSubmit={handleVerifyComplete} className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 block">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full bg-neutral-50 border border-neutral-200 py-3 text-center text-2xl font-mono tracking-[0.5em] text-black focus:border-black focus:outline-none transition-colors placeholder-neutral-300"
                                    placeholder="------"
                                    value={modalData.code}
                                    onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors">
                                Verify & Create
                            </button>

                            <div className="text-center">
                                <button type="button" className="text-[10px] text-neutral-400 hover:text-black font-medium tracking-wider uppercase border-b border-transparent hover:border-black transition-all">
                                    Resend Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;