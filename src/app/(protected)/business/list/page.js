"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// --- IMPORT SHADCN TOOLTIP ---
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// Import Modals
import PromoteAdModal from "@/components/ads/PromoteAdModal";
import ConfirmDeletePost from "@/components/ads/ConfirmDeactivePost";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

// --- MOCK DATA ---
const MOCK_BUSINESSES = [
    {
        id: "b7k9m2",
        name: "Golden Nail Spa",
        desc: "Premium nail care services with experienced technicians",
        status: "Active",
        category: "Nail Salon / Tiệm Nail",
        location: "123 Main St, San Jose, CA 95112",
        reviews: 48,
        rating: 4.8,
        logo: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=100&h=100",
        initials: "GN"
    },
    {
        id: "c2s4f5",
        name: "Pho Vietnam Restaurant",
        desc: "Authentic Vietnamese cuisine in the heart of the city",
        status: "Active",
        category: "Restaurant/Nhà Hàng Việt",
        location: "456 Oak Ave, San Francisco, CA 94102",
        reviews: 127,
        rating: 4.5,
        logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100&h=100",
        initials: "PV"
    },
    {
        id: "a3x8n1",
        name: "VN Insurance Group",
        desc: "Comprehensive insurance solutions for Vietnamese community",
        status: "Draft",
        category: "Insurance/ Bảo hiểm Việt",
        location: "789 Pine Rd, Los Angeles, CA 90001",
        reviews: 0,
        rating: 0,
        logo: "",
        initials: "VI"
    }
];

