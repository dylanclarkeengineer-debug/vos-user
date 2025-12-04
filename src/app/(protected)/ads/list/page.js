"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import PromoteAdModal from "@/components/ads/PromoteAdModal";
import ConfirmDeletePost from "@/components/ads/ConfirmDeactivePost";
import "remixicon/fonts/remixicon.css";

// --- MOCK DATA (Tăng lên 12 item để test pagination) ---
const GENERATE_MOCK_DATA = () => {
    const baseData = [
        {
            id: "a7k9m2p5",
            title: "Software Engineer Position - Remote",
            description: "We are looking for an experienced software engineer to join our remote team. Must have 5+ years of experience in React & Node.js.",
            price: "$120,000 - $150,000",
            status: "Active",
            views: 156,
            engagement: { applications: 23, shares: 8 },
            details: { category: "Jobs - Full Time", location: "San Francisco, CA", posted: "15/01/2024", expires: "15/02/2024" }
        },
        {
            id: "b3n8q1r4",
            title: "2BR Apartment for Rent in San Jose",
            description: "Beautiful 2-bedroom apartment in downtown San Jose. Close to public transportation and shopping centers. Fully furnished.",
            price: "$3,200/month",
            status: "Active",
            views: 89,
            engagement: { applications: 12, shares: 5 },
            details: { category: "Housing - For Rent", location: "San Jose, CA", posted: "12/01/2024", expires: "12/02/2024" }
        },
        {
            id: "c9x2z5y7",
            title: "2023 MacBook Pro M2 Max - Silver",
            description: "Brand new condition, box included. AppleCare+ valid until 2026. 32GB RAM, 1TB SSD. Battery cycle count: 15.",
            price: "$2,800",
            status: "Pending",
            views: 45,
            engagement: { applications: 4, shares: 2 },
            details: { category: "Electronics - Laptops", location: "Austin, TX", posted: "18/01/2024", expires: "18/02/2024" }
        },
        {
            id: "d4w1v8t6",
            title: "Marketing Manager - Tech Startup",
            description: "Leading marketing strategy for a Series A fintech startup. Experience in B2B growth marketing required.",
            price: "$90,000 - $110,000",
            status: "Expired",
            views: 312,
            engagement: { applications: 45, shares: 18 },
            details: { category: "Jobs - Marketing", location: "New York, NY", posted: "01/12/2023", expires: "01/01/2024" }
        },
        {
            id: "e5u3s9j2",
            title: "Used Toyota Camry 2020 SE",
            description: "Clean title, single owner, 25k miles. Regular maintenance at dealership. New tires installed last month.",
            price: "$22,500",
            status: "Active",
            views: 204,
            engagement: { applications: 8, shares: 15 },
            details: { category: "Vehicles - Cars", location: "Seattle, WA", posted: "20/01/2024", expires: "20/02/2024" }
        }
    ];

    // Nhân bản data để có đủ trang test
    let fullData = [...baseData];
    // Thêm data giả
    for (let i = 0; i < 7; i++) {
        fullData.push({
            ...baseData[i % 5],
            id: `mock_id_${i}`,
            title: `${baseData[i % 5].title} (Copy ${i + 1})`,
            views: Math.floor(Math.random() * 500),
            status: i % 2 === 0 ? "Active" : "Expired"
        });
    }
    return fullData;
};

const ALL_DATA = GENERATE_MOCK_DATA();

