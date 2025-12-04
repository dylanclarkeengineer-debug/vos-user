'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import ConfirmDeletePost from '@/components/ads/ConfirmDeactivePost'
// Import Modals
import PromoteAdModal from '@/components/ads/PromoteAdModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// --- IMPORT SHADCN TOOLTIP ---
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Import CSS RemixIcon
import 'remixicon/fonts/remixicon.css'

// --- MOCK DATA ---
const MOCK_BUSINESSES = [
  {
    id: 'b7k9m2',
    name: 'Golden Nail Spa',
    desc: 'Premium nail care services with experienced technicians',
    status: 'Active',
    category: 'Nail Salon / Tiệm Nail',
    location: '123 Main St, San Jose, CA 95112',
    reviews: 48,
    rating: 4.8,
    logo: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=100&h=100',
    initials: 'GN',
  },
  {
    id: 'c2s4f5',
    name: 'Pho Vietnam Restaurant',
    desc: 'Authentic Vietnamese cuisine in the heart of the city',
    status: 'Active',
    category: 'Restaurant/Nhà Hàng Việt',
    location: '456 Oak Ave, San Francisco, CA 94102',
    reviews: 127,
    rating: 4.5,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100&h=100',
    initials: 'PV',
  },
  {
    id: 'a3x8n1',
    name: 'VN Insurance Group',
    desc: 'Comprehensive insurance solutions for Vietnamese community',
    status: 'Draft',
    category: 'Insurance/ Bảo hiểm Việt',
    location: '789 Pine Rd, Los Angeles, CA 90001',
    reviews: 0,
    rating: 0,
    logo: '',
    initials: 'VI',
  },
]

