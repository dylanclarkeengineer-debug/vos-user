"use client"

import React, { useState, useEffect } from 'react'; // Thêm useState, useEffect
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
            { label: "Create Business", icon: "ri-add-circle-line", href: "/home/business/create" },
            { label: "My Business", icon: "ri-user-2-fill", href: "/home/business/list" },
            { label: "Job Application", icon: "ri-user-add-line", href: "/business/analytics" },
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

    // FIX HYDRATION ERROR:
    // 1. Khởi tạo state rỗng để Server và Client giống nhau ở lần render đầu tiên (tránh lệch ID)
    const [openItems, setOpenItems] = useState([]);

    // 2. Sử dụng useEffect để tính toán mục cần mở sau khi đã render trên Client
    useEffect(() => {
        const activeSectionId = MENU_ITEMS.find(section =>
            section.subItems.some(item => item.href === pathname)
        )?.id || "ads";

        setOpenItems([activeSectionId]);
    }, [pathname]);

    return (
        <aside className="w-72 h-full flex flex-col bg-white border-r border-neutral-200 shrink-0 z-20 overflow-hidden">

            {/* Header Sidebar */}
            <div className="p-8 pb-6 shrink-0">
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12 border border-neutral-200">
                        <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                        <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold">JD</AvatarFallback>
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
                    {/* Dùng asChild để tránh lỗi lồng thẻ button trong a */}
                    <Button
                        asChild
                        variant="outline"
                        className={`w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 transition-all ${pathname === '/home/account/profile' ? 'bg-neutral-900 text-white border-neutral-900' : 'hover:bg-neutral-50 hover:text-black'}`}
                    >
                        <Link href="/home/account/profile">
                            <i className="ri-settings-3-line mr-2 text-sm"></i> Profile
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className={`w-full h-9 text-xs uppercase tracking-wider font-bold rounded-sm border-neutral-200 transition-all ${pathname === '/home/account/billing' ? 'bg-neutral-900 text-white border-neutral-900' : 'hover:bg-neutral-50 hover:text-black'}`}
                    >
                        <Link href="/home/account/billing">
                            <i className="ri-wallet-3-line mr-2 text-sm"></i> Billing
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="px-8 shrink-0">
                <Separator className="bg-neutral-100" />
            </div>

            {/* Navigation Area */}
            <div className="flex-1 min-h-0 w-full">
                <ScrollArea className="h-full w-full px-4 py-6">
                    {/* FIX: Chuyển sang Controlled Component (dùng value & onValueChange) */}
                    <Accordion
                        type="multiple"
                        value={openItems}
                        onValueChange={setOpenItems}
                        className="w-full space-y-4 pr-3"
                    >
                        {MENU_ITEMS.map((section) => {
                            const isSectionActive = section.subItems.some(item => item.href === pathname);

                            return (
                                <AccordionItem key={section.id} value={section.id} className="border-b-0">
                                    <AccordionTrigger className="py-2 px-3 hover:bg-neutral-50 rounded-sm hover:no-underline group data-[state=open]:bg-neutral-50 transition-colors">
                                        <div className="flex items-center gap-3 text-neutral-800">
                                            <span className={`transition-colors ${isSectionActive ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>
                                                <i className={`${section.icon} text-lg`}></i>
                                            </span>
                                            <span className={`font-medium text-base tracking-tight ${isSectionActive ? 'text-black font-bold' : ''}`}>
                                                {section.label}
                                            </span>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="pt-2 pb-4 px-2">
                                        <div className="space-y-1 ml-2 border-l border-neutral-200 pl-3">
                                            {section.subItems.map((item, idx) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={idx}
                                                        href={item.href}
                                                        className={`w-full flex items-center gap-3 py-2 px-3 text-sm transition-all duration-200 rounded-md text-left group
                                                            ${isActive
                                                                ? 'bg-neutral-900 text-white font-bold shadow-sm'
                                                                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
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
                            );
                        })}
                    </Accordion>
                </ScrollArea>
            </div>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-200 shrink-0">
                <div className="mb-4">
                    <h4 className="font-bold text-neutral-900 mb-1">Need Assistance?</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                        Our editorial support team is available 24/7.
                    </p>
                </div>

                <div className="space-y-2">
                    <a href="mailto:support@vgc.com" className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors">
                        <i className="ri-customer-service-2-line text-sm"></i>
                        support@vgc-agency.com
                    </a>
                    <button className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors">
                        <i className="ri-phone-fill"></i>
                        Contact us: +1 000 000 0000
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
        <div className="fixed inset-0 flex h-screen w-full bg-[#F8F8F8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
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
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth bg-[#F8F8F8]">
                    <div className="max-w-5xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}