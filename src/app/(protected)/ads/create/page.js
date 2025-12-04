"use client"

import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import "remixicon/fonts/remixicon.css";
import { getAllStates, getAllCategories } from '@/utils/ads/adsHandlers';

const PLATFORM_DOMAINS = {
    'Facebook': 'facebook.com',
    'Twitter': ['twitter.com', 'x.com'],
    'YouTube': ['youtube.com', 'youtu.be'],
    'LinkedIn': 'linkedin.com',
    'Instagram': 'instagram.com',
    'Yelp': 'yelp.com',
    'Google': 'google.com',
    'TikTok': 'tiktok.com'
};

export default function AdsCreatePage() {
    const [socialLinks, setSocialLinks] = useState([]);

    // State cho dữ liệu API
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);

    // Fetch dữ liệu khi mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statesData, categoriesData] = await Promise.all([
                    getAllStates(),
                    getAllCategories()
                ]);

                if (Array.isArray(statesData)) setStates(statesData);
                if (Array.isArray(categoriesData)) setCategories(categoriesData);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        fetchData();
    }, []);

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '', error: null }]);
    };

    const validateLink = (platform, url) => {
        if (!url || !platform) return null;

        const domains = PLATFORM_DOMAINS[platform];
        const lowerUrl = url.toLowerCase();

        if (Array.isArray(domains)) {
            const isValid = domains.some(domain => lowerUrl.includes(domain));
            return isValid ? null : `Link must belong to ${platform} (e.g., ${domains[0]})`;
        }

        if (domains && !lowerUrl.includes(domains)) {
            return `Link must contain "${domains}"`;
        }

        return null;
    };

    const updateSocialLink = (index, field, value) => {
        const updated = [...socialLinks];
        const item = updated[index];

        item[field] = value;

        const platformToCheck = field === 'platform' ? value : item.platform;
        const urlToCheck = field === 'url' ? value : item.url;

        item.error = validateLink(platformToCheck, urlToCheck);

        setSocialLinks(updated);
    };

    const removeSocialLink = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-5xl mx-auto pb-16 pt-0 space-y-6 animate-fade-in">
            <form className="space-y-6">

                {/* 1. POST SETTINGS */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Post Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select defaultValue="public">
                                <SelectTrigger className="w-full bg-white border-gray-300">
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
                            <Label className="text-sm font-medium text-gray-700">
                                Job Position
                            </Label>
                            <Input
                                placeholder="Enter or select position"
                                className="bg-white border-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Author Name
                            </Label>
                            <Input
                                placeholder="Your name"
                                defaultValue="John Doe"
                                className="bg-white border-gray-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Show Email on Post
                            </Label>
                            <Select defaultValue="yes">
                                <SelectTrigger className="w-full bg-white border-gray-300">
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Applicant Requirements
                            </Label>
                            <Textarea
                                placeholder="List requirements for applicants (max 500 characters)"
                                className="bg-white border-gray-300 min-h-[100px] resize-y"
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">0/500</p>
                        </div>
                    </div>
                </div>

                {/* 2. POST DETAILS */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Post Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input placeholder="Enter a descriptive title" className="bg-white border-gray-300" />
                        </div>

                        {/* CATEGORY SELECT */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select>
                                {/* Thêm w-full vào đây */}
                                <SelectTrigger className="w-full bg-white border-gray-300">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.queryValue || cat.name}>
                                            <div className="flex items-center gap-2">
                                                <span>{cat.name}</span>
                                                {cat.engName && <span className="text-gray-400 text-xs truncate max-w-[150px]">({cat.engName})</span>}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Contact Email <span className="text-red-500">*</span>
                            </Label>
                            <Input type="email" placeholder="your@email.com" className="bg-white border-gray-300" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Price / Salary
                            </Label>
                            <Input placeholder="Enter price or salary range" className="bg-white border-gray-300" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Contact Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input placeholder="(555) 123-4567" className="bg-white border-gray-300" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Secondary Phone (Optional)
                            </Label>
                            <Input placeholder="(555) 987-6543" className="bg-white border-gray-300" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                placeholder="Provide detailed information (max 5000 characters)"
                                className="bg-white border-gray-300 min-h-[150px] resize-y"
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">0/5000</p>
                        </div>
                    </div>
                </div>

                {/* 3. LOCATION */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                City / Location <span className="text-red-500">*</span>
                            </Label>
                            <Input placeholder="City, neighborhood" className="bg-white border-gray-300" />
                        </div>

                        {/* STATE SELECT */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                State <span className="text-red-500">*</span>
                            </Label>
                            <Select>
                                {/* Thêm w-full vào đây */}
                                <SelectTrigger className="w-full bg-white border-gray-300">
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {states.map((st) => (
                                        <SelectItem key={st.id} value={st.abbreviation}>
                                            {st.name} ({st.abbreviation})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* 4. RELATED BUSINESS */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Related Business</h2>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Link to Existing Business (Optional)
                        </Label>
                        <Select>
                            <SelectTrigger className="bg-white border-gray-300">
                                <SelectValue placeholder="Select a business" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="pho-saigon">Pho Saigon Restaurant</SelectItem>
                                <SelectItem value="vn-market">VN Grocery Market</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                            Connect this post to one of your business profiles
                        </p>
                    </div>
                </div>

                {/* 5. SOCIAL MEDIA CONTACTS */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Social Media Contacts</h2>
                        <Button
                            type="button"
                            onClick={addSocialLink}
                            variant="outline"
                            size="sm"
                            className="h-9 border-gray-300 hover:bg-gray-50"
                        >
                            <i className="ri-add-line mr-1"></i> Add Link
                        </Button>
                    </div>

                    {socialLinks.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-md border border-dashed border-gray-200">
                            No social media links added yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {socialLinks.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex gap-3 items-start">
                                        <Select
                                            value={item.platform}
                                            onValueChange={(value) => updateSocialLink(idx, "platform", value)}
                                        >
                                            <SelectTrigger className="w-[180px] bg-white border-gray-300 mt-0">
                                                <SelectValue placeholder="Platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Facebook">Facebook</SelectItem>
                                                <SelectItem value="Instagram">Instagram</SelectItem>
                                                <SelectItem value="Twitter">Twitter/X</SelectItem>
                                                <SelectItem value="YouTube">YouTube</SelectItem>
                                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                                <SelectItem value="Yelp">Yelp</SelectItem>
                                                <SelectItem value="Google">Google</SelectItem>
                                                <SelectItem value="TikTok">TikTok</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="flex-1">
                                            <Input
                                                value={item.url}
                                                onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                                                placeholder={`Paste ${item.platform || 'social'} link here...`}
                                                className={`bg-white border-gray-300 ${item.error ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeSocialLink(idx)}
                                            className="h-10 w-10 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <i className="ri-delete-bin-line text-lg"></i>
                                        </Button>
                                    </div>

                                    {item.error && (
                                        <div className="text-red-500 text-xs flex items-center gap-1 ml-[192px]">
                                            <i className="ri-error-warning-fill"></i>
                                            {item.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 6. IMAGES */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Images (Optional)</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group bg-gray-50/30">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-200 group-hover:scale-110 transition-transform">
                            <i className="ri-upload-cloud-2-line text-2xl text-gray-400 group-hover:text-blue-600"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            Drag and drop images here, or click to select
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            PNG or JPEG only, up to 5MB per image
                        </p>
                        <Button type="button" variant="outline" className="border-gray-300">
                            Choose Images
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/dashboard">
                        <Button type="button" variant="ghost" className="text-gray-600 hover:text-gray-900">
                            Cancel
                        </Button>
                    </Link>

                    <Button type="button" variant="outline" className="border-gray-300">
                        Save as Draft
                    </Button>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                        Publish Post
                    </Button>
                </div>

            </form>
        </div>
    );
}