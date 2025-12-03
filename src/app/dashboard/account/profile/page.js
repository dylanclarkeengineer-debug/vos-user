"use client"

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AccountProfilePage() {
    // --- MOCKUP STATE ---
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "John Doe",
        email: "john.doe@vgc-agency.com",
        phone: "+1 (555) 123-4567",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Toggle Edit Mode
    const toggleEdit = () => {
        if (isEditing) {
            // Giả lập Save
            console.log("Saving data:", formData);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10 pt-4">
            {/* --- SECTION 1: PERSONAL INFORMATION --- */}
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">

                {/* Header của Section */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
                    <h2 className=" font-bold text-lg text-neutral-900">Personal Information</h2>
                    <Button
                        onClick={toggleEdit}
                        variant={isEditing ? "default" : "outline"}
                        className={`text-xs font-bold uppercase tracking-widest h-9 ${isEditing ? 'bg-black text-white' : 'border-neutral-300'}`}
                    >
                        {isEditing ? (
                            <><i className="ri-save-line mr-2"></i> Save Changes</>
                        ) : (
                            <><i className="ri-edit-line mr-2"></i> Edit Profile</>
                        )}
                    </Button>
                </div>

                <div className="p-8 space-y-8">

                    {/* 1. Avatar Section */}
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24 border-2 border-neutral-100">
                            {/* Lấy ảnh giống Sidebar */}
                            <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                            <AvatarFallback className="text-2xl ">JD</AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 pt-1">
                            <h3 className="font-bold text-neutral-900">Profile Picture</h3>
                            <div className="text-xs text-neutral-500 space-y-1">
                                <p>This will be displayed on your profile.</p>
                                <p>Max file size: 1MB. Formats: JPG, PNG.</p>
                            </div>

                            {/* Nút Upload chỉ hiện khi Edit */}
                            {isEditing && (
                                <div className="pt-2">
                                    <Button variant="outline" size="sm" className="text-xs h-8 border-neutral-300">
                                        <i className="ri-upload-2-line mr-2"></i> Upload New
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Form Fields */}
                    <div className="grid gap-6">

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Full Name
                            </label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="h-12 bg-neutral-50 border-neutral-200 focus:ring-black focus:border-black transition-all"
                            />
                        </div>

                        {/* Email (Luôn Disabled - Read only) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="h-12 bg-neutral-100 border-neutral-200 text-neutral-500 pl-10 cursor-not-allowed"
                                />
                                <i className="ri-lock-line absolute left-3.5 top-3.5 text-neutral-400"></i>
                            </div>
                            <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                                <i className="ri-information-line"></i> Email cannot be changed for security reasons.
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="h-12 bg-neutral-50 border-neutral-200 focus:ring-black focus:border-black transition-all pr-24"
                                />
                                {/* Verified Badge nằm trong Input */}
                                <div className="absolute right-3 top-3">
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 gap-1 rounded-sm px-2">
                                        <i className="ri-checkbox-circle-fill"></i> Verified
                                    </Badge>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- SECTION 2: ACCOUNT INFORMATION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Member Since */}
                <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                        Member Since
                    </span>
                    <div className="flex items-end justify-between">
                        <span className=" font-bold text-xl text-neutral-900">January 2024</span>
                        <i className="ri-calendar-line text-neutral-300 text-2xl"></i>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white p-6 border border-neutral-200 rounded-sm shadow-sm flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                        Account Status
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className=" font-bold text-xl text-neutral-900">Active</span>
                    </div>
                </div>

            </div>
        </div>
    );
}