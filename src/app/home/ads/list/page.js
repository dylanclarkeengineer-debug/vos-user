"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import router để chuyển trang
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

// Import Components Modal
import PromoteAdModal from "@/components/ads/PromoteAdModal";
import ConfirmDeletePost from "@/components/ads/ConfirmDeactivePost";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

// --- 1. MOCK DATA ---
const MOCK_ADS = Array.from({ length: 20 }).map((_, i) => {
    const types = ["Jobs", "Real Estate", "Services", "Marketplace"];
    const statuses = ["Active", "Pending", "Expired", "Draft"];
    const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Remote", "London, UK"];

    return {
        id: `AD-${1000 + i}`,
        title: [
            "Senior React Native Developer",
            "Modern Apartment in Downtown",
            "Professional SEO Services",
            "Sony A7III Camera Kit",
            "Marketing Director",
            "Luxury Villa for Rent",
            "Graphic Designer Freelance",
            "2021 MacBook Pro M1"
        ][i % 8] + ` ${i + 1}`,
        type: types[i % 4],
        status: statuses[i % 4],
        postedDate: `1${i}/01/2024`,
        expiryDate: `1${i}/02/2024`,
        location: locations[i % 5],
        price: i % 2 === 0 ? "$2,500 - $4,000" : "Negotiable",
        views: Math.floor(Math.random() * 500) + 50,
        applications: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        description: "This is a detailed description of the advertisement. It contains key information about the job, property, or item being sold to attract potential viewers."
    };
});

