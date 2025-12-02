"use client";

import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

// Import ShadCN Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const MOCK_TRANSACTIONS = [
    { id: "TRX-9982", type: "DEPOSIT", item: "Deposit: Growth Pack", description: "Top up via Credit Card", amount: 550, payment: "$50.00", status: "SUCCESS", date: "2024-10-24 14:30" },
    { id: "TRX-9981", type: "SPEND", item: "Buy Bundle: Flash Sale", description: "Purchase marketing bundle", amount: -150, payment: "150 pts", status: "SUCCESS", date: "2024-10-23 09:15" },
    { id: "TRX-9980", type: "SPEND", item: "Service: Sticky Post", description: "7 days sticky for Job #8821", amount: -50, payment: "50 pts", status: "SUCCESS", date: "2024-10-22 18:45" },
    { id: "TRX-9979", type: "DEPOSIT", item: "Deposit: Starter", description: "Bank Transfer (Pending)", amount: 100, payment: "$10.00", status: "PENDING", date: "2024-10-22 10:00" },
    { id: "TRX-9978", type: "SPEND", item: "Service: Vetted Badge", description: "Profile verification fee", amount: -100, payment: "100 pts", status: "FAILED", date: "2024-10-21 16:20" },
    { id: "TRX-9977", type: "DEPOSIT", item: "Bonus: Referral", description: "Referral reward from User #123", amount: 50, payment: "System", status: "SUCCESS", date: "2024-10-20 08:00" },
    { id: "TRX-9976", type: "SPEND", item: "News: Full Page Ad", description: "Editorial content promotion", amount: -80, payment: "80 pts", status: "SUCCESS", date: "2024-10-19 11:30" },
    { id: "TRX-9975", type: "DEPOSIT", item: "Deposit: Business", description: "Momo E-Wallet", amount: 1200, payment: "$100.00", status: "SUCCESS", date: "2024-10-18 15:45" },
    { id: "TRX-9974", type: "SPEND", item: "Auto Push x10", description: "Bulk push service", amount: -20, payment: "20 pts", status: "SUCCESS", date: "2024-10-17 09:00" },
    { id: "TRX-9973", type: "SPEND", item: "Classified: Highlight", description: "Border highlight for 3 days", amount: -20, payment: "20 pts", status: "SUCCESS", date: "2024-10-16 14:10" },
    { id: "TRX-9972", type: "REFUND", item: "Refund: Service Error", description: "Refund for failed sticky post", amount: 50, payment: "System", status: "SUCCESS", date: "2024-10-15 10:20" },
];

