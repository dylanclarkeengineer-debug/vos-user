"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Hook Language
const useLanguage = () => ({
    t: (key) => {
        const dict = {
            "billing2Home.header.title": "Simple, Transparent Pricing",
            "billing2Home.header.description": "Choose the perfect plan for your business needs.",
            "billing2Home.header.rate": "1 Point ≈ $0.10 USD",
            "billing2Home.deposit.button": "Purchase Now",
        };
        return dict[key] || key.split('.').pop();
    }
});

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Helper render text
const renderTrans = (text, params = {}) => {
    if (!text) return null;
    let processedText = text;
    Object.keys(params).forEach(key => {
        processedText = processedText.replace(new RegExp(`{{${key}}}`, 'g'), params[key]);
    });
    const parts = processedText.split(/(<\d+>.*?<\/\d+>)/g);
    return parts.map((part, index) => {
        const match = part.match(/<(\d+)>(.*?)<\/(\d+)>/);
        if (match) {
            return <span key={index} className="text-indigo-600 font-bold">{match[2]}</span>;
        }
        return part;
    });
};

export default function PricingPage() {
    const router = useRouter();
    const { t } = useLanguage();

    // --- 1. DATA: DEPOSIT PACKAGES ---
    const depositPackages = useMemo(() => [
        {
            id: "starter",
            name: "Starter",
            price: 10,
            points: 100,
            bonus: 0,
            desc: "Perfect for trying out the platform.",
            icon: "ri-seedling-line",
            color: "bg-white border-neutral-200",
            btnVariant: "outline",
        },
        {
            id: "growth",
            name: "Growth",
            price: 50,
            points: 550,
            bonus: 10,
            desc: "For growing businesses needing visibility.",
            icon: "ri-plant-line",
            color: "bg-blue-50/50 border-blue-200",
            btnVariant: "default",
            badge: "Popular",
        },
        {
            id: "business",
            name: "Business",
            price: 100,
            points: 1200,
            bonus: 20,
            desc: "Maximum value for heavy users.",
            icon: "ri-briefcase-4-line",
            color: "bg-indigo-50/50 border-indigo-200 shadow-md",
            btnVariant: "default",
            highlight: true,
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: 500,
            points: 6500,
            bonus: 30,
            desc: "Ultimate power for agencies.",
            icon: "ri-vip-diamond-line",
            color: "bg-neutral-950 text-white border-neutral-800",
            btnVariant: "secondary",
            isDark: true
        },
    ], []);

    // --- 2. DATA: BUNDLES ---
    const bundles = useMemo(() => [
        {
            id: "flash_sale",
            name: "Flash Sale",
            sub: "Limited time offer",
            points: 150,
            price: "$15",
            icon: "ri-flashlight-fill",
            iconColor: "text-red-500",
            features: ["Priority Approval", "3 Days Sticky", "Highlight Border"],
        },
        {
            id: "monthly",
            name: "Monthly Push",
            sub: "Best for hiring",
            points: 600,
            price: "$60",
            icon: "ri-rocket-2-fill",
            iconColor: "text-blue-500",
            features: ["10x Auto Push", "7 Days Sticky", "Vetted Badge", "Social Share"],
            popular: true,
        },
        {
            id: "dominator",
            name: "Market Dominator",
            sub: "Maximum exposure",
            points: 1000,
            price: "$100",
            icon: "ri-vip-crown-fill",
            iconColor: "text-yellow-500",
            features: ["30x Auto Push", "30 Days Sticky", "Top of Category", "Email Blast"],
        }
    ], []);

    const handleAction = (type, id) => {
        console.log(`Maps to: ${type} - ${id}`);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900 pb-20">

            {/* KHẮC PHỤC LỖI HYDRATION: Dùng thẻ style chuẩn thay vì styled-jsx */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes auto-scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-120px); } }
                @keyframes push-in { 0%, 20% { opacity: 0; transform: translateY(-20px) scale(0.95); } 30%, 80% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(10px); } }
                @keyframes push-down { 0%, 20% { transform: translateY(-50px); } 30%, 80% { transform: translateY(0); } 100% { transform: translateY(20px); opacity: 0; } }
                @keyframes border-glow { 0%, 100% { border-color: #6366f1; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } 50% { border-color: #818cf8; box-shadow: 0 0 15px 0 rgba(99, 102, 241, 0.3); } }
                @keyframes tooltip-pop { 0%, 10%, 90%, 100% { opacity: 0; transform: translateY(5px) translateX(-50%); } 20%, 80% { opacity: 1; transform: translateY(0) translateX(-50%); } }
                .animate-scroll-bg { animation: auto-scroll 4s linear infinite; }
                .animate-push-new { animation: push-in 3s ease-out infinite; }
                .animate-push-old { animation: push-down 3s ease-out infinite; }
                .animate-border-glow { animation: border-glow 2s infinite; }
                .animate-tooltip { animation: tooltip-pop 4s ease-in-out infinite; }
            `}} />

            {/* --- HEADER --- */}
            <div className="bg-neutral-50 border-b border-neutral-200 pt-16 pb-24 px-4 text-center">
                <Badge variant="outline" className="mb-4 bg-white px-4 py-1 border-neutral-300 text-neutral-600 uppercase tracking-widest text-[10px]">
                    Pricing & Plans
                </Badge>
                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-neutral-900">
                    {renderTrans(t("billing2Home.header.title"))}
                </h1>
                <p className="text-neutral-500 text-lg max-w-2xl mx-auto mb-6">
                    {t("billing2Home.header.description")}
                    <span className="block mt-2 text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-full">
                        {t("billing2Home.header.rate")}
                    </span>
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">

                {/* --- SECTION 1: POINT PACKAGES --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {depositPackages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={cn(
                                "flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden",
                                pkg.color
                            )}
                        >
                            {pkg.badge && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                        {pkg.badge}
                                    </div>
                                </div>
                            )}

                            <CardHeader className="pb-2">
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2 text-xl", pkg.isDark ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-900")}>
                                    <i className={pkg.icon}></i>
                                </div>
                                <CardTitle className={cn("text-lg", pkg.isDark ? "text-white" : "text-neutral-900")}>{pkg.name}</CardTitle>
                                <CardDescription className={pkg.isDark ? "text-neutral-400" : "text-neutral-500"}>
                                    {pkg.desc}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className={cn("text-3xl font-bold", pkg.isDark ? "text-white" : "text-neutral-900")}>${pkg.price}</span>
                                    <span className={cn("text-sm", pkg.isDark ? "text-neutral-400" : "text-neutral-500")}>/ one-time</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className={cn(pkg.isDark ? "text-yellow-400" : "text-indigo-600")}>
                                        <i className="ri-coins-fill mr-1"></i>
                                        {pkg.points.toLocaleString('en-US')} pts
                                    </span>
                                    {pkg.bonus > 0 && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
                                            +{pkg.bonus}% Bonus
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="mt-auto pt-0">
                                <Button
                                    onClick={() => handleAction('deposit', pkg.id)}
                                    className={cn("w-full font-bold tracking-wide uppercase text-xs h-10", pkg.btnVariant === "secondary" ? "bg-white text-black hover:bg-neutral-200" : "")}
                                    variant={pkg.btnVariant === "secondary" ? "default" : pkg.btnVariant}
                                >
                                    {t("billing2Home.deposit.button")}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <Separator className="my-16" />

                {/* --- SECTION 2: VISUAL SIMULATIONS (MÔ PHỎNG) --- */}
                <div className="space-y-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-4">See How It Works</h2>
                        <p className="text-neutral-500">
                            We offer powerful tools to boost your visibility. Here is a visual demonstration of our premium features.
                        </p>
                    </div>

                    {/* Simulation Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* 1. STICKY POST (Ghim tin) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><i className="ri-pushpin-2-fill text-xl"></i></div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900">Sticky Post</h3>
                                    <p className="text-xs text-neutral-500">Stays on top of the list.</p>
                                </div>
                            </div>

                            {/* Visual Container */}
                            <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 h-72 relative overflow-hidden shadow-inner">
                                <div className="absolute top-0 right-0 bg-yellow-400 text-neutral-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg z-30 shadow-sm">
                                    VIP Zone
                                </div>

                                {/* Sticky Item */}
                                <div className="absolute top-6 left-6 right-6 z-20">
                                    <div className="bg-white p-4 rounded-lg border-2 border-yellow-400 shadow-xl flex items-center gap-4 transform transition-transform hover:scale-[1.02]">
                                        <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 flex-shrink-0">
                                            <i className="ri-vip-crown-fill text-xl animate-pulse"></i>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 w-3/4 bg-neutral-800 rounded"></div>
                                            <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                                        </div>
                                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-500">Sticky</Badge>
                                    </div>
                                    {/* Shadow gradient under sticky */}
                                    <div className="h-6 w-full bg-gradient-to-b from-neutral-200/50 to-transparent"></div>
                                </div>

                                {/* Scrolling Background Items */}
                                <div className="animate-scroll-bg space-y-3 pt-28 px-1 opacity-50 grayscale">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-neutral-200 rounded flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-3/4 bg-neutral-300 rounded"></div>
                                                <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. AUTO PUSH (Đẩy tin) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><i className="ri-arrow-up-circle-fill text-xl"></i></div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900">Auto Push</h3>
                                    <p className="text-xs text-neutral-500">Bumps your post to the top.</p>
                                </div>
                            </div>

                            {/* Visual Container */}
                            <div className="bg-neutral-100 p-6 rounded-xl border border-neutral-200 h-72 relative overflow-hidden shadow-inner flex flex-col gap-3">
                                {/* New Item Pushing In */}
                                <div className="animate-push-new relative z-20">
                                    <div className="bg-white p-4 rounded-lg border border-green-500 shadow-md flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center flex-shrink-0">
                                            <i className="ri-flashlight-fill text-xl"></i>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 w-3/4 bg-neutral-800 rounded"></div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 h-5 px-1">Just Now</Badge>
                                            </div>
                                        </div>
                                        <i className="ri-arrow-up-line text-green-500 text-xl font-bold"></i>
                                    </div>
                                </div>

                                {/* Old Items Getting Pushed Down */}
                                <div className="animate-push-old space-y-3 opacity-60 z-10">
                                    <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-neutral-200 rounded flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 w-3/4 bg-neutral-300 rounded"></div>
                                            <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center gap-3 opacity-70">
                                        <div className="w-10 h-10 bg-neutral-200 rounded flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 w-3/4 bg-neutral-300 rounded"></div>
                                            <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. HIGHLIGHT BORDER (Viền nổi bật) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><i className="ri-shape-line text-xl"></i></div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900">Highlight Border</h3>
                                    <p className="text-xs text-neutral-500">Catches user attention.</p>
                                </div>
                            </div>

                            {/* Visual Container */}
                            <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 h-60 flex flex-col gap-4 items-center justify-center">
                                {/* Highlighted Item */}
                                <div className="w-full max-w-sm bg-indigo-50 p-4 rounded-lg border-2 border-indigo-500 animate-border-glow relative shadow-sm">
                                    <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        Highlight
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-200 rounded flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2.5 w-3/4 bg-neutral-900 rounded"></div>
                                            <div className="h-2 w-1/2 bg-indigo-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Normal Item (Faded) */}
                                <div className="w-full max-w-sm bg-white p-3 rounded-lg border border-neutral-200 opacity-40 scale-95 grayscale">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neutral-200 rounded flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 w-2/3 bg-neutral-300 rounded"></div>
                                            <div className="h-2 w-1/3 bg-neutral-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. VETTED BADGE (Huy hiệu uy tín) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><i className="ri-checkbox-circle-fill text-xl"></i></div>
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900">Vetted Badge</h3>
                                    <p className="text-xs text-neutral-500">Builds trust with customers.</p>
                                </div>
                            </div>

                            {/* Visual Container */}
                            <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-200 h-60 flex items-center justify-center relative">
                                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xl w-full max-w-xs relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-neutral-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50"></div>
                                            </div>
                                            {/* Badge Icon */}
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <i className="ri-checkbox-circle-fill text-blue-500 text-xl"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-900 text-lg">Premium Shop</h4>
                                            <p className="text-xs text-neutral-500">Joined 2024</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center text-xs">
                                        <span className="text-neutral-500">Trust Score</span>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 h-5">Verified</Badge>
                                    </div>

                                    {/* Tooltip Animation */}
                                    <div className="animate-tooltip absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-3 py-1.5 rounded shadow-xl whitespace-nowrap z-50">
                                        Identity Verified
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Separator className="my-16" />

                {/* --- SECTION 3: BUNDLES (COMBO) --- */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-neutral-900">Value Bundles</h2>
                        <p className="text-neutral-500 mt-2">Save up to 30% by choosing a package.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {bundles.map((bundle) => (
                            <Card
                                key={bundle.id}
                                className={cn(
                                    "flex flex-col relative transition-all hover:shadow-lg border-2",
                                    bundle.popular ? "border-blue-500 shadow-md" : "border-neutral-200"
                                )}
                            >
                                {bundle.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}

                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("text-2xl", bundle.iconColor)}><i className={bundle.icon}></i></div>
                                        <CardTitle>{bundle.name}</CardTitle>
                                    </div>
                                    <CardDescription>{bundle.sub}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="mb-6 pb-6 border-b border-dashed border-neutral-200">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-extrabold text-neutral-900">{bundle.points}</span>
                                            <span className="text-sm font-medium text-neutral-500">Points</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-1">Equivalent to {bundle.price}</p>
                                    </div>

                                    <ul className="space-y-3">
                                        {bundle.features.map((feat, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                                                <i className="ri-check-line text-green-500 mt-0.5 flex-shrink-0"></i>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        onClick={() => handleAction('bundle', bundle.id)}
                                        className="w-full font-bold uppercase tracking-wide text-xs h-11"
                                        variant={bundle.popular ? "default" : "outline"}
                                    >
                                        Buy Bundle <i className="ri-arrow-right-line ml-2"></i>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}