export default function AdsListPage() {
    const router = useRouter();

    // --- STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // State Modal
    const [isPromoteOpen, setIsPromoteOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);

    const itemsPerPage = 5;

    // --- HANDLERS MODAL ---
    const handlePromoteClick = (ad) => {
        setSelectedAd(ad);
        setIsPromoteOpen(true);
    };

    const handleDeleteClick = (ad) => {
        setSelectedAd(ad);
        setIsDeleteOpen(true);
    };

    const onPromoteConfirm = (option) => {
        setIsPromoteOpen(false);
        // Chuyển hướng sang trang thanh toán với params
        const query = new URLSearchParams({
            type: 'promotion',
            packageId: option.id,
            packageName: option.title,
            price: option.price,
            refId: selectedAd?.id
        }).toString();

        router.push(`/account/billing/payment?${query}`);
    };

    const onDeleteConfirm = () => {
        // Logic gọi API xóa bài ở đây
        console.log(`Deactivating post: ${selectedAd?.id}`);
        setIsDeleteOpen(false);
        // Có thể thêm Toast thông báo thành công
    };

    // --- PAGINATION LOGIC ---
    const filteredAds = MOCK_ADS.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAds.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAds.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.getElementById('ads-list-top')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active": return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
            case "Pending": return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
            case "Expired": return "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200";
            case "Draft": return "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100";
            default: return "bg-neutral-50 text-neutral-700 border-neutral-200";
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-32 pt-4 space-y-8 animate-fade-in px-2">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" id="ads-list-top">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        <Link href="/home" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
                        <i className="ri-arrow-right-s-line"></i>
                        <span className="text-neutral-900 border-b border-neutral-900">My Ads</span>
                    </div>
                    <h1 className="font-serif font-bold text-3xl text-neutral-900">
                        Posted Ads <span className="text-neutral-400 font-sans text-lg font-normal ml-1">({filteredAds.length})</span>
                    </h1>
                </div>
                <Link href="/home/ads/create">
                    <Button className="bg-neutral-900 hover:bg-black text-white font-bold uppercase tracking-widest text-xs h-10 px-6 shadow-md rounded-sm">
                        <i className="ri-add-line mr-2 text-base"></i> Create New Ad
                    </Button>
                </Link>
            </div>

            {/* --- TOOLBAR --- */}
            <div className="bg-white p-4 rounded-sm border border-neutral-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-0 z-10">
                <div className="relative w-full lg:w-96">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                    <Input
                        placeholder="Search by title or ad code..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 h-10 bg-neutral-50 border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900"
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] h-10 bg-white border-neutral-200 rounded-sm text-xs font-bold uppercase tracking-wider">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[140px] h-10 bg-white border-neutral-200 rounded-sm text-xs font-bold uppercase tracking-wider">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="views">Most Views</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- ADS LIST --- */}
            <div className="space-y-4 min-h-[400px]">
                {currentItems.length > 0 ? (
                    currentItems.map((ad) => (
                        <Card key={ad.id} className="border border-neutral-200 shadow-sm rounded-sm hover:border-neutral-300 transition-all group bg-white animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col lg:flex-row">
                                {/* LEFT: Content */}
                                <div className="flex-1 p-6 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={`rounded-sm px-2 py-0.5 text-[10px] uppercase font-bold border ${getStatusStyle(ad.status)}`}>
                                                        {ad.status}
                                                    </Badge>
                                                    <span className="text-[10px] font-mono text-neutral-400 uppercase">#{ad.id}</span>
                                                </div>
                                                <h3 className="font-serif font-bold text-xl text-neutral-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1">
                                                    {ad.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                                            {ad.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium pt-2">
                                        <div className="flex items-center gap-1.5"><i className="ri-price-tag-3-line text-neutral-400"></i><span className="font-bold text-neutral-900">{ad.price}</span></div>
                                        <div className="flex items-center gap-1.5"><i className="ri-map-pin-line text-neutral-400"></i>{ad.location}</div>
                                        <div className="flex items-center gap-1.5"><i className="ri-folder-line text-neutral-400"></i>{ad.type}</div>
                                        <div className="flex items-center gap-1.5"><i className="ri-calendar-line text-neutral-400"></i>Posted: {ad.postedDate}</div>
                                    </div>
                                </div>

                                {/* RIGHT: Actions */}
                                <div className="lg:w-72 bg-neutral-50/50 border-t lg:border-t-0 lg:border-l border-neutral-100 p-6 flex flex-col justify-between gap-6">
                                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-neutral-200">
                                        <div className="flex flex-col"><span className="text-lg font-bold text-neutral-900">{ad.views}</span><span className="text-[9px] uppercase tracking-wider text-neutral-400">Views</span></div>
                                        <div className="flex flex-col"><span className="text-lg font-bold text-neutral-900">{ad.applications}</span><span className="text-[9px] uppercase tracking-wider text-neutral-400">Apply</span></div>
                                        <div className="flex flex-col"><span className="text-lg font-bold text-neutral-900">{ad.shares}</span><span className="text-[9px] uppercase tracking-wider text-neutral-400">Share</span></div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-neutral-200 text-neutral-500 hover:text-blue-600 hover:border-blue-200 rounded-sm" title="Edit">
                                            <i className="ri-pencil-line text-base"></i>
                                        </Button>

                                        {/* NÚT PROMOTE (Mở Modal) */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePromoteClick(ad)}
                                            className="h-8 w-8 p-0 border-neutral-200 text-neutral-500 hover:text-purple-600 hover:border-purple-200 rounded-sm"
                                            title="Promote"
                                        >
                                            <i className="ri-rocket-line text-base"></i>
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-sm text-neutral-400">
                                                    <i className="ri-more-2-fill text-base"></i>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-sm border-neutral-200 shadow-xl">
                                                <Link href="/home/ads/create"><DropdownMenuItem className="text-xs font-bold uppercase tracking-wider cursor-pointer">Duplicate</DropdownMenuItem></Link>

                                                {/* NÚT DELETE (Mở Modal) */}
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(ad)}
                                                    className="text-xs font-bold uppercase tracking-wider cursor-pointer text-red-600 focus:text-red-700"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button size="sm" className="bg-neutral-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest h-8 px-4 rounded-sm ml-auto">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white border border-neutral-200 rounded-sm border-dashed">
                        <p className="text-neutral-400 text-sm">No ads found matching your search.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")} className="text-xs font-bold uppercase tracking-widest">Clear Search</Button>
                    </div>
                )}
            </div>

            {/* --- PAGINATION --- */}
            {filteredAds.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 pt-6 gap-4">
                    <span className="text-xs text-neutral-400 font-medium uppercase tracking-wide">
                        Showing <span className="text-neutral-900 font-bold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAds.length)}</span> of <span className="text-neutral-900 font-bold">{filteredAds.length}</span> ads
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="h-9 w-9 p-0 rounded-sm border-neutral-200 hover:bg-neutral-50 disabled:opacity-50">
                            <i className="ri-arrow-left-s-line text-lg"></i>
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className={`h-9 w-9 p-0 rounded-sm font-bold text-xs ${currentPage === page ? "bg-neutral-900 text-white border-neutral-900 hover:bg-black" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-9 w-9 p-0 rounded-sm border-neutral-200 hover:bg-neutral-50 disabled:opacity-50">
                            <i className="ri-arrow-right-s-line text-lg"></i>
                        </Button>
                    </div>
                </div>
            )}

            {/* --- MODALS --- */}
            {selectedAd && (
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
                        post={selectedAd}
                    />
                </>
            )}

        </div>
    );
}