export default function PointHistoryPage() {

    // --- STATES ---
    const [filterType, setFilterType] = useState("all"); // all | deposit | spend
    const [sortDesc, setSortDesc] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Giảm số lượng để demo phân trang dễ hơn

    // --- LOGIC LỌC & SORT (MÔ PHỎNG) ---
    const processedData = useMemo(() => {
        let arr = [...MOCK_TRANSACTIONS];

        // 1. Filter Type
        if (filterType !== "all") {
            arr = arr.filter(item => {
                if (filterType === "deposit") return item.amount > 0;
                if (filterType === "spend") return item.amount < 0;
                return true;
            });
        }

        // 2. Filter Date (Simple String comparison for demo)
        if (startDate) arr = arr.filter(item => item.date >= startDate);
        if (endDate) arr = arr.filter(item => item.date <= endDate + " 23:59");

        // 3. Sort
        arr.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortDesc ? dateB - dateA : dateA - dateB;
        });

        return arr;
    }, [filterType, startDate, endDate, sortDesc]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- STATS CALCULATION ---
    const stats = useMemo(() => {
        const loaded = MOCK_TRANSACTIONS.filter(i => i.amount > 0 && i.status === "SUCCESS").reduce((acc, curr) => acc + curr.amount, 0);
        const spent = MOCK_TRANSACTIONS.filter(i => i.amount < 0 && i.status === "SUCCESS").reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
        return { loaded, spent };
    }, []);

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setFilterType("all");
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">

            {/* --- HEADER & STATS --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-neutral-900 flex items-center gap-3">
                        Transaction History
                    </h1>
                    <p className="text-neutral-500 mt-2 text-sm">
                        View and track your point usage and deposit history.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Card className="border-green-100 bg-green-50/50 shadow-sm min-w-[160px]">
                        <CardContent className="p-4 flex flex-col items-end">
                            <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                                <i className="ri-arrow-up-line"></i> Total Loaded
                            </span>
                            <span className="text-2xl font-bold text-neutral-900">+{stats.loaded.toLocaleString()}</span>
                        </CardContent>
                    </Card>
                    <Card className="border-red-100 bg-red-50/50 shadow-sm min-w-[160px]">
                        <CardContent className="p-4 flex flex-col items-end">
                            <span className="text-[10px] text-red-700 font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                                <i className="ri-arrow-down-line"></i> Total Spent
                            </span>
                            <span className="text-2xl font-bold text-neutral-900">-{stats.spent.toLocaleString()}</span>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- FILTER TOOLBAR --- */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">

                {/* Tabs */}
                <div className="flex bg-neutral-100 p-1 rounded-lg w-full sm:w-auto">
                    {[
                        { id: 'all', label: "All Types" },
                        { id: 'deposit', label: "Deposit", icon: "ri-arrow-up-line", color: "text-green-600" },
                        { id: 'spend', label: "Spend", icon: "ri-arrow-down-line", color: "text-red-600" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setFilterType(tab.id); setCurrentPage(1); }}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2",
                                filterType === tab.id
                                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
                            )}
                        >
                            {tab.icon && <i className={cn(tab.icon, "text-sm", tab.color)}></i>}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Date & Tools */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">

                    {/* Date Inputs */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="pl-9 h-10 w-full sm:w-40 bg-neutral-50 border-neutral-200 text-xs font-medium"
                            />
                        </div>
                        <span className="text-neutral-300">-</span>
                        <div className="relative w-full sm:w-auto">
                            <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="pl-9 h-10 w-full sm:w-40 bg-neutral-50 border-neutral-200 text-xs font-medium"
                            />
                        </div>
                    </div>

                    {/* Sort Button */}
                    <Button
                        variant="outline"
                        onClick={() => setSortDesc(!sortDesc)}
                        className={cn(
                            "h-10 px-4 gap-2 border-neutral-200 text-neutral-600 hover:text-black hover:border-black transition-colors",
                            sortDesc ? "bg-neutral-50" : "bg-white"
                        )}
                        title="Toggle Sort Order"
                    >
                        <i className={cn(sortDesc ? "ri-sort-desc" : "ri-sort-asc", "text-lg")}></i>
                    </Button>

                    {/* Clear Button */}
                    {(startDate || endDate || filterType !== 'all') && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="h-10 px-3 text-neutral-500 hover:text-red-600 hover:bg-red-50"
                            title="Clear Filters"
                        >
                            <i className="ri-filter-off-line text-lg"></i>
                        </Button>
                    )}
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm min-h-[400px] flex flex-col">
                <Table>
                    <TableHeader className="bg-neutral-50">
                        <TableRow className="hover:bg-neutral-50 border-neutral-200">
                            <TableHead className="w-[250px] text-[10px] uppercase tracking-widest font-bold text-neutral-500">Transaction Info</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Description</TableHead>
                            <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold text-neutral-500">Amount</TableHead>
                            <TableHead className="text-center text-[10px] uppercase tracking-widest font-bold text-neutral-500 w-[120px]">Status</TableHead>
                            <TableHead className="text-center text-[10px] uppercase tracking-widest font-bold text-neutral-500 w-[80px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? paginatedData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-neutral-50 group border-neutral-100">
                                <TableCell className="align-top py-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center text-lg border shadow-sm shrink-0",
                                            item.amount > 0
                                                ? "bg-green-50 text-green-600 border-green-100"
                                                : "bg-red-50 text-red-500 border-red-100"
                                        )}>
                                            <i className={item.amount > 0 ? "ri-arrow-right-up-line" : "ri-arrow-right-down-line"}></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900 text-sm">{item.item}</p>
                                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                                <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">{item.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><i className="ri-time-line"></i> {item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                    <p className="text-neutral-700 text-sm font-medium">{item.description}</p>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        Payment: <span className="font-mono text-neutral-500">{item.payment}</span>
                                    </p>
                                </TableCell>
                                <TableCell className="align-top py-4 text-right">
                                    <span className={cn(
                                        "font-bold text-base flex items-center justify-end gap-1",
                                        item.status === "FAILED"
                                            ? "text-neutral-400 line-through"
                                            : item.amount > 0
                                                ? "text-green-600"
                                                : "text-neutral-900"
                                    )}>
                                        {item.amount > 0 ? "+" : ""}
                                        {item.amount.toLocaleString()}
                                        <i className="ri-copper-coin-fill text-yellow-500 text-sm"></i>
                                    </span>
                                </TableCell>
                                <TableCell className="align-top py-4 text-center">
                                    {item.status === "SUCCESS" && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase font-bold rounded-sm shadow-none">Success</Badge>
                                    )}
                                    {item.status === "FAILED" && (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] uppercase font-bold rounded-sm shadow-none">Failed</Badge>
                                    )}
                                    {item.status === "PENDING" && (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] uppercase font-bold rounded-sm shadow-none">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="align-top py-4 text-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100">
                                        <i className="ri-download-2-line"></i>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-20 text-center h-64">
                                    <div className="flex flex-col items-center justify-center text-neutral-400">
                                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                                            <i className="ri-inbox-2-line text-3xl opacity-50"></i>
                                        </div>
                                        <p className="text-base font-bold text-neutral-600">No transactions found</p>
                                        <p className="text-xs mt-1 max-w-xs mx-auto">Try adjusting your filters or date range to see more results.</p>
                                        <Button variant="link" onClick={clearFilters} className="mt-2 text-indigo-600 h-auto p-0 text-xs font-bold uppercase tracking-wider">
                                            Clear Filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* --- PAGINATION --- */}
                {processedData.length > 0 && (
                    <div className="mt-auto bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs font-medium text-neutral-500">
                            Showing <span className="font-bold text-neutral-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-neutral-900">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of <span className="font-bold text-neutral-900">{processedData.length}</span> entries
                        </span>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 border-neutral-300 hover:bg-white disabled:opacity-50"
                            >
                                <i className="ri-arrow-left-s-line"></i>
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pNum = i + 1;
                                    // Logic hiển thị trang đơn giản để demo
                                    if (totalPages > 5 && currentPage > 3) {
                                        pNum = currentPage - 2 + i;
                                        if (pNum > totalPages) pNum = totalPages - (4 - i);
                                    }

                                    return (
                                        <button
                                            key={pNum}
                                            onClick={() => setCurrentPage(pNum)}
                                            className={cn(
                                                "w-8 h-8 rounded-md text-xs font-bold transition-all border",
                                                currentPage === pNum
                                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                                            )}
                                        >
                                            {pNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 border-neutral-300 hover:bg-white disabled:opacity-50"
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