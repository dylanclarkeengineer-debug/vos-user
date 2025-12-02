"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Import CSS RemixIcon
import "remixicon/fonts/remixicon.css";

export default function AdsCreatePage() {

    // --- STATE MOCKUP ---
    const [socialLinks, setSocialLinks] = useState([]);

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '' }]);
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 pt-2 space-y-8 animate-fade-in">

            {/* --- HEADER & BREADCRUMB --- */}
            <div className="space-y-1">
                <h1 className=" font-bold text-3xl text-neutral-900">Create New Classified Post</h1>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                    <Link href="/home" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
                    <i className="ri-arrow-right-s-line"></i>
                    <Link href="/ads" className="hover:text-neutral-900 transition-colors">Ads</Link>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className="text-neutral-900">Create New Post</span>
                </div>
            </div>

            {/* --- FORM CONTAINER --- */}
            {/* Lưu ý: Không set h-screen ở đây để tránh scroll lồng scroll */}
            <form className="space-y-8">

                {/* 1. POST SETTINGS */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Post Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Status <span className="text-red-500">*</span></Label>
                            <Select defaultValue="public">
                                <SelectTrigger className="bg-white border-neutral-200 h-11 focus:ring-black">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Job Position</Label>
                            <Input placeholder="Enter or select position" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Author Name</Label>
                            <Input placeholder="Your Name" defaultValue="John Doe" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Show Email on Post</Label>
                            <Select defaultValue="yes">
                                <SelectTrigger className="bg-white border-neutral-200 h-11 focus:ring-black">
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Applicant Requirements</Label>
                            <Textarea
                                placeholder="List requirements for applicants (max 500 characters)"
                                className="bg-white border-neutral-200 min-h-[100px] focus-visible:ring-black resize-y"
                            />
                            <p className="text-[10px] text-neutral-400 text-right">0/500</p>
                        </div>

                    </CardContent>
                </Card>

                {/* 2. POST DETAILS */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Post Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Title <span className="text-red-500">*</span></Label>
                            <Input placeholder="Enter a descriptive title" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Category <span className="text-red-500">*</span></Label>
                            <Select>
                                <SelectTrigger className="bg-white border-neutral-200 h-11 focus:ring-black">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="jobs">Jobs</SelectItem>
                                    <SelectItem value="real-estate">Real Estate</SelectItem>
                                    <SelectItem value="services">Services</SelectItem>
                                    <SelectItem value="items">For Sale</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Contact Email <span className="text-red-500">*</span></Label>
                            <Input type="email" placeholder="your@email.com" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Price / Salary</Label>
                            <Input placeholder="Enter price or salary range" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Contact Phone <span className="text-red-500">*</span></Label>
                            <Input placeholder="(555) 123-4567" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2 md:col-start-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Secondary Phone (Optional)</Label>
                            <Input placeholder="(555) 987-6543" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                placeholder="Provide detailed information about your post (max 5000 characters)"
                                className="bg-white border-neutral-200 min-h-[150px] focus-visible:ring-black resize-y"
                            />
                            <p className="text-[10px] text-neutral-400 text-right">0/5000</p>
                        </div>

                    </CardContent>
                </Card>

                {/* 3. LOCATION */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Location</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">City / Location <span className="text-red-500">*</span></Label>
                            <Input placeholder="City, neighborhood" className="bg-white border-neutral-200 h-11 focus-visible:ring-black" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">State <span className="text-red-500">*</span></Label>
                            <Select>
                                <SelectTrigger className="bg-white border-neutral-200 h-11 focus:ring-black">
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ca">California</SelectItem>
                                    <SelectItem value="ny">New York</SelectItem>
                                    <SelectItem value="tx">Texas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>
                </Card>

                {/* 4. RELATED BUSINESS */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Related Business</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Link to Existing Business (Optional)</Label>
                            <Select>
                                <SelectTrigger className="bg-white border-neutral-200 h-11 focus:ring-black">
                                    <SelectValue placeholder="Select a business" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="pho-saigon">Pho Saigon Restaurant</SelectItem>
                                    <SelectItem value="vn-market">VN Grocery Market</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-neutral-400">Connect this post to one of your business profiles</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. SOCIAL MEDIA CONTACTS */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4 flex flex-row items-center justify-between">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Social Media Contacts</CardTitle>
                        <Button type="button" onClick={addSocialLink} variant="outline" size="sm" className="text-xs font-bold uppercase tracking-widest h-8 border-neutral-300">
                            <i className="ri-add-line mr-1"></i> Add Link
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        {socialLinks.length === 0 ? (
                            <div className="text-center py-4 text-neutral-400 text-sm italic">
                                No social media links added yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {socialLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input placeholder="Platform (e.g. Facebook)" className="w-1/3 h-10 text-sm bg-white border-neutral-200" />
                                        <Input placeholder="URL" className="w-2/3 h-10 text-sm bg-white border-neutral-200" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 6. IMAGES */}
                <Card className="border-neutral-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-neutral-100 pb-4">
                        <CardTitle className=" text-lg font-bold text-neutral-900">Images (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors cursor-pointer group bg-neutral-50/50">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm border border-neutral-100">
                                <i className="ri-upload-cloud-2-line text-2xl text-neutral-400 group-hover:text-black"></i>
                            </div>
                            <p className="text-sm font-medium text-neutral-600 mb-1">
                                Drag and drop images here, or click to select
                            </p>
                            <p className="text-xs text-neutral-400 mb-4">
                                PNG or JPEG only, maximum 5MB per image
                            </p>
                            <Button type="button" variant="outline" className="border-neutral-300 font-bold uppercase tracking-widest text-xs h-9 bg-white">
                                Choose Images
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* --- FOOTER ACTIONS --- */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200">
                    <Link href="/home">
                        <Button type="button" variant="ghost" className="text-neutral-500 hover:text-neutral-900 font-bold text-sm">
                            Cancel
                        </Button>
                    </Link>

                    <Button type="button" variant="outline" className="border-neutral-300 font-bold text-sm h-11 px-6">
                        Save as Draft
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs h-11 px-8 shadow-md shadow-blue-100">
                        Publish Post
                    </Button>
                </div>

            </form>
        </div>
    );
}