export default function BusinessListPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [isPromoteOpen, setIsPromoteOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBiz, setSelectedBiz] = useState(null);

    // --- ACTIONS HANDLERS ---
    const handleEdit = (id) => {
        router.push(`/business/create?edit=${id}`);
    };

    const handleDuplicate = (id) => {
        router.push(`/business/create?copy=${id}`);
    };

    const handlePromote = (biz) => {
        setSelectedBiz(biz);
        setIsPromoteOpen(true);
    };

    const handleDeactivate = (biz) => {
        setSelectedBiz(biz);
        setIsDeleteOpen(true);
    };

    // Confirm Handlers
    const onPromoteConfirm = (option) => {
        setIsPromoteOpen(false);
        const query = new URLSearchParams({
            type: "promotion",
            packageId: option.id,
            refId: selectedBiz?.id,
        }).toString();
        router.push(`/account/billing/payment?${query}`);
    };

    const onDeleteConfirm = () => {
        console.log(`Deactivating business: ${selectedBiz?.id}`);
        setIsDeleteOpen(false);
    };

    // Helper render status
    const renderStatus = (status) => {
        switch (status) {
            case "Active":
                return <span className="inline-flex px-2 py-0.5 rounded-sm bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-wide">Active</span>;
            case "Draft":
                return <span className="inline-flex px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 text-[10px] font-bold border border-neutral-200 uppercase tracking-wide">Draft</span>;
            default:
                return <span className="inline-flex px-2 py-0.5 rounded-sm bg-neutral-50 text-neutral-600 text-[10px] font-bold border border-neutral-200 uppercase tracking-wide">{status}</span>;
        }
    };

    // Style chung cho Tooltip Content (giống ảnh mẫu: nền đen, chữ trắng, in hoa)
    const tooltipStyle = "bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm border-none";

    return (
        <div className="max-w-[1400px] mx-auto pb-32 pt-6 px-4 animate-fade-in font-sans">
            {/* --- STATS OVERVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* ... (Stats cards remain unchanged) ... */}
                <Card className="border border-neutral-200 shadow-sm rounded-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Businesses</p>
                            <h3 className="text-3xl font-bold text-neutral-900">3</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center text-xl">
                            <i className="ri-store-2-line"></i>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-neutral-200 shadow-sm rounded-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Active Listings</p>
                            <h3 className="text-3xl font-bold text-green-600">2</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-sm flex items-center justify-center text-xl">
                            <i className="ri-checkbox-circle-line"></i>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-neutral-200 shadow-sm rounded-sm bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Reviews</p>
                            <h3 className="text-3xl font-bold text-yellow-600">175</h3>
                        </div>
                        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-sm flex items-center justify-center text-xl">
                            <i className="ri-star-smile-line"></i>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- BUSINESS LIST TABLE --- */}
            <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden min-h-[400px]">
                {/* Bọc TableBody bằng TooltipProvider */}
                <TooltipProvider delayDuration={100}>
                    <Table>
                        <TableHeader className="bg-neutral-50 border-b border-neutral-200">
                            <TableRow>
                                <TableHead className="w-[45%] py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest pl-6">Business</TableHead>
                                <TableHead className="w-[10%] py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">Actions</TableHead>
                                <TableHead className="w-[30%] py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Details</TableHead>
                                <TableHead className="w-[15%] py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right pr-6">Engagement</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_BUSINESSES.map((biz) => (
                                <TableRow key={biz.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 group">

                                    {/* 1. BUSINESS INFO */}
                                    <TableCell className="align-top py-6 pl-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-14 w-14 rounded-sm border border-neutral-200 shrink-0">
                                                <AvatarImage src={biz.logo} className="object-cover" />
                                                <AvatarFallback className="bg-neutral-900 text-white font-bold rounded-sm text-xs">{biz.initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-mono text-neutral-400">#{biz.id}</p>
                                                <h3 className="text-base font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                                                    {biz.name}
                                                </h3>
                                                {renderStatus(biz.status)}
                                                <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed max-w-sm">
                                                    {biz.desc}
                                                </p>
                                                <div className="pt-1">
                                                    <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800">
                                                        <i className="ri-eye-line mr-1"></i> View Business
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* 2. ACTIONS (Vertical Icons with Tooltips) */}
                                    <TableCell className="align-top py-6 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            {/* EDIT */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handleEdit(biz.id)}
                                                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="ri-pencil-fill text-sm"></i>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className={tooltipStyle}>Edit</TooltipContent>
                                            </Tooltip>

                                            {/* PROMOTE */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handlePromote(biz)}
                                                        className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="ri-megaphone-fill text-sm"></i>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className={tooltipStyle}>Promote</TooltipContent>
                                            </Tooltip>

                                            {/* DUPLICATE */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handleDuplicate(biz.id)}
                                                        className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="ri-file-copy-fill text-sm"></i>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className={tooltipStyle}>Duplicate</TooltipContent>
                                            </Tooltip>

                                            {/* DEACTIVATE */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handleDeactivate(biz)}
                                                        className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <i className="ri-close-circle-fill text-sm"></i>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className={tooltipStyle}>Deactivate</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </TableCell>

                                    {/* 3. DETAILS */}
                                    <TableCell className="align-top py-6">
                                        <div className="space-y-3 text-xs text-neutral-600">
                                            <div className="flex items-start gap-2">
                                                <i className="ri-price-tag-3-line text-neutral-400 mt-0.5"></i>
                                                <span className="font-medium">{biz.category}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <i className="ri-map-pin-line text-neutral-400 mt-0.5"></i>
                                                <span className="leading-relaxed">{biz.location}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* 4. ENGAGEMENT */}
                                    <TableCell className="align-top py-6 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5 mb-1">
                                            <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                            <span className="text-sm font-bold text-neutral-900">Reviews: {biz.reviews}</span>
                                        </div>
                                        {biz.rating > 0 ? (
                                            <div className="flex justify-end">
                                                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold rounded-sm">
                                                    {biz.rating} / 5.0
                                                </Badge>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-neutral-400 italic">No ratings yet</span>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </div>

            {/* --- MODALS --- */}
            {selectedBiz && (
                <>
                    <PromoteAdModal
                        isOpen={isPromoteOpen}
                        onClose={() => setIsPromoteOpen(false)}
                        onConfirm={onPromoteConfirm}
                    />
                    <ConfirmDeletePost
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        onConfirm={onDeleteConfirm}
                        post={selectedBiz}
                    />
                </>
            )}

        </div>
    );
}