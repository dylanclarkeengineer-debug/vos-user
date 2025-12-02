"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Dữ liệu các gói quảng cáo theo ảnh mẫu
const PROMOTION_OPTIONS = [
    {
        id: "feature_top",
        title: "Feature at Top",
        description: "Pin your ad at the top of its category for 7 days",
        price: 50,
        icon: "ri-vip-crown-2-line", // Hoặc ri-arrow-up-double-line
        theme: "blue", // Dùng để map màu
    },
    {
        id: "highlight_post",
        title: "Highlight Post",
        description: "Add a colored frame to make your ad stand out",
        price: 30,
        icon: "ri-palette-line",
        theme: "purple",
    },
    {
        id: "notify_subscribers",
        title: "Notify Subscribers",
        description: "Send notifications to relevant job seekers in your category",
        price: 40,
        icon: "ri-notification-3-line",
        theme: "green",
    },
    {
        id: "cross_platform",
        title: "Cross-Platform Promotion",
        description: "Share your ad across partner platforms for maximum reach",
        price: 60,
        icon: "ri-share-forward-line", // Hoặc ri-share-circle-line
        theme: "orange",
    },
];

// Helper để lấy class màu sắc động
const getThemeClasses = (theme) => {
    const themes = {
        blue: {
            bg: "bg-blue-50",
            text: "text-blue-600",
            borderChecked: "peer-checked:border-blue-500",
            bgChecked: "peer-checked:bg-blue-50/30",
        },
        purple: {
            bg: "bg-purple-50",
            text: "text-purple-600",
            borderChecked: "peer-checked:border-purple-500",
            bgChecked: "peer-checked:bg-purple-50/30",
        },
        green: {
            bg: "bg-green-50",
            text: "text-green-600",
            borderChecked: "peer-checked:border-green-500",
            bgChecked: "peer-checked:bg-green-50/30",
        },
        orange: {
            bg: "bg-orange-50",
            text: "text-orange-600",
            borderChecked: "peer-checked:border-orange-500",
            bgChecked: "peer-checked:bg-orange-50/30",
        },
    };
    return themes[theme] || themes.blue;
};

export default function PromoteAdModal({ isOpen, onClose, onConfirm }) {
    const [selectedOption, setSelectedOption] = useState(null);

    // Xử lý khi nhấn nút Buy Credits (hoặc Confirm)
    const handleConfirm = () => {
        if (selectedOption) {
            // Logic xử lý (ví dụ: gọi API, chuyển hướng)
            console.log("Selected Promotion:", selectedOption);
            if (onConfirm) onConfirm(selectedOption);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-100">

                {/* --- HEADER --- */}
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="font-serif text-xl font-bold text-neutral-900">
                            Promote Your Ad
                        </DialogTitle>
                        {/* Nút X đóng dialog đã có sẵn trong ShadCN DialogContent, nhưng nếu muốn custom thì thêm ở đây */}
                    </div>
                    <DialogDescription className="text-neutral-500 text-sm mt-1">
                        Boost your ad's visibility with these promotion options:
                    </DialogDescription>
                </DialogHeader>

                {/* --- BODY: OPTIONS LIST --- */}
                <div className="px-6 py-2 space-y-3 max-h-[60vh] overflow-y-auto">
                    {PROMOTION_OPTIONS.map((option) => {
                        const themeStyle = getThemeClasses(option.theme);
                        return (
                            <label
                                key={option.id}
                                className="relative block cursor-pointer group"
                            >
                                {/* Hidden Radio Input */}
                                <input
                                    type="radio"
                                    name="promotion_option"
                                    value={option.id}
                                    className="peer sr-only"
                                    onChange={() => setSelectedOption(option.id)}
                                    checked={selectedOption === option.id}
                                />

                                {/* Card UI */}
                                <div
                                    className={`
                    flex items-start gap-4 p-4 rounded-lg border border-neutral-200 transition-all duration-200
                    hover:border-neutral-300 hover:shadow-sm
                    ${themeStyle.borderChecked} ${themeStyle.bgChecked}
                    peer-checked:ring-1 peer-checked:ring-offset-0 peer-checked:ring-[inherit]
                  `}
                                >
                                    {/* Icon Box */}
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${themeStyle.bg} ${themeStyle.text}`}>
                                        <i className={`${option.icon} text-xl`}></i>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-neutral-900 mb-0.5">
                                            {option.title}
                                        </h4>
                                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                                            {option.description}
                                        </p>
                                        <p className={`text-xs font-bold mt-2 ${themeStyle.text}`}>
                                            {option.price} Credits
                                        </p>
                                    </div>

                                    {/* Check Circle (Optional - Visual indicator) */}
                                    <div className={`
                    w-5 h-5 rounded-full border border-neutral-200 flex items-center justify-center
                    peer-checked:border-transparent peer-checked:bg-current ${themeStyle.text}
                  `}>
                                        <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>

                {/* --- FOOTER --- */}
                <div className="mt-6">
                    <Separator />
                    <div className="p-6 flex items-center justify-between gap-4">

                        {/* Balance Info */}
                        <div className="text-sm">
                            <span className="text-neutral-500 mr-1">Current Balance:</span>
                            <span className="font-bold text-neutral-900">120 Credits</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="h-10 px-4 text-neutral-600 border-neutral-200 font-bold text-xs uppercase tracking-wide hover:bg-neutral-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!selectedOption}
                                className={`
                  h-10 px-6 text-white font-bold text-xs uppercase tracking-wide shadow-md transition-all
                  ${selectedOption ? "bg-blue-600 hover:bg-blue-700" : "bg-neutral-300 cursor-not-allowed"}
                `}
                            >
                                Buy Credits
                            </Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}