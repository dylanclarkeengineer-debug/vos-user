'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import ConfirmDeletePost from '@/components/ads/ConfirmDeactivePost'
import PromoteAdModal from '@/components/ads/PromoteAdModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TooltipProvider,
} from '@/components/ui/tooltip'

import 'remixicon/fonts/remixicon.css'

// Import Handler và Context
import { getBusinessesByUser } from '@/utils/business/businessHandlers' // Đảm bảo đường dẫn đúng file bạn upload
import { useAuth } from '@/context/authContext'
import { useBusinessContext } from '@/context/businessContext' // <-- import context
import { API_ROUTES } from '@/constants/apiRoute'
import { ActionIcon } from '@/components/ui/action-icon'

export default function BusinessListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.user_id || null

  // Business context
  const { setEditBusiness, setCopyBusiness } = useBusinessContext()

  // --- STATE ---
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal States
  const [isPromoteOpen, setIsPromoteOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBiz, setSelectedBiz] = useState(null)

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        // Gọi hàm getBusinessesByUser từ file handler
        const response = await getBusinessesByUser(userId)

        if (response && response.success) {
          setBusinesses(response.businesses || [])
        } else {
          setBusinesses([])
        }
      } catch (error) {
        console.error('Failed to load businesses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // --- HELPER: Tính toán Stats ---
  const stats = useMemo(() => {
    const total = businesses.length
    const active = businesses.filter(b => b.business_status?.toLowerCase() === 'active').length
    // API hiện tại chưa trả về reviews, tạm thời để 0 hoặc giả lập
    const reviews = 0
    return { total, active, reviews }
  }, [businesses])

  // --- HELPER: Lấy chữ cái đầu cho Avatar ---
  const getInitials = (name) => {
    if (!name) return 'B'
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // --- ACTIONS HANDLERS ---
  const handleEdit = (id) => {
    // find business object
    const biz = businesses.find(b => String(b.id) === String(id))
    if (biz) {
      setEditBusiness(biz) // lưu vào context
    }
    router.push(`/business/create?edit=${id}`)
  }

  const handleDuplicate = (id) => {
    const biz = businesses.find(b => String(b.id) === String(id))
    if (biz) {
      setCopyBusiness(biz) // lưu vào context
    }
    router.push(`/business/create?copy=${id}`)
  }

  const handleViewBusiness = (slug) => {
    router.push(API_ROUTES.businessPage(slug))
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
    // Cần thêm logic gọi API update status ở đây nếu muốn chức năng hoạt động thật
  }

  // Helper render status (Map theo giá trị API trả về: "active", "draft", v.v.)
  const renderStatus = (status) => {
    const normalizedStatus = status ? status.toLowerCase() : 'unknown'

    switch (normalizedStatus) {
      case 'active':
        return (
          <span className="inline-flex rounded-sm border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-green-700 uppercase">
            Active
          </span>
        )
      case 'draft':
      case 'pending':
        return (
          <span className="inline-flex rounded-sm border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
            {status || 'Draft'}
          </span>
        )
      default:
        return (
          <span className="inline-flex rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
            {status || 'Unknown'}
          </span>
        )
    }
  }

  const tooltipStyle =
    'bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm border-none'

  // Filter theo search term
  const filteredBusinesses = businesses.filter(biz =>
    biz.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade-in mx-auto max-w-[1400px] px-4 pt-6 pb-32 font-sans">

      {/* --- STATS OVERVIEW --- */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-sm border border-neutral-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Total Businesses
              </p>
              <h3 className="text-3xl font-bold text-neutral-900">{stats.total}</h3>
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
              <h3 className="text-3xl font-bold text-green-600">{stats.active}</h3>
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
              <h3 className="text-3xl font-bold text-yellow-600">{stats.reviews}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-yellow-50 text-xl text-yellow-600">
              <i className="ri-star-smile-line"></i>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search businesses..."
          className="md:max-w-xs bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- BUSINESS LIST TABLE --- */}
      <div className="min-h-[400px] overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-2 text-neutral-500">
                      <i className="ri-loader-4-line animate-spin text-2xl"></i>
                      <span className="text-xs font-medium">Loading businesses...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBusinesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-neutral-500 text-sm">
                    No businesses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBusinesses.map((biz) => (
                  <TableRow
                    key={biz.id}
                    className="group border-b border-neutral-100 hover:bg-neutral-50/30"
                  >
                    {/* 1. BUSINESS INFO */}
                    <TableCell className="py-6 pl-6 align-top">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 shrink-0 rounded-sm border border-neutral-200">
                          {/* API trả về field 'logo' là URL hoặc null */}
                          <AvatarImage src={biz.logo} className="object-cover" />
                          <AvatarFallback className="rounded-sm bg-neutral-900 text-xs font-bold text-white">
                            {getInitials(biz.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5">
                          <p className="font-mono text-[10px] text-neutral-400">
                            #{biz.id}
                          </p>
                          <h3 className="cursor-pointer text-base leading-tight font-bold text-neutral-900 transition-colors group-hover:text-blue-600">
                            {biz.name}
                          </h3>
                          {/* Status từ API: business_status */}
                          {renderStatus(biz.business_status)}

                          {/* API không có 'desc' ở level này, có thể lấy tạm slug hoặc ẩn đi */}
                          {biz.slug && (
                            <p className="mt-1 line-clamp-1 max-w-sm text-[10px] text-neutral-400 font-mono">
                              slug: {biz.slug}
                            </p>
                          )}

                          <div className="pt-1">
                            <Button
                              variant="brand-subtle"
                              size="xs"
                              className="rounded-sm"
                              onClick={() => handleViewBusiness(biz.slug)}
                            >
                              <i className="ri-eye-line mr-1"></i> View Business
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. ACTIONS */}
                    <TableCell className="py-6 text-center align-top">
                      <div className="flex flex-col items-center gap-3">
                        {/* EDIT */}
                        <ActionIcon icon="ri-pencil-fill" tooltip="Edit" onClick={() => handleEdit(biz.id)} variant="ghost" />

                        {/* PROMOTE */}
                        <ActionIcon icon="ri-rocket-fill" tooltip="Promote" onClick={() => handlePromote(biz)} variant="warning" />

                        {/* DUPLICATE */}
                        <ActionIcon icon="ri-file-copy-fill" tooltip="Duplicate" onClick={() => handleDuplicate(biz.id)} variant="success" />

                        {/* DEACTIVATE */}
                        <ActionIcon icon="ri-delete-bin-6-fill" tooltip="Deactivate" onClick={() => handleDeactivate(biz)} variant="destructive" />
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
                          {/* Lấy địa chỉ từ address_info.fullAddress */}
                          <span className="leading-relaxed">
                            {biz.address_info?.fullAddress || 'No address provided'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 4. ENGAGEMENT */}
                    <TableCell className="py-6 pr-6 text-right align-top">
                      <div className="mb-1 flex items-center justify-end gap-1.5">
                        <i className="ri-star-fill text-sm text-yellow-400"></i>
                        <span className="text-sm font-bold text-neutral-900">
                          {/* API chưa có reviews, tạm để N/A hoặc 0 */}
                          Reviews: {biz.reviews || 0}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 italic">
                        No ratings yet
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
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