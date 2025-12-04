"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/authContext';

export default function HomePage() {
    const { user } = useAuth();
    return (
        <div className="space-y-8 animate-fade-in pb-10">

            {/* --- SECTION 0: WELCOME & STATS (MỚI) --- */}
            <section className="space-y-6">

                {/* 1. Welcome Banner */}
                <div className="relative bg-neutral-950 rounded-sm p-8 text-white overflow-hidden shadow-sm">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h1 className=" font-bold text-3xl mb-2 tracking-tight">Welcome back, {user?.name || 'Minh'}!</h1>
                            <p className="text-neutral-400 text-sm font-medium tracking-wide">
                                Manage your community presence and analytics from your dashboard.
                            </p>
                        </div>
                        {/* Decorative Icon */}
                        <div className="hidden md:flex h-12 w-12 bg-white/10 rounded-full items-center justify-center backdrop-blur-sm border border-white/10">
                            <i className="ri-dashboard-3-line text-xl"></i>
                        </div>
                    </div>
                </div>

                {/* 2. Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Stat 1 */}
                    <div className="bg-white p-5 rounded-sm border border-neutral-200 flex items-center justify-between hover:border-black transition-colors shadow-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Ads Posted</p>
                            <h3 className="text-2xl  font-bold text-neutral-900">12</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <i className="ri-megaphone-line text-lg"></i>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white p-5 rounded-sm border border-neutral-200 flex items-center justify-between hover:border-black transition-colors shadow-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Businesses</p>
                            <h3 className="text-2xl  font-bold text-neutral-900">3</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                            <i className="ri-building-line text-lg"></i>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white p-5 rounded-sm border border-neutral-200 flex items-center justify-between hover:border-black transition-colors shadow-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Articles</p>
                            <h3 className="text-2xl  font-bold text-neutral-900">8</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                            <i className="ri-file-text-line text-lg"></i>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-white p-5 rounded-sm border border-neutral-200 flex items-center justify-between hover:border-black transition-colors shadow-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Total Views</p>
                            <h3 className="text-2xl  font-bold text-neutral-900">1,247</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                            <i className="ri-eye-line text-lg"></i>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- SECTION 1: QUICK ACTIONS (CŨ) --- */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Classified Post */}
                <div className="bg-white p-6 rounded-sm border border-neutral-200 flex flex-col items-start gap-4 hover:border-black transition-colors group shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <i className="ri-add-line text-xl"></i>
                    </div>
                    <div>
                        <h3 className=" font-bold text-lg text-neutral-900 mb-1">New Classified Ad</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Post a new classified ad or job listing to reach the community.
                        </p>
                    </div>
                    <Button variant="outline" className="mt-auto w-full border-neutral-200 hover:bg-black hover:text-white text-xs uppercase tracking-widest font-bold">
                        Get Started
                    </Button>
                </div>

                {/* Card 2: Create Business */}
                <div className="bg-white p-6 rounded-sm border border-neutral-200 flex flex-col items-start gap-4 hover:border-black transition-colors group shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <i className="ri-store-2-line text-xl"></i>
                    </div>
                    <div>
                        <h3 className=" font-bold text-lg text-neutral-900 mb-1">Register Business</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            List your business in our premium directory for better visibility.
                        </p>
                    </div>
                    <Button variant="outline" className="mt-auto w-full border-neutral-200 hover:bg-black hover:text-white text-xs uppercase tracking-widest font-bold">
                        Get Started
                    </Button>
                </div>

                {/* Card 3: Write Article */}
                <div className="bg-white p-6 rounded-sm border border-neutral-200 flex flex-col items-start gap-4 hover:border-black transition-colors group shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <i className="ri-article-line text-xl"></i>
                    </div>
                    <div>
                        <h3 className=" font-bold text-lg text-neutral-900 mb-1">Write Editorial</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Share news, insights, and stories with the global audience.
                        </p>
                    </div>
                    <Button variant="outline" className="mt-auto w-full border-neutral-200 hover:bg-black hover:text-white text-xs uppercase tracking-widest font-bold">
                        Get Started
                    </Button>
                </div>
            </section>


            {/* --- SECTION 2: SPLIT CONTENT (CŨ) --- */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Recommended Jobs */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="ri-briefcase-4-line text-lg text-neutral-400"></i>
                        <h2 className=" font-bold text-xl text-neutral-900">Recommended Opportunities</h2>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm">
                        {/* Job Item 1 */}
                        <div className="p-6 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-neutral-900 group-hover:underline decoration-1 underline-offset-4">Senior Software Engineer</h3>
                                    <p className="text-xs text-neutral-500 mt-1">TechCorp Vietnam • Ho Chi Minh City</p>
                                    <div className="mt-3 flex gap-2">
                                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-none font-normal">Full-time</Badge>
                                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-none font-normal">Remote</Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block  font-bold text-neutral-900">$2,500 - $4,000</span>
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide">/ Month</span>
                                </div>
                            </div>
                        </div>

                        {/* Job Item 2 */}
                        <div className="p-6 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-neutral-900 group-hover:underline decoration-1 underline-offset-4">Marketing Director</h3>
                                    <p className="text-xs text-neutral-500 mt-1">VGC Creative Agency • Hanoi</p>
                                    <div className="mt-3 flex gap-2">
                                        <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-none font-normal">On-site</Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block  font-bold text-neutral-900">$1,800 - $2,500</span>
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide">/ Month</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-50 text-center">
                            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black hover:bg-transparent">
                                View All Positions <i className="ri-arrow-right-line ml-2"></i>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Trusted Businesses */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="ri-shield-star-line text-lg text-neutral-400"></i>
                        <h2 className=" font-bold text-xl text-neutral-900">Trusted Partners</h2>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-sm p-1 shadow-sm">
                        {/* Business 1 */}
                        <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors rounded-sm cursor-pointer">
                            <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                                <AvatarImage src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-sm">PH</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-neutral-900 truncate">Pho Saigon Authentic</h4>
                                <p className="text-xs text-neutral-500 truncate">Culinary • 4.8 ★</p>
                            </div>
                            <i className="ri-arrow-right-s-line text-neutral-300"></i>
                        </div>

                        {/* Business 2 */}
                        <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors rounded-sm cursor-pointer">
                            <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                                <AvatarImage src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-sm">MK</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-neutral-900 truncate">Fresh Market VN</h4>
                                <p className="text-xs text-neutral-500 truncate">Groceries • 4.7 ★</p>
                            </div>
                            <i className="ri-arrow-right-s-line text-neutral-300"></i>
                        </div>

                        {/* Business 3 */}
                        <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors rounded-sm cursor-pointer">
                            <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                                <AvatarImage src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=100&h=100" />
                                <AvatarFallback className="rounded-sm">CO</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-neutral-900 truncate">Elite Coworking</h4>
                                <p className="text-xs text-neutral-500 truncate">Real Estate • 4.9 ★</p>
                            </div>
                            <i className="ri-arrow-right-s-line text-neutral-300"></i>
                        </div>

                        <div className="mt-2 border-t border-neutral-100">
                            <Button className="w-full bg-black text-white hover:bg-neutral-800 rounded-sm text-xs uppercase tracking-widest font-bold h-10">
                                Explore Directory
                            </Button>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}