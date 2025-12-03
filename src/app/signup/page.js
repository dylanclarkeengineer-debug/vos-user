"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, X, ShieldCheck } from 'lucide-react';

const SignupPageUI = () => {
    // --- STATE ---
    // State quản lý hiển thị Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State hiển thị password
    const [showPassword, setShowPassword] = useState(false);
    const [showModalPassword, setShowModalPassword] = useState(false);

    // Form inputs (Chỉ để demo gõ phím được)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [modalData, setModalData] = useState({ confirmPassword: '', code: '' });

    // --- HANDLERS ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Khi submit form chính -> MỞ MODAL NGAY LẬP TỨC
    const handleRequestSignup = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    // Khi submit form trong modal -> Log chơi thôi
    const handleVerifyComplete = (e) => {
        e.preventDefault();
        console.log("Mockup: Signup Complete", { ...formData, ...modalData });
        alert("Flow demo kết thúc. Chuyển hướng...");
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-neutral-900 overflow-hidden selection:bg-black selection:text-white">
            <style jsx global>{`
                .input-underline { width: 0; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .group:focus-within .input-underline { width: 100%; }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-modal { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>

            {/* --- LEFT SIDE: BRANDING (Consistent with Login) --- */}
            <div className="hidden lg:flex w-1/2 bg-neutral-950 relative flex-col justify-between p-12 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase opacity-60">
                    VGC News Agency
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="relative">
                        <h1 className="text-[12rem] leading-none font-serif font-medium tracking-tighter text-white mix-blend-difference select-none">
                            <span className="relative z-10">V</span>
                            <span className="relative -ml-16 italic font-light text-neutral-400 z-0">G</span>
                            <span className="relative -ml-12 z-10">C</span>
                        </h1>
                        <div className="absolute -bottom-8 right-0 text-sm tracking-widest uppercase border-t border-white/30 pt-4 w-32 text-right">
                            Membership
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm font-light text-neutral-400 max-w-md">
                    "Join the network of truth."<br />
                    <span className="text-xs opacity-50 mt-2 block">Exclusive Editorial Access</span>
                </div>
            </div>

            {/* --- RIGHT SIDE: SIGNUP FORM --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white relative px-8 lg:px-20">
                <div className="w-full max-w-md animate-fade-in">

                    <div className="mb-12">
                        <div className="lg:hidden mb-8 text-4xl font-serif font-bold tracking-tighter">VGC.</div>
                        <h2 className="text-4xl font-serif font-light text-black mb-4">Request Access</h2>
                        <p className="text-neutral-500 text-sm font-medium tracking-wide">
                            Create your professional workspace account.
                        </p>
                    </div>

                    <form onSubmit={handleRequestSignup} className="space-y-10">
                        {/* Name Input */}
                        <div className="relative group">
                            <input
                                type="text" id="name" required
                                value={formData.name} onChange={handleChange}
                                className="peer w-full px-0 py-3 border-b border-neutral-200 bg-transparent text-black placeholder-transparent focus:outline-none text-lg font-medium transition-all"
                                placeholder="Full Name"
                            />
                            <label
                                htmlFor="name"
                                className={`
                                  absolute left-0 -top-3.5 text-neutral-400 text-xs transition-all
                                  peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-3
                                  peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs font-bold uppercase tracking-wider
                                `}
                            >
                                Full Name
                            </label>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-black input-underline"></div>
                        </div>

                        {/* Email Input */}
                        <div className="relative group">
                            <input
                                type="email" id="email" required
                                value={formData.email} onChange={handleChange}
                                className="peer w-full px-0 py-3 border-b border-neutral-200 bg-transparent text-black placeholder-transparent focus:outline-none text-lg font-medium transition-all"
                                placeholder="Email"
                            />
                            <label
                                htmlFor="email"
                                className={`
                                  absolute left-0 -top-3.5 text-neutral-400 text-xs transition-all
                                  peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-3
                                  peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs font-bold uppercase tracking-wider
                                `}
                            >
                                Email Address
                            </label>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-black input-underline"></div>
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"} id="password" required
                                value={formData.password} onChange={handleChange}
                                className="peer w-full px-0 py-3 border-b border-neutral-200 bg-transparent text-black placeholder-transparent focus:outline-none text-lg font-medium transition-all"
                                placeholder="Password"
                            />
                            <label
                                htmlFor="password"
                                className={`
                                  absolute left-0 -top-3.5 text-neutral-400 text-xs transition-all
                                  peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-3
                                  peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs font-bold uppercase tracking-wider
                                `}
                            >
                                Create Password
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3 text-neutral-400 hover:text-black transition-colors">
                                {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                            </button>
                            <div className="absolute bottom-0 left-0 h-[2px] bg-black input-underline"></div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="group relative w-full py-4 bg-black text-white overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-[0.2em] uppercase text-xs">
                                    Request Access
                                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-neutral-400 text-xs">
                            Already a member?{" "}
                            <Link href="/signin" className="text-black font-bold uppercase tracking-wider border-b border-black/20 hover:border-black pb-0.5 transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- MODAL: VERIFICATION --- */}
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

                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck size={24} className="text-black" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-black mb-2">Security Check</h3>
                            <p className="text-xs text-neutral-500 font-medium tracking-wide">
                                Please confirm your password and enter the code sent to <br />
                                <span className="text-black underline decoration-dotted">{formData.email || 'your email'}</span>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyComplete} className="space-y-8">

                            {/* 1. Re-enter Password */}
                            <div className="relative group">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 block">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showModalPassword ? "text" : "password"}
                                        className="w-full bg-transparent border-b border-neutral-200 py-2 text-black font-medium focus:border-black focus:outline-none transition-colors"
                                        placeholder="Re-enter password"
                                        autoFocus
                                        value={modalData.confirmPassword}
                                        onChange={(e) => setModalData({ ...modalData, confirmPassword: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShowModalPassword(!showModalPassword)} className="absolute right-0 top-2 text-neutral-400 hover:text-black">
                                        {showModalPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* 2. Enter Code */}
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

export default SignupPageUI;