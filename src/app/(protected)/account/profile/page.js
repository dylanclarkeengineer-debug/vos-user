'use client'

import React, { useState } from 'react'
import Link from 'next/link' // Import Link

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function AccountProfilePage() {
  // --- MOCKUP STATE ---
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: 'John Doe',
    email: 'john.doe@vgc-agency.com',
    phone: '+1 (555) 123-4567',
  })

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Toggle Edit Mode
  const toggleEdit = () => {
    if (isEditing) {
      // Giả lập Save
      console.log('Saving data:', formData)
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="animate-fade-in mx-auto max-w-4xl space-y-8 pt-4 pb-10">
      {/* --- SECTION 1: PERSONAL INFORMATION --- */}
      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
        {/* Header của Section */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 p-6">
          <h2 className="text-lg font-bold text-neutral-900">
            Personal Information
          </h2>
          <Button
            onClick={toggleEdit}
            variant={isEditing ? 'default' : 'outline'}
            className={`h-9 text-xs font-bold tracking-widest uppercase ${isEditing ? 'bg-black text-white' : 'border-neutral-300'}`}
          >
            {isEditing ? (
              <>
                <i className="ri-save-line mr-2"></i> Save Changes
              </>
            ) : (
              <>
                <i className="ri-edit-line mr-2"></i> Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="space-y-8 p-8">
          {/* 1. Avatar Section */}
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-neutral-100">
              {/* Lấy ảnh giống Sidebar */}
              <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>

            <div className="space-y-2 pt-1">
              <h3 className="font-bold text-neutral-900">Profile Picture</h3>
              <div className="space-y-1 text-xs text-neutral-500">
                <p>This will be displayed on your profile.</p>
                <p>Max file size: 1MB. Formats: JPG, PNG.</p>
              </div>

              {/* Nút Upload chỉ hiện khi Edit */}
              {isEditing && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-neutral-300 text-xs"
                  >
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
              <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Full Name
              </label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className="h-12 border-neutral-200 bg-neutral-50 transition-all focus:border-black focus:ring-black"
              />
            </div>

            {/* Email (Luôn Disabled - Read only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Input
                  name="email"
                  value={formData.email}
                  disabled
                  className="h-12 cursor-not-allowed border-neutral-200 bg-neutral-100 pl-10 text-neutral-500"
                />
                <i className="ri-lock-line absolute top-3.5 left-3.5 text-neutral-400"></i>
              </div>
              <p className="flex items-center gap-1 text-[10px] text-neutral-400">
                <i className="ri-information-line"></i> Email cannot be changed
                for security reasons.
              </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="group relative">
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-12 border-neutral-200 bg-neutral-50 pr-24 transition-all focus:border-black focus:ring-black"
                />
                {/* Verified Badge nằm trong Input */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-sm border border-green-200 bg-green-100 px-2 text-green-700 hover:bg-green-100"
                  >
                    <i className="ri-checkbox-circle-fill"></i> Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ACCOUNT INFORMATION --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Member Since */}
        <div className="flex flex-col justify-between rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
          <span className="mb-2 text-xs font-bold tracking-widest text-neutral-500 uppercase">
            Member Since
          </span>
          <div className="flex items-end justify-between">
            <span className="text-xl font-bold text-neutral-900">
              January 2024
            </span>
            <i className="ri-calendar-line text-2xl text-neutral-300"></i>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex flex-col justify-between rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
          <span className="mb-2 text-xs font-bold tracking-widest text-neutral-500 uppercase">
            Account Status
          </span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <span className="text-xl font-bold text-neutral-900">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
