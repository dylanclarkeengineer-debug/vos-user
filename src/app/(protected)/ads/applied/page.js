"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";

import { API_ROUTES } from '@/constants/apiRoute';
import { getListAppliedJobsByUser } from '@/utils/ads/adsHandlers';
import { useAuth } from '@/context/authContext';

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// --- Helpers ---

function formatTimestampToDate(timestamp) {
    if (!timestamp || !timestamp._seconds) return "N/A";
    try {
        const dateObj = new Date(timestamp._seconds * 1000);
        if (isNaN(dateObj.getTime())) return "Invalid Date";
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateObj);
    } catch (e) {
        return "N/A";
    }
}

export default function AppliedJobsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const userId = user?.user_id || null;

    const [query, setQuery] = useState("");
    const [appliedJobsData, setAppliedJobsData] = useState({
        job_applied: [],
        totalApplication: 0,
        currentPage: 1,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch applied jobs
    const fetchAppliedJobs = async (page = 1, pageSize = 10) => {
        if (!userId) {
            setError("Please log in to view your applications.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getListAppliedJobsByUser({
                userId,
                page,
                pageSize,
            });

            setAppliedJobsData(data || {
                job_applied: [],
                totalApplication: 0,
                currentPage: 1,
                totalPages: 0
            });

        } catch (e) {
            console.error("Failed to fetch applied jobs", e);
            setError("Failed to load applications.  Please try again.");
            setAppliedJobsData({
                job_applied: [],
                totalApplication: 0,
                currentPage: 1,
                totalPages: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAppliedJobs();
        }
    }, [userId]);

    const clearFilters = () => {
        setQuery("");
    };

    const displayed = useMemo(() => {
        const jobs = appliedJobsData?.job_applied || [];
        let arr = jobs.slice();
        const q = (query || "").trim().toLowerCase();

        if (q.length > 0) {
            arr = arr.filter((j) =>
                (j?.job_title || "").toLowerCase().includes(q) ||
                (j?.email_recruiter || "").toLowerCase().includes(q) ||
                (j?.job_id || "").toLowerCase().includes(q)
            );
        }

        return arr;
    }, [query, appliedJobsData]);

    const navigateToJobDetail = (jobId) => {
        if (jobId) {
            const jobUrl = API_ROUTES.listingPage(jobId);
            window.open(jobUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const totalApplications = appliedJobsData?.totalApplication || 0;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Simplified Header - Just Stats + Search */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Total Applications Count */}
                        <div className="flex items-center gap-2">
                            <Label variant="normal_text" className="text-gray-600">
                                Total Applications:
                            </Label>
                            <Label variant="secondary" className="text-gray-900">
                                {totalApplications}
                            </Label>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative w-full sm:w-80">
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
                                <Input
                                    mode="edit"
                                    placeholder="Search by title, email, or job ID..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-9 w-full"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <i className="ri-close-line text-base"></i>
                                    </button>
                                )}
                            </div>

                            {query && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    <i className="ri-refresh-line"></i>
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <i className="ri-error-warning-line text-red-600 text-xl mt-0.5"></i>
                            <div className="flex-1">
                                <Label variant="title" className="text-red-900">Error</Label>
                                <Label variant="normal_text" className="text-red-700 mt-1 block">
                                    {error}
                                </Label>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchAppliedJobs()}
                            >
                                <i className="ri-refresh-line"></i>
                                Retry
                            </Button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <i className="ri-loader-4-line animate-spin text-4xl text-indigo-600 mb-4 block"></i>
                        <Label variant="secondary" className="text-gray-600">
                            Loading applications...
                        </Label>
                    </div>
                ) : displayed.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <i className="ri-file-list-3-line text-4xl text-gray-400"></i>
                        </div>
                        <Label variant="secondary" className="text-gray-900 mb-2">
                            No applications found
                        </Label>
                        <Label variant="normal_text" className="text-gray-500 max-w-sm block">
                            {query
                                ? "No applications match your search criteria."
                                : "You haven't applied for any jobs yet.  Start exploring opportunities!"}
                        </Label>
                        {query && (
                            <Button
                                variant="link"
                                onClick={clearFilters}
                                className="mt-4"
                            >
                                Clear search
                            </Button>
                        )}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="w-[45%]">
                                        <Label variant="title">Job Title & ID</Label>
                                    </TableHead>
                                    <TableHead className="w-[25%]">
                                        <Label variant="title">Recruiter Email</Label>
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        <Label variant="title">Application Date</Label>
                                    </TableHead>
                                    <TableHead className="w-[10%] text-right">
                                        <Label variant="title">Action</Label>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayed.map((job) => (
                                    <TableRow
                                        key={job.id}
                                        className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                                        onClick={() => navigateToJobDetail(job.job_id)}
                                    >
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-gray-900 line-clamp-1 text-sm">
                                                    {job.job_title || "Untitled Job"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {job.job_id}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                                <i className="ri-mail-line text-gray-400"></i>
                                                <span className="truncate">
                                                    {job.email_recruiter || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <i className="ri-time-line text-gray-400"></i>
                                                <span className="whitespace-nowrap">
                                                    {formatTimestampToDate(job.created_at)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateToJobDetail(job.job_id);
                                                }}
                                            >
                                                View
                                                <i className="ri-external-link-line"></i>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {appliedJobsData.totalPages > 1 && (
                            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                                <Label variant="normal_text" className="text-gray-500">
                                    Page {appliedJobsData.currentPage} of {appliedJobsData.totalPages}
                                </Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchAppliedJobs(appliedJobsData.currentPage - 1)}
                                        disabled={appliedJobsData.currentPage === 1}
                                    >
                                        <i className="ri-arrow-left-line"></i>
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchAppliedJobs(appliedJobsData.currentPage + 1)}
                                        disabled={appliedJobsData.currentPage === appliedJobsData.totalPages}
                                    >
                                        Next
                                        <i className="ri-arrow-right-line"></i>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}