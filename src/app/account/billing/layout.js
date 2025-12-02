"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// QUAN TRỌNG: Import CSS của RemixIcon
import "remixicon/fonts/remixicon.css";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- MOCK DATA: MENU ITEMS ---
const NAV_ITEMS = [
    { name: "Store", href: "/account/billing", icon: "ri-store-2-line" },
    { name: "Top Up", href: "/account/billing/payment", icon: "ri-coins-line" },
    { name: "History", href: "/account/billing/history", icon: "ri-history-line" },
    { name: "Refunds", href: "/account/billing/refunds", icon: "ri-exchange-dollar-line" },
];

// --- MOCK DATA: USER ---
const MOCK_USER = {
    name: "John Doe",
    points: 2450,
    avatar: "https://github.com/shadcn.png"
};

export default function PricingLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">

            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* 1. Logo */}
                        <Link href="/home" className="flex items-center gap-2 flex-shrink-0 cursor-pointer group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">V</div>
                            <span className="text-lg font-bold text-slate-900 hidden sm:block tracking-tight">
                                VGC System
                            </span>
                        </Link>

                        {/* 2. Desktop Nav */}
                        <nav className="hidden md:flex space-x-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-slate-100 text-indigo-700 font-bold"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <i className={cn(item.icon, "mr-2 text-lg", isActive ? "text-indigo-600" : "text-slate-400")}></i>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 3. User Widget (Mocked) */}
                        <div className="flex items-center gap-4 flex-shrink-0">

                            {/* Wallet Badge */}
                            <div className="hidden sm:flex items-center gap-3 bg-slate-50 pl-3 pr-1 py-1 rounded-full border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                                <div className="flex flex-col items-end leading-none mr-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        Balance
                                    </span>
                                    <div className="flex items-center gap-1 text-indigo-700 font-bold font-mono">
                                        {/* SỬA LỖI HYDRATION: Thêm 'en-US' để cố định format */}
                                        {MOCK_USER.points.toLocaleString('en-US')}
                                        <i className="ri-copper-coin-fill text-yellow-500 text-sm"></i>
                                    </div>
                                </div>
                                <Link href="/home/billing/payment-methods" className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all shadow-md">
                                    <i className="ri-add-line text-lg"></i>
                                </Link>
                            </div>

                            {/* User Dropdown Trigger */}
                            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">
                                        {MOCK_USER.name}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <button className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold cursor-pointer overflow-hidden">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={MOCK_USER.avatar} alt="User" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                    </button>

                                    {/* Dropdown Menu (Hover to show) */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-slate-50 lg:hidden">
                                            <p className="text-sm font-bold text-slate-900">{MOCK_USER.name}</p>
                                            <p className="text-xs text-slate-500">Premium Member</p>
                                        </div>
                                        <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg">
                                            <i className="ri-logout-box-r-line text-lg"></i> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 4. Mobile Nav Bar */}
                <div className="md:hidden border-t border-slate-100 bg-white">
                    {/* Mobile Wallet Status */}
                    <div className="px-4 py-2 bg-indigo-50/50 flex items-center justify-between border-b border-indigo-100">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                            <i className="ri-wallet-3-line text-indigo-500 text-lg"></i>
                            {/* SỬA LỖI HYDRATION: Thêm 'en-US' */}
                            <span>Balance: {MOCK_USER.points.toLocaleString('en-US')} Pts</span>
                        </div>
                        <Link href="/home/billing/payment-methods" className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                            Top Up
                        </Link>
                    </div>
                    {/* Scrollable Links */}
                    <div className="flex px-4 py-2 space-x-2 overflow-x-auto no-scrollbar">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-shrink-0 items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                                        isActive
                                            ? "border-indigo-200 bg-indigo-100 text-indigo-800"
                                            : "border-transparent bg-slate-50 text-slate-600"
                                    )}
                                >
                                    <i className={cn(item.icon, "mr-1.5 text-base", isActive ? "text-indigo-600" : "text-slate-400")}></i>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}