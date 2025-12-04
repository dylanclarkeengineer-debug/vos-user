"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import { useAuth } from '@/context/authContext';
import 'remixicon/fonts/remixicon.css'
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

const inter = Inter({ subsets: ['latin'] });

const MENU_ITEMS = [
    {
        id: "ads",
        label: "Advertising",
        icon: "ri-megaphone-line",
        subItems: [
            { label: "Create New Post", icon: "ri-add-line", href: "/ads/create", title: "Create New Classified Post" },
            { label: "My Posted Ads", icon: "ri-file-list-line", href: "/ads/list", title: "My Posted Ads" },
            { label: "Favorite Ads", icon: "ri-heart-line", href: "/ads/favorites", title: "Favorite Ads" },
            { label: "Job Suggestions", icon: "ri-lightbulb-line", href: "/ads/suggestions", title: "Job Suggestions" },
            { label: "Applied Jobs", icon: "ri-briefcase-line", href: "/ads/applied", title: "Applied Jobs" },
        ],
        caption: "Việc làm & rao vặt"
    },
    {
        id: "business",
        label: "Business Hub",
        icon: "ri-building-line",
        subItems: [
            { label: "Create Business", icon: "ri-add-circle-line", href: "/business/create", title: "Create New Business" },
            { label: "My Businesses", icon: "ri-store-2-line", href: "/business/list", title: "My Businesses" },
            { label: "Analytics", icon: "ri-bar-chart-2-line", href: "/business/analytics", title: "Business Analytics" },
        ],
        caption: "Quản lý và doanh nghiệp"
    },
    {
        id: "news",
        label: "Editorial News",
        icon: "ri-newspaper-line",
        subItems: [
            { label: "Latest Feed", icon: "ri-rss-line", href: "/news/feed", title: "Latest News Feed" },
            { label: "Bookmarks", icon: "ri-bookmark-line", href: "/news/bookmarks", title: "Bookmarked News" },
        ],
        caption: "Tin tức & bài viết"
    },
    {
        id: "account",
        label: "Account",
        icon: "ri-user-settings-line",
        subItems: [
            { label: "Profile Settings", icon: "ri-settings-4-line", href: "/account/profile", title: "Profile Settings" },
            { label: "Security", icon: "ri-shield-keyhole-line", href: "/account/security", title: "Security Settings" },
            { label: "Billing & Payments", icon: "ri-wallet-line", href: "/account/billing", title: "Billing & Payments" },
        ],
        caption: "Cài đặt tài khoản"
    }
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const activeSectionId = MENU_ITEMS.find(section =>
            section.subItems.some(item => pathname.startsWith(item.href))
        )?.id;

        if (activeSectionId) {
            setOpenItems([activeSectionId]);
        }
    }, [pathname]);

    const activePageInfo = useMemo(() => {
        if (pathname === '/dashboard') {
            return {
                title: "Dashboard Overview",
                icon: "ri-dashboard-line",
                breadcrumb: "Dashboard"
            };
        }
        for (const section of MENU_ITEMS) {
            const match = section.subItems.find(item => pathname.startsWith(item.href));

            if (match) {
                return {
                    title: match.title,
                    icon: match.icon,
                    breadcrumb: `Dashboard / ${section.label} / ${match.label}`
                };
            }
        }

        return {
            title: "Dashboard",
            icon: "ri-layout-grid-line",
            breadcrumb: "Dashboard / Page"
        };
    }, [pathname]);

    return (
        <div className={`fixed inset-0 flex h-screen w-full bg-[#F8F8F8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-hidden ${inter.className}`}>

            <aside className="w-72 h-full flex flex-col bg-white border-r border-neutral-200 shrink-0 z-20 overflow-hidden">
                <div className="p-8 pb-6 shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 border border-neutral-200">
                            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                            <AvatarFallback className="bg-neutral-900 text-white font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <h3 className="text-lg font-bold text-neutral-900 leading-tight truncate">
                                {user?.name || 'John Doe'}
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

                <div className="flex-1 min-h-0 w-full">
                    <ScrollArea className="h-full w-full px-4 py-6">
                        <div className="w-full space-y-2">
                            <Button
                                asChild
                                variant="ghost"
                                className={`w-full justify-start px-3 h-11 transition-all duration-200 rounded-sm group
                                    ${pathname === '/dashboard'
                                        ? 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 hover:text-white'
                                        : 'text-neutral-800 hover:bg-neutral-50'
                                    }
                                `}
                            >
                                <Link href="/dashboard" className="flex items-center gap-3">
                                    <i className={`ri-dashboard-line text-lg ${pathname === '/dashboard' ? 'text-white' : 'text-neutral-500 group-hover:text-black'}`}></i>
                                    <span className={`text-base tracking-tight ${pathname === '/dashboard' ? 'font-bold' : 'font-medium'}`}>
                                        Dashboard
                                    </span>
                                </Link>
                            </Button>

                            <Accordion
                                type="multiple"
                                value={openItems}
                                onValueChange={setOpenItems}
                                className="w-full space-y-2"
                            >
                                {MENU_ITEMS.map((section) => {
                                    const isSectionActive = section.subItems.some(item => pathname.startsWith(item.href));
                                    return (
                                        <AccordionItem key={section.id} value={section.id} className="border-b-0">
                                            {/* SỬA ĐỔI TẠI ĐÂY: Thêm caption bên dưới label */}
                                            <AccordionTrigger className="py-3 px-3 h-auto min-h-[44px] hover:bg-neutral-50 rounded-sm hover:no-underline group data-[state=open]:bg-neutral-50 transition-colors">
                                                <div className="flex items-center gap-3 text-neutral-800 text-left">
                                                    <span className={`transition-colors flex-shrink-0 ${isSectionActive ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>
                                                        <i className={`${section.icon} text-lg`}></i>
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className={`font-medium text-base tracking-tight leading-none mb-1 ${isSectionActive ? 'text-black font-bold' : ''}`}>
                                                            {section.label}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-normal leading-tight">
                                                            {section.caption}
                                                        </span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="pt-1 pb-2 px-0">
                                                <div className="space-y-1 ml-3 border-l border-neutral-200 pl-3 py-1">
                                                    {section.subItems.map((item, idx) => {
                                                        const isActive = pathname.startsWith(item.href);
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
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Need Helps?</h4>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-neutral-200/50">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                                <div className="w-5 h-5 bg-white border border-neutral-200 rounded-sm flex items-center justify-center text-neutral-400">
                                    <i className="ri-mail-line text-[10px]"></i>
                                </div>
                                <span>info@vgcnews24.com</span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                                <div className="w-5 h-5 bg-white border border-neutral-200 rounded-sm flex items-center justify-center text-neutral-400">
                                    <i className="ri-phone-line text-[10px]"></i>
                                </div>
                                <span>+1 (678) 679-2347</span>
                            </div>

                            <Link href="/privacy-policy" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                <div className="w-5 h-5 bg-white border border-blue-200 rounded-sm flex items-center justify-center text-blue-600">
                                    <i className="ri-shield-check-line text-[10px]"></i>
                                </div>
                                <span>Privacy Policy</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#F8F8F8]">
                <header className="h-20 border-b border-neutral-200 bg-white flex flex-col justify-center px-8 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
                            <i className={`${activePageInfo.icon} text-xl text-neutral-700`}></i>
                        </div>

                        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
                            {activePageInfo.title}
                        </h1>
                    </div>
                    <div className="text-xs font-medium text-neutral-500 mt-1">
                        {activePageInfo.breadcrumb}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}