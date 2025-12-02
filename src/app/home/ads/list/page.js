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

// Import Components Modal
import PromoteAdModal from "@/components/ads/PromoteAdModal";
import ConfirmDeletePost from "@/components/ads/ConfirmDeactivePost";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

// --- MOCK DATA (Structure based on image_cec1c2.png) ---
const MOCK_TABLE_DATA = [
    {
        id: "1941363",
        title: "Nhân Viên Sales Phần Mềm Full-Time (Remote)",
        campaign: "Chiến dịch tuyển dụng: Sales Team Q4/2025",
        status: ["Active", "Approved"], // Đang hiển thị, Đã duyệt
        cvCount: 12,
        currentService: {
            applies: 14,
            date: "29/11/2025 - Hiện tại",
            package: "STANDARD EXTRA",
            status: "Running"
        },
        recentBatch: {
            applies: 69,
            date: "06/11/2025 - Hiện tại"
        },
        lifetime: {
            applies: 245,
            date: "01/01/2025 - Hiện tại"
        }
    },
    {
        id: "1941364",
        title: "Senior React Native Developer (Hanoi)",
        campaign: "Chiến dịch: Tech Talent Hunt",
        status: ["Active", "Approved"],
        cvCount: 8,
        currentService: {
            applies: 5,
            date: "01/12/2025 - Hiện tại",
            package: "VIP TOP",
            status: "Running"
        },
        recentBatch: {
            applies: 22,
            date: "15/11/2025 - 30/11/2025"
        },
        lifetime: {
            applies: 110,
            date: "15/10/2025 - Hiện tại"
        }
    },
    {
        id: "1941365",
        title: "Marketing Manager - B2B Sector",
        campaign: "Chiến dịch: Marketing Q1",
        status: ["Pending"], // Đang chờ duyệt
        cvCount: 0,
        currentService: null, // Chưa chạy dịch vụ
        recentBatch: {
            applies: 0,
            date: "-"
        },
        lifetime: {
            applies: 0,
            date: "-"
        }
    },
    {
        id: "1941366",
        title: "Cho thuê căn hộ 2PN - Landmark 81",
        campaign: "Chiến dịch: Bất động sản cao cấp",
        status: ["Expired"], // Hết hạn
        cvCount: 45,
        currentService: {
            applies: 45,
            date: "01/10/2025 - 01/11/2025",
            package: "BASIC",
            status: "Expired"
        },
        recentBatch: {
            applies: 45,
            date: "01/10/2025 - 01/11/2025"
        },
        lifetime: {
            applies: 150,
            date: "01/01/2025 - 01/11/2025"
        }
    }
];

