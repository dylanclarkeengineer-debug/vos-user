'use client'

import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Import CSS RemixIcon
import 'remixicon/fonts/remixicon.css'

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export default function BusinessCreatePage() {
  return (
    <div className="animate-fade-in mx-auto max-w-5xl space-y-10 px-4 pt-6 pb-20 sm:px-6 lg:px-8">
      {/* --- VALUE PROP BANNER (Monochrome) --- */}
      <div className="grid grid-cols-1 gap-6 rounded-sm bg-neutral-900 p-6 text-white shadow-sm md:grid-cols-3 md:gap-8 md:p-8">
        <div className="group flex items-start gap-4">
          <div className="shrink-0 rounded-sm bg-neutral-800 p-3 transition-colors group-hover:bg-white group-hover:text-black">
            <i className="ri-eye-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold tracking-wider uppercase">
              Increase Visibility
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 transition-colors group-hover:text-neutral-200">
              Put your business on the map and reach thousands of local
              customers instantly.
            </p>
          </div>
        </div>
        <div className="group flex items-start gap-4">
          <div className="shrink-0 rounded-sm bg-neutral-800 p-3 transition-colors group-hover:bg-white group-hover:text-black">
            <i className="ri-shield-star-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold tracking-wider uppercase">
              Build Credibility
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 transition-colors group-hover:text-neutral-200">
              Showcase verified reviews, ratings, and achievements to build
              trust.
            </p>
          </div>
        </div>
        <div className="group flex items-start gap-4">
          <div className="shrink-0 rounded-sm bg-neutral-800 p-3 transition-colors group-hover:bg-white group-hover:text-black">
            <i className="ri-briefcase-line text-xl"></i>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-bold tracking-wider uppercase">
              Hire Talent
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400 transition-colors group-hover:text-neutral-200">
              Post job listings directly linked to your business profile to
              attract talent.
            </p>
          </div>
        </div>
      </div>

      {/* --- FORM CONTAINER --- */}
      <form className="space-y-8">
        {/* 1. BASIC INFORMATION */}
        <Card className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
              1. Basic Information
            </h3>
          </div>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. VGC Coffee Roasters"
                  className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="h-11 rounded-sm border-neutral-200 bg-white focus:ring-1 focus:ring-neutral-900">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm border-neutral-200">
                    <SelectItem value="restaurant">
                      Restaurant & Cafe
                    </SelectItem>
                    <SelectItem value="retail">Retail & Shopping</SelectItem>
                    <SelectItem value="service">
                      Professional Services
                    </SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Tell us about your business, mission, and what you offer..."
                className="min-h-[120px] resize-y rounded-sm border-neutral-200 bg-white p-4 text-sm focus-visible:ring-1 focus-visible:ring-neutral-900"
              />
              <p className="text-right text-[10px] text-neutral-400">
                0/1000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. LOCATION */}
        <Card className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
              2. Location
            </h3>
          </div>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="123 Main Street"
                className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="San Jose"
                  className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  State
                </Label>
                <Input
                  placeholder="CA"
                  className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  Zip Code
                </Label>
                <Input
                  placeholder="95111"
                  className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Landmark (Optional)
              </Label>
              <Input
                placeholder="e.g. Near City Hall, Next to Walmart"
                className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. BUSINESS HOURS */}
        <Card className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
              3. Business Hours
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="same-every-day"
                className="rounded-sm border-neutral-300 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900"
              />
              <label
                htmlFor="same-every-day"
                className="cursor-pointer text-xs font-medium text-neutral-500 select-none"
              >
                Same hours every day
              </label>
            </div>
          </div>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Operating Status
              </Label>
              <Select defaultValue="open">
                <SelectTrigger className="h-11 rounded-sm border-neutral-200 bg-white focus:ring-1 focus:ring-neutral-900">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-neutral-200">
                  <SelectItem value="open">
                    Open during specific hours
                  </SelectItem>
                  <SelectItem value="always">Always Open (24/7)</SelectItem>
                  <SelectItem value="temp_closed">
                    Temporarily Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex flex-col gap-3 rounded-sm border-b border-neutral-50 p-2 pb-3 transition-colors last:border-0 hover:bg-neutral-50 sm:flex-row sm:items-center"
                >
                  <div className="w-28 text-sm font-bold text-neutral-900">
                    {day}
                  </div>
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex min-w-[80px] items-center space-x-2">
                      <Checkbox
                        id={`closed-${day}`}
                        className="rounded-sm border-neutral-300 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900"
                      />
                      <label
                        htmlFor={`closed-${day}`}
                        className="cursor-pointer text-xs font-medium text-neutral-500 select-none"
                      >
                        Closed
                      </label>
                    </div>
                    <div className="flex flex-1 items-center gap-2 sm:justify-end">
                      <Input
                        type="time"
                        defaultValue="09:00"
                        className="h-9 w-full rounded-sm border-neutral-200 bg-white text-xs focus-visible:ring-1 focus-visible:ring-neutral-900 sm:w-32"
                      />
                      <span className="px-1 text-xs font-medium text-neutral-400">
                        to
                      </span>
                      <Input
                        type="time"
                        defaultValue="18:00"
                        className="h-9 w-full rounded-sm border-neutral-200 bg-white text-xs focus-visible:ring-1 focus-visible:ring-neutral-900 sm:w-32"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4. CONTACT & WEB */}
        <Card className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
              4. Contact & Online Presence
            </h3>
          </div>
          <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="+1 (555) 000-0000"
                className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="contact@business.com"
                className="h-11 rounded-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
              />
            </div>

            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Website
              </Label>
              <div className="relative">
                <i className="ri-global-line absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"></i>
                <Input
                  placeholder="https://www.example.com"
                  className="h-11 rounded-sm border-neutral-200 bg-white pl-10 focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>
            </div>

            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Custom URL Slug
              </Label>
              <div className="flex">
                <div className="flex items-center rounded-l-sm border border-r-0 border-neutral-200 bg-neutral-100 px-4 text-sm font-medium whitespace-nowrap text-neutral-600 select-none">
                  vgc-community.com/business/
                </div>
                <Input
                  placeholder="your-business-name"
                  className="h-11 rounded-l-none rounded-r-sm border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-neutral-900"
                />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-neutral-400">
                <i className="ri-information-line"></i> You can change this URL
                2 more times.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5. PHOTOS */}
        <Card className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest text-neutral-900 uppercase">
              5. Photos
            </h3>
          </div>
          <CardContent className="space-y-8 p-6 md:p-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Cover Image <span className="text-red-500">*</span>
              </Label>
              <div className="group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm border-2 border-dashed border-neutral-300 bg-white p-12 text-center transition-all hover:border-neutral-400 hover:bg-neutral-50">
                <div className="pointer-events-none absolute inset-0 bg-neutral-900/0 transition-colors group-hover:bg-neutral-900/2"></div>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 shadow-sm transition-transform group-hover:scale-110 group-hover:border-neutral-300">
                  <i className="ri-image-add-line text-3xl text-neutral-400 transition-colors group-hover:text-neutral-900"></i>
                </div>
                <p className="mb-1 text-base font-bold text-neutral-900">
                  Click to upload cover image
                </p>
                <p className="text-xs text-neutral-500">
                  1200x600px recommended. Max 5MB. PNG/JPG.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Gallery Photos
              </Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                <div className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-white transition-all hover:border-neutral-400 hover:bg-neutral-50">
                  <i className="ri-add-line text-2xl text-neutral-300 transition-colors group-hover:text-neutral-900"></i>
                  <span className="mt-2 text-[10px] font-bold tracking-wide text-neutral-400 uppercase transition-colors group-hover:text-neutral-900">
                    Add
                  </span>
                </div>
                {/* Mockup: Placeholder for uploaded photos */}
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-300">
                      IMG_{i}.jpg
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        className="text-white transition-colors hover:text-red-400"
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-medium tracking-wide text-neutral-400 uppercase">
                2/10 photos uploaded
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- FOOTER ACTIONS (STATIC / NOT FIXED) --- */}
        {/* Sửa lại: Dùng border-t và margin-top để gắn liền với nội dung cuối, không dùng fixed */}
        <div className="mt-8 flex flex-col items-center justify-end gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-full rounded-sm px-6 text-xs font-bold tracking-widest text-neutral-500 uppercase hover:bg-neutral-50 hover:text-neutral-900 sm:w-auto"
          >
            Clear Form
          </Button>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-sm border-neutral-300 bg-white px-6 text-xs font-bold tracking-widest uppercase hover:bg-neutral-50 sm:flex-none"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              className="h-11 flex-1 rounded-sm bg-neutral-900 px-8 text-xs font-bold tracking-widest text-white uppercase shadow-md hover:bg-black sm:flex-none"
            >
              Create Business
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
