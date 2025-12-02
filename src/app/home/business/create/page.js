"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function BusinessCreatePage() {

    return (
        // Đã loại bỏ class font-sans vì root layout đã quản lý
        <div className="max-w-5xl mx-auto pb-24 pt-2 space-y-10 animate-fade-in">

            {/* --- HEADER --- */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Create New Business</h1>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                    <Link href="/home" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
                    <i className="ri-arrow-right-s-line"></i>
                    <Link href="/business" className="hover:text-neutral-900 transition-colors">Business</Link>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className="text-neutral-900">Add Business</span>
                </div>
            </div>

            {/* --- MONOCHROME BANNER (VALUE PROPOSITION) --- */}
            {/* Chuyển từ màu xanh sang màu đen (neutral-900) */}
            <div className="bg-neutral-900 rounded-sm p-8 text-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0"><i className="ri-eye-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider">Increase Visibility</h3>
                        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">Reach thousands of potential customers in your area instantly.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0"><i className="ri-shield-star-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider">Build Trust</h3>
                        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">Collect reviews and showcase your reputation to the community.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0"><i className="ri-briefcase-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider">Post Job Listings</h3>
                        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">Connect with qualified candidates easily through your profile.</p>
                    </div>
                </div>
            </div>

            {/* --- FORM CONTAINER --- */}
            <form className="space-y-12">

                {/* 1. BASIC INFORMATION */}
                {/* Layout thay đổi: Loại bỏ Grid chia cột và Card để trải rộng full-width */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-neutral-900">Basic Information</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            Enter the core details of your business. This information will be prominent on your profile.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 bg-white p-0">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Business Name <span className="text-red-500">*</span></Label>
                            <Input placeholder="e.g. VGC Coffee Roasters" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Category <span className="text-red-500">*</span></Label>
                            <Select>
                                <SelectTrigger className="bg-white border-neutral-200 h-12 rounded-sm focus:ring-1 focus:ring-neutral-900">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-neutral-200">
                                    <SelectItem value="restaurant">Restaurant & Cafe</SelectItem>
                                    <SelectItem value="retail">Retail & Shopping</SelectItem>
                                    <SelectItem value="service">Professional Services</SelectItem>
                                    <SelectItem value="tech">Technology</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                placeholder="Tell us about your business, mission, and what you offer..."
                                className="bg-white border-neutral-200 min-h-[120px] rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900 resize-y p-4"
                            />
                        </div>
                    </div>
                </div>

                <Separator className="bg-neutral-100" />

                {/* 2. LOCATION */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-neutral-900">Business Location</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            Where can customers find you? Accurate location helps with local search results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-0">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Street Address <span className="text-red-500">*</span></Label>
                            <Input placeholder="123 Main Street" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">City <span className="text-red-500">*</span></Label>
                            <Input placeholder="San Jose" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">State</Label>
                                <Input placeholder="CA" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Zip Code</Label>
                                <Input placeholder="95111" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Landmark (Optional)</Label>
                            <Input placeholder="e.g. Near City Hall, Next to Walmart" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>
                    </div>
                </div>

                <Separator className="bg-neutral-100" />

                {/* 3. BUSINESS HOURS */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-neutral-900">Business Hours</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            Set your operating hours. You can mark days as closed.
                        </p>
                    </div>

                    <div className="space-y-6 bg-white p-0">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Operating Status</Label>
                            <Select defaultValue="open">
                                <SelectTrigger className="bg-white border-neutral-200 h-12 rounded-sm focus:ring-1 focus:ring-neutral-900">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-neutral-200">
                                    <SelectItem value="open">Open during specific hours</SelectItem>
                                    <SelectItem value="always">Always Open (24/7)</SelectItem>
                                    <SelectItem value="temp_closed">Temporarily Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-2">
                            {DAYS_OF_WEEK.map((day) => (
                                <div key={day} className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-neutral-100 last:border-0">
                                    <div className="w-32 text-sm font-bold text-neutral-900 uppercase tracking-wide">{day}</div>
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id={`closed-${day}`} className="rounded-sm border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900" />
                                            <label htmlFor={`closed-${day}`} className="text-sm text-neutral-600 font-medium cursor-pointer select-none">Closed</label>
                                        </div>
                                        <div className="flex items-center gap-3 flex-1 justify-end">
                                            <Input type="time" defaultValue="09:00" className="w-full md:w-36 h-10 text-sm bg-white border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                                            <span className="text-sm text-neutral-400 font-medium">to</span>
                                            <Input type="time" defaultValue="18:00" className="w-full md:w-36 h-10 text-sm bg-white border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="bg-neutral-100" />

                {/* 4. CONTACT & WEB */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-neutral-900">Contact Information</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            How can customers reach you? Add your digital presence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-0">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Phone Number <span className="text-red-500">*</span></Label>
                            <Input placeholder="+1 (555) 000-0000" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Address <span className="text-red-500">*</span></Label>
                            <Input type="email" placeholder="contact@business.com" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Website</Label>
                            <Input placeholder="https://www.example.com" className="bg-white border-neutral-200 h-12 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Custom URL Slug</Label>
                            <div className="flex">
                                <div className="flex items-center px-4 bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-sm text-sm text-neutral-600 font-medium whitespace-nowrap">
                                    vgc-community.com/business/
                                </div>
                                <Input placeholder="your-business-name" className="bg-white border-neutral-200 h-12 rounded-l-none rounded-r-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium mt-1">You can edit this 2 more times.</p>
                        </div>
                    </div>
                </div>

                <Separator className="bg-neutral-100" />

                {/* 5. PHOTOS */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-neutral-900">Photos</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
                            Visuals are key. Add a high-quality cover image and gallery photos.
                        </p>
                    </div>

                    <div className="space-y-8 bg-white p-0">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Cover Image <span className="text-red-500">*</span></Label>
                            <div className="border-2 border-dashed border-neutral-300 rounded-sm p-12 flex flex-col items-center justify-center text-center hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer group bg-white min-h-[240px]">
                                <div className="w-14 h-14 bg-neutral-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm border border-neutral-100 group-hover:border-neutral-200">
                                    <i className="ri-image-add-line text-2xl text-neutral-400 group-hover:text-neutral-900 transition-colors"></i>
                                </div>
                                <p className="text-base font-bold text-neutral-900 mb-1">Click to upload cover image</p>
                                <p className="text-xs text-neutral-500">1200x600px recommended. Max 5MB.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Gallery Photos (Max 10)</Label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="aspect-square border-2 border-dashed border-neutral-300 rounded-sm flex flex-col items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer group bg-white">
                                    <i className="ri-add-line text-2xl text-neutral-300 group-hover:text-neutral-900 transition-colors"></i>
                                    <span className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-wide group-hover:text-neutral-900 transition-colors">Add Photo</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium">0/10 photos uploaded</p>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
                    <Button type="button" variant="ghost" className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-bold text-xs uppercase tracking-widest h-11 px-6 rounded-sm">
                        Cancel
                    </Button>
                    {/* Nút submit chuyển sang màu đen (neutral-900) */}
                    <Button type="submit" className="bg-neutral-900 hover:bg-black text-white font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-sm shadow-sm">
                        Create Business
                    </Button>
                </div>

            </form>
        </div>
    );
}