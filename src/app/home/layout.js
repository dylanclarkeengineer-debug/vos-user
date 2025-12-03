"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';

// Import CSS RemixIcon
import 'remixicon/fonts/remixicon.css'

// Import ShadCN UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// 1. Cấu hình Font Inter
const inter = Inter({ subsets: ['latin'] });

// 2. Dữ liệu Menu (Các mục có Dropdown)
const MENU_ITEMS = [
    {
        id: "ads",
        label: "Advertising",
        icon: "ri-megaphone-line",
        subItems: [
            { label: "Create New Post", icon: "ri-add-line", href: "/home/ads/create" },
            { label: "My Posted Ads", icon: "ri-file-list-line", href: "/home/ads/list" },
            { label: "Favorite Ads", icon: "ri-heart-line", href: "/home/ads/favorites" },
            { label: "Job Suggestions", icon: "ri-lightbulb-line", href: "/home/ads/suggestions" },
            { label: "Applied Jobs", icon: "ri-briefcase-line", href: "/home/ads/applied" },
        ]
    },
    {
        id: "business",
        label: "Business Hub",
        icon: "ri-building-line",
        subItems: [
            { label: "Create Business", icon: "ri-add-circle-line", href: "/home/business/create" },
            { label: "My Businesses", icon: "ri-store-2-line", href: "/home/business" },
            { label: "Analytics", icon: "ri-bar-chart-2-line", href: "/home/business/analytics" },
        ]
    },
    {
        id: "news",
        label: "Editorial News",
        icon: "ri-newspaper-line",
        subItems: [
            { label: "Latest Feed", icon: "ri-rss-line", href: "/home/news/feed" },
            { label: "Bookmarks", icon: "ri-bookmark-line", href: "/home/news/bookmarks" },
        ]
    },
    {
        id: "account",
        label: "Account",
        icon: "ri-user-settings-line",
        subItems: [
            { label: "Profile Settings", icon: "ri-settings-4-line", href: "/home/account/profile" },
            { label: "Security", icon: "ri-shield-keyhole-line", href: "/home/account/security" },
            { label: "Billing & Payments", icon: "ri-wallet-line", href: "/home/account/billing" },
        ]
    }
];

