"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "remixicon/fonts/remixicon.css";
import { useAuth } from '@/context/authContext';
import { sendEmailCode, checkLoginCode, login } from '@/utils/auth/authHandlers';

const LoginPage = () => {
    const { login: contextLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [modalData, setModalData] = useState({ code: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isUserVerified, setIsUserVerified] = useState(false);

    const router = useRouter();

    const handleOpenCodeModal = async (e) => {
        e.preventDefault();
        setError('');
        setIsUserVerified(false);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await sendEmailCode(email);
            if (res && res.success) {
                if (res.is_verified) {
                    setIsUserVerified(true);
                }
                setIsModalOpen(true);
            } else {
                setError(res.message || 'Failed to send verification code. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'An error occurred while sending the code.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleCodeChange = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) {
            setModalData({ ...modalData, code: val });
        }
    };

    const handleVerifyComplete = async (e) => {
        e.preventDefault();
        setError('');

        if (modalData.code.length !== 6) {
            alert("Please enter a 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const checkRes = await checkLoginCode(email, modalData.code, isUserVerified);

            if (checkRes && checkRes.success) {
                const loginRes = await login(email, modalData.code);

                if (loginRes && loginRes.success) {
                    contextLogin(loginRes.token);
                    router.push('/dashboard');
                } else {
                    alert(loginRes.message || "Login failed. Please try again.");
                }
            } else {
                alert(checkRes.message || "Invalid verification code.");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "An error occurred during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[100dvh] w-screen bg-white font-sans text-neutral-900 overflow-hidden selection:bg-black selection:text-white">
            <div className="hidden lg:flex w-1/2 bg-neutral-950 relative flex-col justify-between p-8 xl:p-12 overflow-hidden text-white h-full border-r border-neutral-800">
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                <div className="relative z-10 shrink-0">
                    <div className="text-lg xl:text-xl font-black tracking-tighter uppercase mb-2">Viet Global Connect</div>
                    <div className="w-8 h-1 bg-white"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center flex-1 space-y-6 xl:space-y-10 py-4">
                    <div>
                        <h1 className="text-3xl xl:text-5xl font-bold tracking-tight mb-4 leading-tight">
                            The All-in-One <br /> <span className="text-neutral-500">Digital Ecosystem.</span>
                        </h1>
                        <p className="text-neutral-400 text-xs xl:text-sm leading-relaxed max-w-md">
                            VGC is a comprehensive platform integrating editorial news, classified postings, and business verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-10">
                        <div className="space-y-3">
                            <h3 className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2 mb-3 w-fit">
                                Our Ecosystem
                            </h3>
                            <div className="grid gap-2 xl:gap-3">
                                <EcosystemLink icon="ri-user-smile-line" label="User Portal" sub="user.vgcnews24.com" />
                                <EcosystemLink icon="ri-megaphone-line" label="Classifieds" sub="postings.vgcnews24.com" />
                                <EcosystemLink icon="ri-building-2-line" label="Business Hub" sub="biz.vgcnews24.com" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] xl:text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-2 mb-3 w-fit">
                                Capabilities
                            </h3>
                            <ul className="space-y-1.5 xl:space-y-2 text-xs xl:text-sm text-neutral-400">
                                <FeatureItem text="Manage Classified Posts" />
                                <FeatureItem text="Verify Business Profiles" />
                                <FeatureItem text="Access Editorial News" />
                                <FeatureItem text="Real-time Analytics" />
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-[10px] text-neutral-600 uppercase tracking-wider">
                    © 2024 VGC Corporation. All rights reserved.
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-between items-center bg-white relative px-6 py-6 lg:px-12 lg:py-8 h-full overflow-hidden">
                <div className="flex-none h-4 lg:h-0"></div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col justify-center flex-1">

                    <div className="lg:hidden mb-6 text-center">
                        <div className="text-xl font-black tracking-tighter">VGC SYSTEM</div>
                    </div>

                    <div className="mb-6 xl:mb-10 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-neutral-500 text-xs xl:text-sm font-medium">Please enter your credentials to access the workspace.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 rounded-sm p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <i className="ri-error-warning-fill text-red-600 text-sm mt-0.5"></i>
                            <div className="flex-1">
                                <p className="text-xs text-red-700 font-medium leading-tight">{error}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6 xl:space-y-10" onSubmit={handleOpenCodeModal}>
                        <div className="relative group mt-2">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                disabled={isLoading}
                                className="peer w-full px-0 py-2 xl:py-3 border-b border-neutral-200 bg-transparent text-black placeholder-transparent focus:outline-none focus:border-transparent transition-all duration-300 font-bold text-base xl:text-lg disabled:opacity-50"
                                placeholder="Email"
                                required
                            />
                            <label htmlFor="email" className="absolute left-0 -top-2.5 text-neutral-400 text-[10px] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-black peer-focus:text-[10px] font-bold uppercase tracking-wider">
                                Email Address
                            </label>

                            <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${error ? 'bg-red-500 w-full' : 'bg-black w-0 group-focus-within:w-full'}`}></div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full py-3 xl:py-4 bg-black text-white overflow-hidden transition-all duration-300 hover:shadow-xl rounded-sm disabled:cursor-not-allowed disabled:bg-neutral-400"
                            >
                                <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-[0.2em] uppercase text-[10px] xl:text-xs">
                                    {isLoading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-sm"></i> Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <i className="ri-arrow-right-line transform group-hover:translate-x-1 transition-transform duration-300 text-sm"></i>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex-none w-full max-w-md flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-neutral-400 pt-4">
                    <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                    <span className="text-neutral-200">•</span>
                    <a href="#" className="hover:text-black transition-colors">Help Center</a>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm transition-opacity" onClick={() => !isLoading && setIsModalOpen(false)}></div>

                    <div className="relative bg-white w-full max-w-sm px-6 py-8 md:p-8 animate-in fade-in zoom-in-95 duration-300 shadow-2xl border border-neutral-200 rounded-sm">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            disabled={isLoading}
                            className="absolute top-4 left-4 flex items-center gap-1 text-neutral-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-[10px] disabled:opacity-50"
                        >
                            <i className="ri-arrow-left-s-line text-sm"></i>
                            Back
                        </button>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            disabled={isLoading}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors disabled:opacity-50"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>

                        <form onSubmit={handleVerifyComplete} className="mt-2">
                            <div className="text-center mb-6">
                                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-900 text-lg border border-neutral-200">
                                    <i className="ri-shield-keyhole-fill"></i>
                                </div>
                                <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Verify Identity</h3>
                            </div>

                            <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-sm flex items-start gap-3 mb-6">
                                <i className="ri-information-fill text-neutral-400 mt-0.5 flex-shrink-0"></i>
                                <div className="text-xs text-neutral-600 leading-relaxed font-medium">
                                    <p className="mb-1">
                                        We sent a 6-digit code to your email: Let's check <br />
                                        <span className="text-black font-bold break-all">{email}</span>
                                    </p>
                                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mt-2">Check spam folder if needed.</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    disabled={isLoading}
                                    className="w-full bg-white border-b-2 border-neutral-200 py-2 text-center text-2xl font-mono font-bold tracking-[0.5em] text-black focus:border-black outline-none transition-colors placeholder-neutral-300 rounded-none disabled:opacity-50"
                                    placeholder="••••••"
                                    value={modalData.code}
                                    onChange={handleCodeChange}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors rounded-sm shadow-lg mb-4 disabled:bg-neutral-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin text-sm"></i> Verifying...
                                    </>
                                ) : (
                                    "Verify & Access"
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={handleOpenCodeModal}
                                    className="text-[10px] text-neutral-500 hover:text-black font-bold uppercase tracking-widest border-b border-transparent hover:border-black transition-all pb-0.5 disabled:opacity-50"
                                >
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

const EcosystemLink = ({ icon, label, sub }) => (
    <a href={`https://${sub}/`} target="_blank" className="group flex items-center gap-3 text-xs xl:text-sm font-medium text-neutral-300 hover:text-white transition-colors">
        <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-sm bg-neutral-900 flex items-center justify-center border border-neutral-800 group-hover:border-neutral-600 transition-colors shrink-0">
            <i className={`${icon} text-xs xl:text-sm`}></i>
        </div>
        <div className="flex flex-col">
            <span>{label}</span>
            <span className="text-neutral-600 text-[10px] group-hover:text-neutral-500">{sub}</span>
        </div>
    </a>
);

const FeatureItem = ({ text }) => (
    <li className="flex items-center gap-2">
        <i className="ri-check-line text-green-500 text-xs"></i> {text}
    </li>
);

export default LoginPage;