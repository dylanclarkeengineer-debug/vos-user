"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
            { label: "Company Profile", icon: "ri-user-2-fill", href: "/home/account/profile" },
            { label: "Analytics", icon: "ri-bar-chart-2-line", href: "/business/analytics" },
        ]
    },
    {
        id: "news",
        label: "Editorial News",
        icon: "ri-newspaper-line",
        subItems: [
            { label: "Latest Feed", icon: "ri-rss-line", href: "/news/feed" },
            { label: "Bookmarks", icon: "ri-bookmark-line", href: "/news/bookmarks" },
        ]
    },
    {
        id: "account",
        label: "Account",
        icon: "ri-user-settings-line",
        subItems: [
            { label: "Profile Settings", icon: "ri-settings-4-line", href: "/account/settings" },
            { label: "Security", icon: "ri-shield-keyhole-line", href: "/account/security" },
        ]
    }
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        // Sidebar giữ nguyên h-full để ăn theo chiều cao cố định của cha
        <aside className="w-72 h-full flex flex-col bg-white border-r border-neutral-200 shrink-0 z-20 overflow-hidden">

            {/* Header Sidebar */}
            <div className="p-8 pb-6 shrink-0">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12 border border-neutral-200">
                        <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                        <AvatarFallback className="bg-neutral-100 text-neutral-600 font-serif">JD</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <h3 className="text-lg font-serif font-bold text-neutral-900 leading-tight truncate">
                            John Doe
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                            Premium Member
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link href="/account/profile" className="w-full">
                        <Button variant="outline" className="w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 hover:bg-neutral-950 hover:text-white transition-all">
                            <i className="ri-settings-3-line mr-2 text-sm"></i> Profile
                        </Button>
                    </Link>

                    <Link href="/account/billing" className="w-full">
                        <Button variant="outline" className="w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 hover:bg-neutral-950 hover:text-white transition-all">
                            <i className="ri-wallet-3-line mr-2 text-sm"></i> Billing
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="px-8 shrink-0">
                <Separator className="bg-neutral-100" />
            </div>

            {/* Navigation Area */}
            <div className="flex-1 min-h-0 w-full">
                <ScrollArea className="h-full w-full px-4 py-6">
                    <Accordion type="multiple" defaultValue={["ads", "account"]} className="w-full space-y-4 pr-3">
                        {MENU_ITEMS.map((section) => (
                            <AccordionItem key={section.id} value={section.id} className="border-b-0">
                                <AccordionTrigger className="py-2 px-3 hover:bg-neutral-50 rounded-sm hover:no-underline group data-[state=open]:bg-neutral-50 transition-colors">
                                    <div className="flex items-center gap-3 text-neutral-800">
                                        <span className="text-neutral-500 group-hover:text-black transition-colors">
                                            <i className={`${section.icon} text-lg`}></i>
                                        </span>
                                        <span className="font-serif font-medium text-base tracking-tight">
                                            {section.label}
                                        </span>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-2 pb-4 px-3">
                                    <div className="space-y-1 ml-2 border-l border-neutral-200 pl-4">
                                        {section.subItems.map((item, idx) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    className={`w-full flex items-center gap-3 py-2 px-2 text-sm transition-all duration-300 text-left group
                                                    ${isActive ? 'text-black translate-x-1 font-bold' : 'text-neutral-500 hover:text-neutral-900 hover:translate-x-1'}
                                                `}
                                                >
                                                    <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                                        <i className={`${item.icon} text-base`}></i>
                                                    </span>
                                                    <span className="tracking-wide">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-200 shrink-0">
                <div className="mb-4">
                    <h4 className="font-serif font-bold text-neutral-900 mb-1">Need Assistance?</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                        Our editorial support team is available 24/7.
                    </p>
                </div>

                <div className="space-y-2">
                    <a href="mailto:support@vgc.com" className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors">
                        <i className="ri-customer-service-2-line text-sm"></i>
                        support@vgc-agency.com
                    </a>
                    <button className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                        <i className="ri-logout-box-r-line text-sm"></i>
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default function HomeLayout({ children }) {
    const pathname = usePathname();

    const getBreadcrumb = () => {
        if (pathname === '/' || pathname === '/home') {
            return "WORKSPACE / DASHBOARD";
        }
        const segments = pathname.split('/').filter(Boolean);
        return `WORKSPACE / ${segments.join(' / ')}`.toUpperCase();
    };

    return (
        // FIX: Thêm 'fixed inset-0' để ghim layout vào viewport -> Loại bỏ scroll body
        <div className="fixed inset-0 flex h-screen w-full bg-[#F8F8F8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-hidden">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

                {/* Header (Fixed height) */}
                <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                        {getBreadcrumb()}
                    </div>
                    <div className="text-sm font-serif italic text-neutral-500">
                        "Veritas. Gravitas. Claritas."
                    </div>
                </header>

                {/* Content Injection Area */}
                {/* Chỉ khu vực này được phép scroll */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth bg-[#F8F8F8]">
                    <div className="max-w-5xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}