export default function HomeLayout({ children }) {
    const pathname = usePathname();

    // State để quản lý Accordion mở
    const [openItems, setOpenItems] = useState([]);

    useEffect(() => {
        // Tự động mở Accordion chứa trang hiện tại (nếu có)
        const activeSectionId = MENU_ITEMS.find(section =>
            section.subItems.some(item => item.href === pathname)
        )?.id;

        if (activeSectionId) {
            setOpenItems([activeSectionId]);
        }
    }, [pathname]);

    const getBreadcrumb = () => {
        if (!pathname || pathname === '/home') return "WORKSPACE / DASHBOARD";
        const segments = pathname.split('/').filter(Boolean);
        return `WORKSPACE / ${segments.join(' / ')}`.toUpperCase();
    };

    return (
        <div className={`fixed inset-0 flex h-screen w-full bg-[#F8F8F8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-hidden ${inter.className}`}>

            {/* --- SIDEBAR --- */}
            <aside className="w-72 h-full flex flex-col bg-white border-r border-neutral-200 shrink-0 z-20 overflow-hidden">

                {/* User Profile Header */}
                <div className="p-8 pb-6 shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 border border-neutral-200">
                            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                            <AvatarFallback className="bg-neutral-900 text-white font-bold">JD</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <h3 className="text-lg font-bold text-neutral-900 leading-tight truncate">
                                John Doe
                            </h3>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                                Premium Member
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className={`w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 transition-all 
                                ${pathname === '/account/profile' ? 'bg-neutral-900 text-white border-neutral-900' : 'hover:bg-neutral-50 hover:text-black'}
                            `}
                        >
                            <Link href="/account/profile">
                                <i className="ri-settings-3-line mr-2 text-sm"></i> Profile
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className={`w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 transition-all 
                                ${pathname === '/account/billing' ? 'bg-neutral-900 text-white border-neutral-900' : 'hover:bg-neutral-50 hover:text-black'}
                            `}
                        >
                            <Link href="/account/billing">
                                <i className="ri-wallet-3-line mr-2 text-sm"></i> Billing
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="px-8 shrink-0">
                    <Separator className="bg-neutral-100" />
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 min-h-0 w-full">
                    <ScrollArea className="h-full w-full px-4 py-6">

                        <div className="w-full space-y-2">

                            {/* --- 1. DASHBOARD LINK (Single Item) --- */}
                            <Button
                                asChild
                                variant="ghost"
                                className={`w-full justify-start px-3 h-11 transition-all duration-200 rounded-sm group
                                    ${pathname === '/home'
                                        ? 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 hover:text-white' // Active style
                                        : 'text-neutral-800 hover:bg-neutral-50' // Inactive style
                                    }
                                `}
                            >
                                <Link href="/home" className="flex items-center gap-3">
                                    <i className={`ri-dashboard-line text-lg ${pathname === '/home' ? 'text-white' : 'text-neutral-500 group-hover:text-black'}`}></i>
                                    <span className={`text-base tracking-tight ${pathname === '/home' ? 'font-bold' : 'font-medium'}`}>
                                        Dashboard
                                    </span>
                                </Link>
                            </Button>

                            {/* --- 2. ACCORDION MENU (Dropdown Items) --- */}
                            <Accordion
                                type="multiple"
                                value={openItems}
                                onValueChange={setOpenItems}
                                className="w-full space-y-2"
                            >
                                {MENU_ITEMS.map((section) => {
                                    const isSectionActive = section.subItems.some(item => item.href === pathname);
                                    return (
                                        <AccordionItem key={section.id} value={section.id} className="border-b-0">
                                            <AccordionTrigger className="py-2 px-3 h-11 hover:bg-neutral-50 rounded-sm hover:no-underline group data-[state=open]:bg-neutral-50 transition-colors">
                                                <div className="flex items-center gap-3 text-neutral-800">
                                                    <span className={`transition-colors ${isSectionActive ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>
                                                        <i className={`${section.icon} text-lg`}></i>
                                                    </span>
                                                    <span className={`font-medium text-base tracking-tight ${isSectionActive ? 'text-black font-bold' : ''}`}>
                                                        {section.label}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="pt-1 pb-2 px-0">
                                                <div className="space-y-1 ml-3 border-l border-neutral-200 pl-3 py-1">
                                                    {section.subItems.map((item, idx) => {
                                                        const isActive = pathname === item.href;
                                                        return (
                                                            <Button
                                                                key={idx}
                                                                asChild
                                                                variant="ghost"
                                                                className={`w-full justify-start gap-3 px-3 h-9 text-sm transition-all duration-200 rounded-md
                                                                    ${isActive
                                                                        ? 'bg-neutral-900 text-white font-bold shadow-sm hover:bg-neutral-800 hover:text-white'
                                                                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 font-normal'
                                                                    }
                                                                `}
                                                            >
                                                                <Link href={item.href}>
                                                                    <i className={`${item.icon} text-base ${isActive ? 'opacity-100' : 'opacity-70'}`}></i>
                                                                    <span className="tracking-wide">{item.label}</span>
                                                                </Link>
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>

                    </ScrollArea>
                </div>

                <div className="p-4 shrink-0 bg-white border-t border-neutral-100">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4 space-y-3">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Support Center</h4>
                            <p className="text-xs text-neutral-500 font-medium">Available 24/7 for assistance.</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-neutral-200/50">
                            <a href="mailto:support@vgc-agency.com" className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-black transition-colors group">
                                <div className="w-5 h-5 bg-white border border-neutral-200 rounded-sm flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:border-black transition-all">
                                    <i className="ri-mail-line text-[10px]"></i>
                                </div>
                                <span>support@vgc.com</span>
                            </a>

                            <a href="tel:+15550000000" className="flex items-center gap-2 text-xs font-bold text-neutral-700 hover:text-black transition-colors group">
                                <div className="w-5 h-5 bg-white border border-neutral-200 rounded-sm flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:border-black transition-all">
                                    <i className="ri-phone-fill text-[10px]"></i>
                                </div>
                                <span>+1 (555) 000-0000</span>
                            </a>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#F8F8F8]">

                {/* Header */}
                <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                        {getBreadcrumb()}
                    </div>
                    <div className="text-sm italic text-neutral-500">
                        "Veritas. Gravitas. Claritas."
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}