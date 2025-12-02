"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDeletePost({ isOpen, onClose, onConfirm, post }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        // Giả lập delay gọi API
        setTimeout(() => {
            setIsLoading(false);
            onConfirm();
        }, 1000);
    };

    if (!post) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white border border-neutral-200 shadow-2xl p-0 gap-0 overflow-hidden rounded-sm">

                {/* --- ICON HEADER --- */}
                <div className="pt-8 pb-4 flex justify-center">
                    <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                        <i className="ri-alarm-warning-line text-3xl text-red-500"></i>
                    </div>
                </div>

                {/* --- TITLE --- */}
                <DialogHeader className="px-8 pb-2 text-center">
                    <DialogTitle className="font-serif text-2xl font-bold text-neutral-900">
                        Deactivate This Post?
                    </DialogTitle>
                </DialogHeader>

                {/* --- CONTENT BODY --- */}
                <div className="px-8 py-4 space-y-4">

                    {/* Warning Box (Yellow) */}
                    <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-sm p-3 flex items-start gap-3">
                        <i className="ri-error-warning-line text-[#B45309] mt-0.5"></i>
                        <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                            Deactivated posts will no longer appear in search results.
                        </p>
                    </div>

                    {/* Info Box (Blue) */}
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-sm p-3 flex items-start gap-3">
                        <i className="ri-refresh-line text-[#1D4ED8] mt-0.5"></i>
                        <p className="text-xs text-[#1E40AF] font-medium leading-relaxed">
                            You can reactivate it anytime from the management dashboard.
                        </p>
                    </div>

                    {/* Post Details Box */}
                    <div className="border border-neutral-200 rounded-sm p-4 bg-neutral-50/30">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                            Post Details:
                        </h4>
                        <div className="space-y-1">
                            <p className="text-sm text-neutral-900">
                                <span className="font-medium text-neutral-500">Title: </span>
                                <span className="font-bold">{post.title}</span>
                            </p>
                            <p className="text-sm text-neutral-900">
                                <span className="font-medium text-neutral-500">Ad Code: </span>
                                <span className="font-mono text-neutral-600 bg-neutral-100 px-1 rounded">{post.id}</span>
                            </p>
                        </div>
                    </div>

                </div>

                {/* --- FOOTER BUTTONS --- */}
                <DialogFooter className="p-4 bg-neutral-50 border-t border-neutral-100 flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider text-xs h-10 rounded-sm hover:bg-white"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold uppercase tracking-wider text-xs h-10 rounded-sm shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><i className="ri-loader-4-line animate-spin mr-2"></i> Processing...</>
                        ) : (
                            "Deactivate Post"
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}