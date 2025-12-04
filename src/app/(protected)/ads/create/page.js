'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
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

import 'remixicon/fonts/remixicon.css'

import { getAllCategories, getAllStates } from '@/utils/ads/adsHandlers'

const PLATFORM_DOMAINS = {
  Facebook: 'facebook.com',
  Twitter: ['twitter.com', 'x.com'],
  YouTube: ['youtube.com', 'youtu.be'],
  LinkedIn: 'linkedin.com',
  Instagram: 'instagram.com',
  Yelp: 'yelp.com',
  Google: 'google.com',
  TikTok: 'tiktok.com',
}

export default function AdsCreatePage() {
  const [socialLinks, setSocialLinks] = useState([])

  // State cho dữ liệu API
  const [states, setStates] = useState([])
  const [categories, setCategories] = useState([])

  // Fetch dữ liệu khi mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesData, categoriesData] = await Promise.all([
          getAllStates(),
          getAllCategories(),
        ])

        if (Array.isArray(statesData)) setStates(statesData)
        if (Array.isArray(categoriesData)) setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load initial data', error)
      }
    }
    fetchData()
  }, [])

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '', error: null }])
  }

  const validateLink = (platform, url) => {
    if (!url || !platform) return null

    const domains = PLATFORM_DOMAINS[platform]
    const lowerUrl = url.toLowerCase()

    if (Array.isArray(domains)) {
      const isValid = domains.some((domain) => lowerUrl.includes(domain))
      return isValid
        ? null
        : `Link must belong to ${platform} (e.g., ${domains[0]})`
    }

    if (domains && !lowerUrl.includes(domains)) {
      return `Link must contain "${domains}"`
    }

    return null
  }

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks]
    const item = updated[index]

    item[field] = value

    const platformToCheck = field === 'platform' ? value : item.platform
    const urlToCheck = field === 'url' ? value : item.url

    item.error = validateLink(platformToCheck, urlToCheck)

    setSocialLinks(updated)
  }

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="animate-fade-in mx-auto max-w-5xl space-y-6 pt-0 pb-16">
      <form className="space-y-6">
        {/* 1. POST SETTINGS */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Post Settings
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select defaultValue="public">
                <SelectTrigger className="w-full border-gray-300 bg-white">
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
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Author Name
              </Label>
              <Input
                placeholder="Your name"
                defaultValue="John Doe"
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Show Email on Post
              </Label>
              <Select defaultValue="yes">
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Applicant Requirements
              </Label>
              <Textarea
                placeholder="List requirements for applicants (max 500 characters)"
                className="min-h-[100px] resize-y border-gray-300 bg-white"
              />
              <p className="mt-1 text-right text-xs text-gray-400">0/500</p>
            </div>
          </div>
        </div>

        {/* 2. POST DETAILS */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Post Details</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter a descriptive title"
                className="border-gray-300 bg-white"
              />
            </div>

            {/* CATEGORY SELECT */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select>
                {/* Thêm w-full vào đây */}
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.queryValue || cat.name}>
                      <div className="flex items-center gap-2">
                        <span>{cat.name}</span>
                        {cat.engName && (
                          <span className="max-w-[150px] truncate text-xs text-gray-400">
                            ({cat.engName})
                          </span>
                        )}
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
              <Input
                type="email"
                placeholder="your@email.com"
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Price / Salary
              </Label>
              <Input
                placeholder="Enter price or salary range"
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Contact Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="(555) 123-4567"
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Secondary Phone (Optional)
              </Label>
              <Input
                placeholder="(555) 987-6543"
                className="border-gray-300 bg-white"
              />
            </div>

            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Provide detailed information (max 5000 characters)"
                className="min-h-[150px] resize-y border-gray-300 bg-white"
              />
              <p className="mt-1 text-right text-xs text-gray-400">0/5000</p>
            </div>
          </div>
        </div>

        {/* 3. LOCATION */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Location</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                City / Location <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="City, neighborhood"
                className="border-gray-300 bg-white"
              />
            </div>

            {/* STATE SELECT */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </Label>
              <Select>
                {/* Thêm w-full vào đây */}
                <SelectTrigger className="w-full border-gray-300 bg-white">
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
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Related Business
          </h2>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Link to Existing Business (Optional)
            </Label>
            <Select>
              <SelectTrigger className="border-gray-300 bg-white">
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="pho-saigon">
                  Pho Saigon Restaurant
                </SelectItem>
                <SelectItem value="vn-market">VN Grocery Market</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Connect this post to one of your business profiles
            </p>
          </div>
        </div>

        {/* 5. SOCIAL MEDIA CONTACTS */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-row items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Social Media Contacts
            </h2>
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
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-400">
              No social media links added yet
            </div>
          ) : (
            <div className="space-y-4">
              {socialLinks.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-3">
                    <Select
                      value={item.platform}
                      onValueChange={(value) =>
                        updateSocialLink(idx, 'platform', value)
                      }
                    >
                      <SelectTrigger className="mt-0 w-[180px] border-gray-300 bg-white">
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
                        onChange={(e) =>
                          updateSocialLink(idx, 'url', e.target.value)
                        }
                        placeholder={`Paste ${item.platform || 'social'} link here...`}
                        className={`border-gray-300 bg-white ${item.error ? 'border-red-500 focus-visible:ring-red-200' : ''}`}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeSocialLink(idx)}
                      className="h-10 w-10 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </Button>
                  </div>

                  {item.error && (
                    <div className="ml-[192px] flex items-center gap-1 text-xs text-red-500">
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
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Images (Optional)
          </h2>
          <div className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/30 p-10 text-center transition-colors hover:bg-gray-50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-transform group-hover:scale-110">
              <i className="ri-upload-cloud-2-line text-2xl text-gray-400 group-hover:text-blue-600"></i>
            </div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Drag and drop images here, or click to select
            </p>
            <p className="mb-4 text-xs text-gray-500">
              PNG or JPEG only, up to 5MB per image
            </p>
            <Button type="button" variant="outline" className="border-gray-300">
              Choose Images
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
          <Link href="/dashboard">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
          </Link>

          <Button type="button" variant="outline" className="border-gray-300">
            Save as Draft
          </Button>

          <Button
            type="submit"
            className="min-w-[140px] bg-blue-600 text-white hover:bg-blue-700"
          >
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  )
}