export default function AdsListPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [isPromoteOpen, setIsPromoteOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);

    // --- HANDLERS ---
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
        const query = new URLSearchParams({
            type: "promotion",
            packageId: option.id,
            refId: selectedAd?.id,
        }).toString();
        router.push(`/account/billing/payment?${query}`);
    };

    const onDeleteConfirm = () => {
        console.log(`Deactivating post: ${selectedAd?.id}`);
        setIsDeleteOpen(false);
    };

    // Helper render status badges
    const renderStatus = (statuses) => {
        return (
            <div className="flex gap-1 mb-2">
                {statuses.includes("Active") && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-blue-100 uppercase tracking-tight">Đang hiển thị</span>}
                {statuses.includes("Approved") && <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-green-100 uppercase tracking-tight">Đã duyệt</span>}
                {statuses.includes("Pending") && <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-yellow-100 uppercase tracking-tight">Chờ duyệt</span>}
                {statuses.includes("Expired") && <span className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-sm text-[10px] font-bold border border-neutral-200 uppercase tracking-tight">Hết hạn</span>}
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto pb-32 pt-6 px-4 animate-fade-in font-sans">

            {/* --- HEADER & TOOLBAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Quản lý tin đăng</h1>
                    <p className="text-neutral-500 text-xs mt-1">Quản lý hiệu quả các chiến dịch tuyển dụng và quảng cáo của bạn.</p>
                </div>
                <Link href="/home/ads/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 rounded-sm shadow-sm">
                        <i className="ri-add-line mr-1 text-base"></i> Đăng tin mới
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-3 rounded-sm border border-neutral-200 shadow-sm flex flex-col lg:flex-row gap-3 items-center mb-6">
                <div className="relative w-full lg:w-96">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                    <Input
                        placeholder="Tìm theo tiêu đề hoặc mã tin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 bg-neutral-50 border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full lg:w-[150px] h-9 bg-white border-neutral-200 rounded-sm text-xs font-bold">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang hiển thị</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-full lg:w-[150px] h-9 bg-white border-neutral-200 rounded-sm text-xs font-bold">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="oldest">Cũ nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- TABLE LAYOUT --- */}
            <div className="bg-white border border-neutral-200 shadow-sm rounded-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50 border-b border-neutral-200">
                        <TableRow>
                            <TableHead className="w-[35%] py-4 text-xs font-bold text-neutral-500 uppercase tracking-tight">Tin tuyển dụng / Quảng cáo</TableHead>
                            <TableHead className="w-[5%] py-4 text-center text-xs font-bold text-neutral-500"><i className="ri-settings-3-line text-lg"></i></TableHead>
                            <TableHead className="w-[20%] py-4 text-xs font-bold text-neutral-500 uppercase tracking-tight">Dịch vụ đang chạy</TableHead>
                            <TableHead className="w-[20%] py-4 text-xs font-bold text-neutral-500 uppercase tracking-tight">Đợt hiển thị gần nhất</TableHead>
                            <TableHead className="w-[20%] py-4 text-xs font-bold text-neutral-500 uppercase tracking-tight">Toàn bộ thời gian</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_TABLE_DATA.map((item) => (
                            <TableRow key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">

                                {/* 1. TIN TUYỂN DỤNG */}
                                <TableCell className="align-top py-6 pr-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-mono text-neutral-400 font-medium">#{item.id}</span>
                                        <h3 className="text-sm font-bold text-neutral-900 leading-snug group cursor-pointer hover:text-blue-600 transition-colors mb-1">
                                            {item.title}
                                        </h3>
                                        {renderStatus(item.status)}
                                        <p className="text-[11px] text-neutral-500 line-clamp-1 mb-3">{item.campaign}</p>

                                        <Button variant="secondary" size="sm" className="h-7 w-fit bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-[10px] font-bold rounded-sm px-3 shadow-none">
                                            Xem CV ứng tuyển ({item.cvCount})
                                        </Button>
                                    </div>
                                </TableCell>

                                {/* 2. ACTIONS COLUMN */}
                                <TableCell className="align-top py-6 text-center border-l border-neutral-100 bg-neutral-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <Link href="/home/ads/create">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500" title="Chỉnh sửa">
                                                <i className="ri-pencil-line"></i>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500" title="Tạm dừng"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                            <i className="ri-pause-circle-line"></i>
                                        </Button>

                                        {/* NÚT PROMOTE */}
                                        <div className="relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handlePromoteClick(item)}
                                                className="h-8 w-8 rounded-full bg-white border border-neutral-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-neutral-500"
                                                title="Đẩy tin (Promote)"
                                            >
                                                <i className="ri-arrow-up-line"></i>
                                            </Button>
                                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <Link href="/home/ads/create">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-500">
                                                <i className="ri-file-copy-line"></i>
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>

                                {/* 3. DỊCH VỤ ĐANG CHẠY */}
                                <TableCell className="align-top py-6 border-l border-neutral-100">
                                    {item.currentService ? (
                                        <div className="space-y-3 text-xs">
                                            <div className="flex items-center gap-2 text-neutral-700">
                                                <i className="ri-file-text-line text-neutral-400"></i>
                                                <span>Lượt ứng tuyển: <b>{item.currentService.applies}</b></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-700">
                                                <i className="ri-calendar-line text-neutral-400"></i>
                                                <span className="text-[11px]">{item.currentService.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-700">
                                                <i className="ri-price-tag-3-line text-neutral-400"></i>
                                                <span className="font-bold uppercase text-[10px]">{item.currentService.package}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="ri-information-line text-neutral-400"></i>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${item.currentService.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                                    {item.currentService.status === 'Running' ? 'Đang chạy' : item.currentService.status}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-[11px] text-neutral-400 italic mb-2">Chưa có dịch vụ nào</p>
                                            <Button variant="outline" size="sm" onClick={() => handlePromoteClick(item)} className="h-7 text-[10px] uppercase font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
                                                Chạy quảng cáo ngay
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>

                                {/* 4. ĐỢT GẦN NHẤT */}
                                <TableCell className="align-top py-6 border-l border-neutral-100">
                                    <div className="space-y-3 text-xs">
                                        <div className="flex items-center gap-2 text-neutral-700">
                                            <i className="ri-file-text-line text-neutral-400"></i>
                                            <span>Lượt ứng tuyển: <b>{item.recentBatch.applies}</b></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-700">
                                            <i className="ri-calendar-line text-neutral-400"></i>
                                            <span className="text-[11px]">{item.recentBatch.date}</span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* 5. TOÀN BỘ THỜI GIAN */}
                                <TableCell className="align-top py-6 border-l border-neutral-100">
                                    <div className="space-y-3 text-xs">
                                        <div className="flex items-center gap-2 text-neutral-700">
                                            <i className="ri-file-text-line text-neutral-400"></i>
                                            <span>Lượt ứng tuyển: <b>{item.lifetime.applies}</b></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-700">
                                            <i className="ri-calendar-line text-neutral-400"></i>
                                            <span className="text-[11px]">{item.lifetime.date}</span>
                                        </div>
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* --- PAGINATION (Simple) --- */}
            <div className="flex items-center justify-between mt-4 text-xs text-neutral-500">
                <span>Hiển thị 1-4 trong số 12 tin</span>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" disabled className="h-7 w-7 rounded-sm"><i className="ri-arrow-left-s-line"></i></Button>
                    <Button variant="default" size="icon" className="h-7 w-7 rounded-sm bg-neutral-900 text-white">1</Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm">2</Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm"><i className="ri-arrow-right-s-line"></i></Button>
                </div>
            </div>

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