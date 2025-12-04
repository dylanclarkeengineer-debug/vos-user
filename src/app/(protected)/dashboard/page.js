'use client'

import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/authContext'

export default function HomePage() {
  const { user } = useAuth()
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* --- SECTION 0: WELCOME & STATS (MỚI) --- */}
      <section className="space-y-6">
        {/* 1. Welcome Banner */}
        <div className="relative overflow-hidden rounded-sm bg-neutral-950 p-8 text-white shadow-sm">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                Welcome back, {user?.name || 'Minh'}!
              </h1>
              <p className="text-sm font-medium tracking-wide text-neutral-400">
                Manage your community presence and analytics from your
                dashboard.
              </p>
            </div>
            {/* Decorative Icon */}
            <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-sm md:flex">
              <i className="ri-dashboard-3-line text-xl"></i>
            </div>
          </div>
        </div>

        {/* 2. Stats Cards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1 */}
          <div className="flex items-center justify-between rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-black">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Ads Posted
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">12</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
              <i className="ri-megaphone-line text-lg"></i>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-between rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-black">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Businesses
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">3</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600">
              <i className="ri-building-line text-lg"></i>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-between rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-black">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Articles
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">8</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-purple-50 text-purple-600">
              <i className="ri-file-text-line text-lg"></i>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center justify-between rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-black">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Total Views
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">1,247</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-600">
              <i className="ri-eye-line text-lg"></i>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 1: QUICK ACTIONS (CŨ) --- */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1: Classified Post */}
        <div className="group flex flex-col items-start gap-4 rounded-sm border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-black">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50 transition-colors group-hover:bg-black group-hover:text-white">
            <i className="ri-add-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-bold text-neutral-900">
              New Classified Ad
            </h3>
            <p className="text-xs leading-relaxed text-neutral-500">
              Post a new classified ad or job listing to reach the community.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-auto w-full border-neutral-200 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white"
          >
            Get Started
          </Button>
        </div>

        {/* Card 2: Create Business */}
        <div className="group flex flex-col items-start gap-4 rounded-sm border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-black">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50 transition-colors group-hover:bg-black group-hover:text-white">
            <i className="ri-store-2-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-bold text-neutral-900">
              Register Business
            </h3>
            <p className="text-xs leading-relaxed text-neutral-500">
              List your business in our premium directory for better visibility.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-auto w-full border-neutral-200 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white"
          >
            Get Started
          </Button>
        </div>

        {/* Card 3: Write Article */}
        <div className="group flex flex-col items-start gap-4 rounded-sm border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-black">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50 transition-colors group-hover:bg-black group-hover:text-white">
            <i className="ri-article-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-bold text-neutral-900">
              Write Editorial
            </h3>
            <p className="text-xs leading-relaxed text-neutral-500">
              Share news, insights, and stories with the global audience.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-auto w-full border-neutral-200 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* --- SECTION 2: SPLIT CONTENT (CŨ) --- */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Recommended Jobs */}
        <div className="space-y-4 lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <i className="ri-briefcase-4-line text-lg text-neutral-400"></i>
            <h2 className="text-xl font-bold text-neutral-900">
              Recommended Opportunities
            </h2>
          </div>

          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
            {/* Job Item 1 */}
            <div className="group cursor-pointer border-b border-neutral-100 p-6 transition-colors hover:bg-neutral-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 decoration-1 underline-offset-4 group-hover:underline">
                    Senior Software Engineer
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    TechCorp Vietnam • Ho Chi Minh City
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-none bg-neutral-100 font-normal text-neutral-600 hover:bg-neutral-200"
                    >
                      Full-time
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-none bg-neutral-100 font-normal text-neutral-600 hover:bg-neutral-200"
                    >
                      Remote
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-neutral-900">
                    $2,500 - $4,000
                  </span>
                  <span className="text-[10px] tracking-wide text-neutral-400 uppercase">
                    / Month
                  </span>
                </div>
              </div>
            </div>

            {/* Job Item 2 */}
            <div className="group cursor-pointer border-b border-neutral-100 p-6 transition-colors hover:bg-neutral-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 decoration-1 underline-offset-4 group-hover:underline">
                    Marketing Director
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    VGC Creative Agency • Hanoi
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-none bg-neutral-100 font-normal text-neutral-600 hover:bg-neutral-200"
                    >
                      On-site
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-neutral-900">
                    $1,800 - $2,500
                  </span>
                  <span className="text-[10px] tracking-wide text-neutral-400 uppercase">
                    / Month
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 text-center">
              <Button
                variant="ghost"
                className="text-xs font-bold tracking-widest text-neutral-500 uppercase hover:bg-transparent hover:text-black"
              >
                View All Positions <i className="ri-arrow-right-line ml-2"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Trusted Businesses */}
        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-2">
            <i className="ri-shield-star-line text-lg text-neutral-400"></i>
            <h2 className="text-xl font-bold text-neutral-900">
              Trusted Partners
            </h2>
          </div>

          <div className="rounded-sm border border-neutral-200 bg-white p-1 shadow-sm">
            {/* Business 1 */}
            <div className="flex cursor-pointer items-center gap-4 rounded-sm p-4 transition-colors hover:bg-neutral-50">
              <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                <AvatarImage src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100&h=100" />
                <AvatarFallback className="rounded-sm">PH</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-neutral-900">
                  Pho Saigon Authentic
                </h4>
                <p className="truncate text-xs text-neutral-500">
                  Culinary • 4.8 ★
                </p>
              </div>
              <i className="ri-arrow-right-s-line text-neutral-300"></i>
            </div>

            {/* Business 2 */}
            <div className="flex cursor-pointer items-center gap-4 rounded-sm p-4 transition-colors hover:bg-neutral-50">
              <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                <AvatarImage src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100&h=100" />
                <AvatarFallback className="rounded-sm">MK</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-neutral-900">
                  Fresh Market VN
                </h4>
                <p className="truncate text-xs text-neutral-500">
                  Groceries • 4.7 ★
                </p>
              </div>
              <i className="ri-arrow-right-s-line text-neutral-300"></i>
            </div>

            {/* Business 3 */}
            <div className="flex cursor-pointer items-center gap-4 rounded-sm p-4 transition-colors hover:bg-neutral-50">
              <Avatar className="h-12 w-12 rounded-sm border border-neutral-200">
                <AvatarImage src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=100&h=100" />
                <AvatarFallback className="rounded-sm">CO</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-neutral-900">
                  Elite Coworking
                </h4>
                <p className="truncate text-xs text-neutral-500">
                  Real Estate • 4.9 ★
                </p>
              </div>
              <i className="ri-arrow-right-s-line text-neutral-300"></i>
            </div>

            <div className="mt-2 border-t border-neutral-100">
              <Button className="h-10 w-full rounded-sm bg-black text-xs font-bold tracking-widest text-white uppercase hover:bg-neutral-800">
                Explore Directory
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