export default function AdsListPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- MODAL STATE ---
    const [isPromoteOpen, setIsPromoteOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);

    // --- LOGIC CẮT DATA ---
    const totalPages = Math.ceil(ALL_DATA.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = ALL_DATA.slice(startIndex, endIndex);

    // --- HANDLERS ---
    const handleEdit = (id) => router.push(`/ads/create?edit=${id}`);
    const handleDuplicate = (id) => router.push(`/ads/create?copy=${id}`);
    const handlePauseClick = (ad) => { setSelectedAd(ad); setIsDeleteOpen(true); };
    const handlePromoteClick = (ad) => { setSelectedAd(ad); setIsPromoteOpen(true); };
    const onPromoteConfirm = (option) => { setIsPromoteOpen(false); };
    const onDeleteConfirm = () => { setIsDeleteOpen(false); };

    // Chuyển trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Render Status Badge
    const renderStatus = (status) => {
        const styles = {
            Active: "bg-green-100 text-green-700",
            Pending: "bg-yellow-100 text-yellow-700",
            Expired: "bg-neutral-100 text-neutral-500",
        };
        return (
            <span className={`${styles[status] || styles.Expired} px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase inline-block mb-2`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-32 pt-6 px-4 font-sans text-neutral-900 animate-fade-in">

            {/* 1. TOP BAR */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search by title or ad code..."
                    className="h-10 bg-white border-neutral-200 w-full lg:max-w-md focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
                <div className="flex gap-2 w-full lg:w-auto ml-auto">
                    <Select defaultValue="all"><SelectTrigger className="w-[140px] h-10 bg-white"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem></SelectContent></Select>
                    <Select defaultValue="date"><SelectTrigger className="w-[140px] h-10 bg-white"><SelectValue placeholder="All Dates" /></SelectTrigger><SelectContent><SelectItem value="date">All Dates</SelectItem></SelectContent></Select>
                    <Link href="/ads/create">
                        <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">
                            <i className="ri-add-line mr-2"></i> Create New Ad
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 2. MAIN CARD */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[600px]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-white flex-none">
                    <h2 className="text-xl font-bold text-neutral-900">Posted Ads ({ALL_DATA.length})</h2>
                    <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-full">
                        <i className="ri-eye-line text-neutral-400"></i> Total Views: 12,515
                    </div>
                </div>

                {/* Body Table (Flex-1 để đẩy footer xuống đáy nếu ít item) */}
                <div className="flex-1 overflow-auto">
                    <TooltipProvider delayDuration={0}>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-neutral-100 hover:bg-transparent">
                                    <TableHead className="w-[45%] pl-6 py-4 text-xs font-bold text-neutral-900 uppercase tracking-tight">Title</TableHead>
                                    <TableHead className="w-[5%]  py-4 text-center text-xs font-bold text-neutral-900 uppercase tracking-tight">Actions</TableHead>
                                    <TableHead className="w-[10%] py-4 text-center text-xs font-bold text-neutral-500 uppercase tracking-tight">Views</TableHead>
                                    <TableHead className="w-[15%] py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-tight">Engagement</TableHead>
                                    <TableHead className="w-[25%] py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-tight">Details</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentData.map((item) => (
                                    <TableRow key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors">

                                        {/* Col 1 */}
                                        <TableCell className="pl-6 py-6 align-top">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-[10px] text-neutral-400 font-mono">Ad Code: {item.id}</span>
                                                <h3 className="text-base font-bold text-neutral-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer mb-1">
                                                    {item.title}
                                                </h3>
                                                {renderStatus(item.status)}

                                                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 max-w-xl mb-2">
                                                    {item.description}
                                                </p>

                                                <div className="font-bold text-blue-600 text-sm mb-3">
                                                    {item.price}
                                                </div>

                                                <Button variant="secondary" className="h-7 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-none rounded-sm text-[10px] font-bold uppercase tracking-wider px-3">
                                                    <i className="ri-eye-line mr-1.5"></i> View Post
                                                </Button>
                                            </div>
                                        </TableCell>

                                        {/* Col 2: Actions */}
                                        <TableCell className="align-top py-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <ActionIcon icon="ri-pencil-line" tooltip="Edit" onClick={() => handleEdit(item.id)} />
                                                <ActionIcon icon="ri-rocket-line" tooltip="Promote" color="text-orange-500 hover:bg-orange-50" onClick={() => handlePromoteClick(item)} />
                                                <ActionIcon icon="ri-file-copy-line" tooltip="Copy" onClick={() => handleDuplicate(item.id)} />
                                                <ActionIcon icon="ri-delete-bin-line" tooltip="Delete" color="text-red-500 hover:bg-red-50" onClick={() => handlePauseClick(item)} />
                                            </div>
                                        </TableCell>

                                        {/* Col 3: Views */}
                                        <TableCell className="align-top py-6 text-center">
                                            <span className="text-xl font-bold text-neutral-900 block mt-2">{item.views}</span>
                                        </TableCell>

                                        {/* Col 4: Engagement */}
                                        <TableCell className="align-top py-6">
                                            <div className="flex flex-col gap-3 mt-1">
                                                <div className="flex items-start gap-2">
                                                    <i className="ri-file-list-3-line text-neutral-400 mt-0.5"></i>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Applications</span>
                                                        <span className="text-sm font-bold text-neutral-900">{item.engagement.applications}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <i className="ri-share-forward-line text-neutral-400 mt-0.5"></i>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Shares</span>
                                                        <span className="text-sm font-bold text-neutral-900">{item.engagement.shares}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Col 5: Details */}
                                        <TableCell className="align-top py-6">
                                            <div className="space-y-2.5 mt-1">
                                                <DetailRow icon="ri-folder-line" text={item.details.category} />
                                                <DetailRow icon="ri-map-pin-line" text={item.details.location} />
                                                <DetailRow icon="ri-calendar-line" text={`Posted: ${item.details.posted}`} />
                                                <div className="flex items-center gap-3 text-xs">
                                                    <i className="ri-time-line text-red-500 w-4 text-center"></i>
                                                    <span className="text-red-500 font-bold">Expires: {item.details.expires}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </div>

                {/* 3. PAGINATION FOOTER */}
                <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between flex-none">
                    <div className="text-xs text-neutral-500 font-medium">
                        Showing <span className="font-bold text-neutral-900">{startIndex + 1}-{Math.min(endIndex, ALL_DATA.length)}</span> of <span className="font-bold text-neutral-900">{ALL_DATA.length}</span> ads
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-sm bg-white hover:bg-neutral-100 disabled:opacity-40"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="ri-arrow-left-s-line text-neutral-600"></i>
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    className={`h-8 w-8 rounded-sm text-xs font-bold ${currentPage === page
                                        ? "bg-neutral-900 text-white hover:bg-black border-neutral-900"
                                        : "bg-white text-neutral-600 border-transparent hover:bg-neutral-100 hover:text-black"
                                        }`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-sm bg-white hover:bg-neutral-100 disabled:opacity-40"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="ri-arrow-right-s-line text-neutral-600"></i>
                        </Button>
                    </div>
                </div>

            </div>

            {/* Modals */}
            {selectedAd && (
                <>
                    <PromoteAdModal isOpen={isPromoteOpen} onClose={() => setIsPromoteOpen(false)} onConfirm={onPromoteConfirm} />
                    <ConfirmDeletePost isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={onDeleteConfirm} post={selectedAd} />
                </>
            )}
        </div>
    );
}

// Sub-components
const ActionIcon = ({ icon, tooltip, onClick, color = "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100" }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClick} className={`h-8 w-8 rounded-sm transition-all ${color}`}>
                <i className={`${icon} text-lg`}></i>
            </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-black text-white text-[10px] font-bold uppercase tracking-wider border-none">
            {tooltip}
        </TooltipContent>
    </Tooltip>
);

const DetailRow = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-xs text-neutral-600">
        <i className={`${icon} text-neutral-400 w-4 text-center`}></i>
        <span>{text}</span>
    </div>
);