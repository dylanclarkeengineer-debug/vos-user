"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

// Import ShadCN Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

function cn(...inputs) { return twMerge(clsx(inputs)); }

// --- MOCK DATA ---
const MOCK_REFUNDS = [
    {
        id: "REF-001",
        type: "DEPOSIT",
        relatedRef: "TRX-BANK-9982",
        date: "2024-12-01",
        value: "$50.00",
        points: 550,
        reason: "Deposit successful but points not added",
        status: "PENDING"
    },
    {
        id: "REF-002",
        type: "SERVICE",
        relatedRef: "TRX-SVC-1123",
        date: "2024-11-28",
        value: "100 pts",
        points: 100,
        reason: "Accidental purchase of Vetted Badge",
        status: "APPROVED"
    },
    {
        id: "REF-003",
        type: "SERVICE",
        relatedRef: "TRX-SVC-1120",
        date: "2024-11-25",
        value: "50 pts",
        points: 50,
        reason: "Sticky post didn't appear on top",
        status: "REJECTED"
    },
    {
        id: "REF-004",
        type: "DEPOSIT",
        relatedRef: "TRX-MOMO-8821",
        date: "2024-11-20",
        value: "$10.00",
        points: 100,
        reason: "Double charged on credit card",
        status: "APPROVED"
    },
    {
        id: "REF-005",
        type: "SERVICE",
        relatedRef: "TRX-NEWS-3312",
        date: "2024-11-15",
        value: "80 pts",
        points: 80,
        reason: "Ad banner display error",
        status: "PENDING"
    }
];

export default function PointRefundPage() {

    // --- STATES ---
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortDesc, setSortDesc] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- LOGIC FILTER & SORT (MÔ PHỎNG) ---
    const processedData = useMemo(() => {
        let arr = [...MOCK_REFUNDS];

        // Filter Status
        if (statusFilter !== "all") {
            arr = arr.filter(item => item.status === statusFilter);
        }

        // Filter Date
        if (startDate) arr = arr.filter(item => item.date >= startDate);
        if (endDate) arr = arr.filter(item => item.date <= endDate);

        // Sort
        arr.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortDesc ? dateB - dateA : dateA - dateB;
        });

        return arr;
    }, [statusFilter, startDate, endDate, sortDesc]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- STATS ---
    const stats = useMemo(() => {
        const pending = MOCK_REFUNDS.filter(r => r.status === 'PENDING').length;
        const approved = MOCK_REFUNDS.filter(r => r.status === 'APPROVED').length;
        const restored = MOCK_REFUNDS
            .filter(r => r.status === 'APPROVED')
            .reduce((acc, r) => acc + r.points, 0);
        return { pending, approved, restored };
    }, []);

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                        <i className="ri-shield-check-line text-indigo-600"></i> Refund Center
                    </h1>
                    <p className="text-neutral-500 mt-2 text-sm">
                        Manage your refund requests and dispute history.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.location.reload()} className="border-neutral-300 text-neutral-500">
                        <i className="ri-refresh-line mr-2"></i> Refresh
                    </Button>
                    <Link href="/account/billing/refunds/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                            <i className="ri-add-line mr-2"></i> New Request
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-yellow-100 bg-yellow-50/50 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
                            <i className="ri-time-line"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</p>
                            <p className="text-2xl text-slate-900">{stats.pending}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-green-100 bg-green-50/50 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                            <i className="ri-check-double-line"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
                            <p className="text-2xl text-slate-900">{stats.approved}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                            <i className="ri-refund-2-line"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Points Restored</p>
                            <p className="text-2xl text-slate-900">{stats.restored.toLocaleString()} pts</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- FILTERS --- */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
                <div className="flex bg-neutral-100 p-1 rounded-lg w-full sm:w-auto">
                    {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all",
                                statusFilter === status
                                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 w-full sm:w-36 text-xs"
                    />
                    <span className="text-neutral-300">-</span>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 w-full sm:w-36 text-xs"
                    />
                    <Button variant="outline" size="icon" onClick={() => setSortDesc(!sortDesc)} className="h-9 w-9">
                        <i className={sortDesc ? "ri-sort-desc" : "ri-sort-asc"}></i>
                    </Button>
                    {(startDate || endDate || statusFilter !== 'all') && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} className="h-9 w-9 text-red-500 hover:bg-red-50">
                            <i className="ri-filter-off-line"></i>
                        </Button>
                    )}
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm min-h-[300px] flex flex-col">
                <Table>
                    <TableHeader className="bg-neutral-50">
                        <TableRow className="hover:bg-neutral-50 border-neutral-200">
                            <TableHead className="w-[120px] text-[10px] uppercase font-bold text-neutral-500">ID / Date</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold text-neutral-500">Type</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold text-neutral-500">Reason</TableHead>
                            <TableHead className="text-right text-[10px] uppercase font-bold text-neutral-500">Value</TableHead>
                            <TableHead className="text-center text-[10px] uppercase font-bold text-neutral-500 w-[120px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? paginatedData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-neutral-50 border-neutral-100">
                                <TableCell className="py-4">
                                    <span className="block font-bold text-neutral-900 text-xs">{item.id}</span>
                                    <span className="text-xs text-neutral-500">{item.date}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    {item.type === "DEPOSIT" ? (
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] uppercase">Deposit</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 text-[10px] uppercase">Service</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="py-4">
                                    <p className="font-medium text-sm text-neutral-900">{item.reason}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">Ref: <span>{item.relatedRef}</span></p>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <span className="font-bold text-neutral-900">{item.value}</span>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    {item.status === "APPROVED" && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] uppercase font-bold">Approved</Badge>
                                    )}
                                    {item.status === "PENDING" && (
                                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 text-[10px] uppercase font-bold">Pending</Badge>
                                    )}
                                    {item.status === "REJECTED" && (
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-[10px] uppercase font-bold">Rejected</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-20 text-center text-neutral-400">
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* --- PAGINATION --- */}
                {processedData.length > 0 && (
                    <div className="mt-auto bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-between items-center">
                        <span className="text-xs text-neutral-500">
                            Page <b>{currentPage}</b> of <b>{totalPages}</b>
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                            >
                                <i className="ri-arrow-left-s-line"></i>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                            >
                                <i className="ri-arrow-right-s-line"></i>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}