export default function BusinessListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  // Modal States
  const [isPromoteOpen, setIsPromoteOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBiz, setSelectedBiz] = useState(null)

  // --- ACTIONS HANDLERS ---
  const handleEdit = (id) => {
    router.push(`/business/create?edit=${id}`)
  }

  const handleDuplicate = (id) => {
    router.push(`/business/create?copy=${id}`)
  }

  const handlePromote = (biz) => {
    setSelectedBiz(biz)
    setIsPromoteOpen(true)
  }

  const handleDeactivate = (biz) => {
    setSelectedBiz(biz)
    setIsDeleteOpen(true)
  }

  // Confirm Handlers
  const onPromoteConfirm = (option) => {
    setIsPromoteOpen(false)
    const query = new URLSearchParams({
      type: 'promotion',
      packageId: option.id,
      refId: selectedBiz?.id,
    }).toString()
    router.push(`/account/billing/payment?${query}`)
  }

  const onDeleteConfirm = () => {
    console.log(`Deactivating business: ${selectedBiz?.id}`)
    setIsDeleteOpen(false)
  }

  // Helper render status
  const renderStatus = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex rounded-sm border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-green-700 uppercase">
            Active
          </span>
        )
      case 'Draft':
        return (
          <span className="inline-flex rounded-sm border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
            Draft
          </span>
        )
      default:
        return (
          <span className="inline-flex rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
            {status}
          </span>
        )
    }
  }

  // Style chung cho Tooltip Content (giống ảnh mẫu: nền đen, chữ trắng, in hoa)
  const tooltipStyle =
    'bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm border-none'

  return (
    <div className="animate-fade-in mx-auto max-w-[1400px] px-4 pt-6 pb-32 font-sans">
      {/* --- STATS OVERVIEW --- */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* ... (Stats cards remain unchanged) ... */}
        <Card className="rounded-sm border border-neutral-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Total Businesses
              </p>
              <h3 className="text-3xl font-bold text-neutral-900">3</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-50 text-xl text-blue-600">
              <i className="ri-store-2-line"></i>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-sm border border-neutral-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Active Listings
              </p>
              <h3 className="text-3xl font-bold text-green-600">2</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-green-50 text-xl text-green-600">
              <i className="ri-checkbox-circle-line"></i>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-sm border border-neutral-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Total Reviews
              </p>
              <h3 className="text-3xl font-bold text-yellow-600">175</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-yellow-50 text-xl text-yellow-600">
              <i className="ri-star-smile-line"></i>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- BUSINESS LIST TABLE --- */}
      <div className="min-h-[400px] overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
        {/* Bọc TableBody bằng TooltipProvider */}
        <TooltipProvider delayDuration={100}>
          <Table>
            <TableHeader className="border-b border-neutral-200 bg-neutral-50">
              <TableRow>
                <TableHead className="w-[45%] py-4 pl-6 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Business
                </TableHead>
                <TableHead className="w-[10%] py-4 text-center text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Actions
                </TableHead>
                <TableHead className="w-[30%] py-4 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Details
                </TableHead>
                <TableHead className="w-[15%] py-4 pr-6 text-right text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Engagement
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_BUSINESSES.map((biz) => (
                <TableRow
                  key={biz.id}
                  className="group border-b border-neutral-100 hover:bg-neutral-50/30"
                >
                  {/* 1. BUSINESS INFO */}
                  <TableCell className="py-6 pl-6 align-top">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 shrink-0 rounded-sm border border-neutral-200">
                        <AvatarImage src={biz.logo} className="object-cover" />
                        <AvatarFallback className="rounded-sm bg-neutral-900 text-xs font-bold text-white">
                          {biz.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                        <p className="font-mono text-[10px] text-neutral-400">
                          #{biz.id}
                        </p>
                        <h3 className="cursor-pointer text-base leading-tight font-bold text-neutral-900 transition-colors group-hover:text-blue-600">
                          {biz.name}
                        </h3>
                        {renderStatus(biz.status)}
                        <p className="mt-1 line-clamp-2 max-w-sm text-xs leading-relaxed text-neutral-500">
                          {biz.desc}
                        </p>
                        <div className="pt-1">
                          <Button
                            variant="link"
                            className="h-auto p-0 text-[10px] font-bold tracking-wider text-blue-600 uppercase hover:text-blue-800"
                          >
                            <i className="ri-eye-line mr-1"></i> View Business
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. ACTIONS (Vertical Icons with Tooltips) */}
                  <TableCell className="py-6 text-center align-top">
                    <div className="flex flex-col items-center gap-3">
                      {/* EDIT */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleEdit(biz.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                          >
                            <i className="ri-pencil-fill text-sm"></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={tooltipStyle}>
                          Edit
                        </TooltipContent>
                      </Tooltip>

                      {/* PROMOTE */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handlePromote(biz)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 shadow-sm transition-all hover:bg-purple-600 hover:text-white"
                          >
                            <i className="ri-megaphone-fill text-sm"></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={tooltipStyle}>
                          Promote
                        </TooltipContent>
                      </Tooltip>

                      {/* DUPLICATE */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleDuplicate(biz.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-sm transition-all hover:bg-green-600 hover:text-white"
                          >
                            <i className="ri-file-copy-fill text-sm"></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={tooltipStyle}>
                          Duplicate
                        </TooltipContent>
                      </Tooltip>

                      {/* DEACTIVATE */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleDeactivate(biz)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white"
                          >
                            <i className="ri-close-circle-fill text-sm"></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={tooltipStyle}>
                          Deactivate
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>

                  {/* 3. DETAILS */}
                  <TableCell className="py-6 align-top">
                    <div className="space-y-3 text-xs text-neutral-600">
                      <div className="flex items-start gap-2">
                        <i className="ri-price-tag-3-line mt-0.5 text-neutral-400"></i>
                        <span className="font-medium">{biz.category}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="ri-map-pin-line mt-0.5 text-neutral-400"></i>
                        <span className="leading-relaxed">{biz.location}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 4. ENGAGEMENT */}
                  <TableCell className="py-6 pr-6 text-right align-top">
                    <div className="mb-1 flex items-center justify-end gap-1.5">
                      <i className="ri-star-fill text-sm text-yellow-400"></i>
                      <span className="text-sm font-bold text-neutral-900">
                        Reviews: {biz.reviews}
                      </span>
                    </div>
                    {biz.rating > 0 ? (
                      <div className="flex justify-end">
                        <Badge
                          variant="secondary"
                          className="rounded-sm border-yellow-200 bg-yellow-50 text-[10px] font-bold text-yellow-700"
                        >
                          {biz.rating} / 5.0
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">
                        No ratings yet
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

      {/* --- MODALS --- */}
      {selectedBiz && (
        <>
          <PromoteAdModal
            isOpen={isPromoteOpen}
            onClose={() => setIsPromoteOpen(false)}
            onConfirm={onPromoteConfirm}
          />
          <ConfirmDeletePost
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={onDeleteConfirm}
            post={selectedBiz}
          />
        </>
      )}
    </div>
  )
}
