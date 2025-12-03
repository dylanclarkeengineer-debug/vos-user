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
import { Card, CardContent } from "@/components/ui/card";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function BusinessCreatePage() {

    return (
        <div className="max-w-5xl mx-auto pb-20 pt-6 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        <Link href="/home" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
                        <i className="ri-arrow-right-s-line"></i>
                        <Link href="/business" className="hover:text-neutral-900 transition-colors">Business</Link>
                        <i className="ri-arrow-right-s-line"></i>
                        <span className="text-neutral-900 border-b border-neutral-900">Create</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">Create Business Profile</h1>
                    <p className="text-sm text-neutral-500 max-w-2xl">Establish your digital presence. Reach more customers by creating a detailed business profile.</p>
                </div>
            </div>

            {/* --- VALUE PROP BANNER (Monochrome) --- */}
            <div className="bg-neutral-900 rounded-sm p-6 md:p-8 text-white shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0 group-hover:bg-white group-hover:text-black transition-colors"><i className="ri-eye-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Increase Visibility</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-200 transition-colors">Put your business on the map and reach thousands of local customers instantly.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0 group-hover:bg-white group-hover:text-black transition-colors"><i className="ri-shield-star-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Build Credibility</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-200 transition-colors">Showcase verified reviews, ratings, and achievements to build trust.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start group">
                    <div className="p-3 bg-neutral-800 rounded-sm shrink-0 group-hover:bg-white group-hover:text-black transition-colors"><i className="ri-briefcase-line text-xl"></i></div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Hire Talent</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-200 transition-colors">Post job listings directly linked to your business profile to attract talent.</p>
                    </div>
                </div>
            </div>

            {/* --- FORM CONTAINER --- */}
            <form className="space-y-8">

                {/* 1. BASIC INFORMATION */}
                <Card className="border border-neutral-200 shadow-sm bg-white rounded-sm overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">1. Basic Information</h3>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Business Name <span className="text-red-500">*</span></Label>
                                <Input placeholder="e.g. VGC Coffee Roasters" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Category <span className="text-red-500">*</span></Label>
                                <Select>
                                    <SelectTrigger className="bg-white border-neutral-200 h-11 rounded-sm focus:ring-1 focus:ring-neutral-900">
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                placeholder="Tell us about your business, mission, and what you offer..."
                                className="bg-white border-neutral-200 min-h-[120px] rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900 resize-y p-4 text-sm"
                            />
                            <p className="text-[10px] text-neutral-400 text-right">0/1000 characters</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. LOCATION */}
                <Card className="border border-neutral-200 shadow-sm bg-white rounded-sm overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">2. Location</h3>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Street Address <span className="text-red-500">*</span></Label>
                            <Input placeholder="123 Main Street" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">City <span className="text-red-500">*</span></Label>
                                <Input placeholder="San Jose" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">State</Label>
                                <Input placeholder="CA" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Zip Code</Label>
                                <Input placeholder="95111" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Landmark (Optional)</Label>
                            <Input placeholder="e.g. Near City Hall, Next to Walmart" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>
                    </CardContent>
                </Card>

                {/* 3. BUSINESS HOURS */}
                <Card className="border border-neutral-200 shadow-sm bg-white rounded-sm overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">3. Business Hours</h3>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="same-every-day" className="rounded-sm border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900" />
                            <label htmlFor="same-every-day" className="text-xs text-neutral-500 font-medium cursor-pointer select-none">Same hours every day</label>
                        </div>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Operating Status</Label>
                            <Select defaultValue="open">
                                <SelectTrigger className="bg-white border-neutral-200 h-11 rounded-sm focus:ring-1 focus:ring-neutral-900">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm border-neutral-200">
                                    <SelectItem value="open">Open during specific hours</SelectItem>
                                    <SelectItem value="always">Always Open (24/7)</SelectItem>
                                    <SelectItem value="temp_closed">Temporarily Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 pt-2">
                            {DAYS_OF_WEEK.map((day) => (
                                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 pb-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 p-2 rounded-sm transition-colors">
                                    <div className="w-28 text-sm font-bold text-neutral-900">{day}</div>
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex items-center space-x-2 min-w-[80px]">
                                            <Checkbox id={`closed-${day}`} className="rounded-sm border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900" />
                                            <label htmlFor={`closed-${day}`} className="text-xs text-neutral-500 font-medium cursor-pointer select-none">Closed</label>
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 sm:justify-end">
                                            <Input type="time" defaultValue="09:00" className="w-full sm:w-32 h-9 text-xs bg-white border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                                            <span className="text-xs text-neutral-400 font-medium px-1">to</span>
                                            <Input type="time" defaultValue="18:00" className="w-full sm:w-32 h-9 text-xs bg-white border-neutral-200 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. CONTACT & WEB */}
                <Card className="border border-neutral-200 shadow-sm bg-white rounded-sm overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">4. Contact & Online Presence</h3>
                    </div>
                    <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Phone Number <span className="text-red-500">*</span></Label>
                            <Input placeholder="+1 (555) 000-0000" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Address <span className="text-red-500">*</span></Label>
                            <Input type="email" placeholder="contact@business.com" className="bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Website</Label>
                            <div className="relative">
                                <i className="ri-global-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                                <Input placeholder="https://www.example.com" className="pl-10 bg-white border-neutral-200 h-11 rounded-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Custom URL Slug</Label>
                            <div className="flex">
                                <div className="flex items-center px-4 bg-neutral-100 border border-r-0 border-neutral-200 rounded-l-sm text-sm text-neutral-600 font-medium whitespace-nowrap select-none">
                                    vgc-community.com/business/
                                </div>
                                <Input placeholder="your-business-name" className="bg-white border-neutral-200 h-11 rounded-l-none rounded-r-sm focus-visible:ring-1 focus-visible:ring-neutral-900" />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1"><i className="ri-information-line"></i> You can change this URL 2 more times.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. PHOTOS */}
                <Card className="border border-neutral-200 shadow-sm bg-white rounded-sm overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">5. Photos</h3>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Cover Image <span className="text-red-500">*</span></Label>
                            <div className="border-2 border-dashed border-neutral-300 rounded-sm p-12 flex flex-col items-center justify-center text-center hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer group bg-white min-h-[240px] relative overflow-hidden">
                                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/2 transition-colors pointer-events-none"></div>
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm border border-neutral-200 group-hover:border-neutral-300">
                                    <i className="ri-image-add-line text-3xl text-neutral-400 group-hover:text-neutral-900 transition-colors"></i>
                                </div>
                                <p className="text-base font-bold text-neutral-900 mb-1">Click to upload cover image</p>
                                <p className="text-xs text-neutral-500">1200x600px recommended. Max 5MB. PNG/JPG.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Gallery Photos</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                <div className="aspect-square border-2 border-dashed border-neutral-300 rounded-sm flex flex-col items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer group bg-white">
                                    <i className="ri-add-line text-2xl text-neutral-300 group-hover:text-neutral-900 transition-colors"></i>
                                    <span className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-wide group-hover:text-neutral-900 transition-colors">Add</span>
                                </div>
                                {/* Mockup: Placeholder for uploaded photos */}
                                {[1, 2].map((i) => (
                                    <div key={i} className="aspect-square bg-neutral-100 rounded-sm relative group overflow-hidden border border-neutral-200">
                                        <div className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xs">IMG_{i}.jpg</div>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" className="text-white hover:text-red-400 transition-colors">
                                                <i className="ri-delete-bin-line text-xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-medium">2/10 photos uploaded</p>
                        </div>
                    </CardContent>
                </Card>

                {/* --- FOOTER ACTIONS (STATIC / NOT FIXED) --- */}
                {/* Sửa lại: Dùng border-t và margin-top để gắn liền với nội dung cuối, không dùng fixed */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-neutral-200 mt-8">
                    <Button type="button" variant="ghost" className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-bold text-xs uppercase tracking-widest h-11 px-6 rounded-sm w-full sm:w-auto">
                        Clear Form
                    </Button>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button type="button" variant="outline" className="flex-1 sm:flex-none border-neutral-300 font-bold text-xs h-11 px-6 uppercase tracking-widest rounded-sm bg-white hover:bg-neutral-50">
                            Save Draft
                        </Button>
                        <Button type="submit" className="flex-1 sm:flex-none bg-neutral-900 hover:bg-black text-white font-bold uppercase tracking-widest text-xs h-11 px-8 rounded-sm shadow-md">
                            Create Business
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}