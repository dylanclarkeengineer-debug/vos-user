'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'

// Components
import ConfirmDeletePost from '@/components/ads/ConfirmDeactivePost'
import PromoteAdModal from '@/components/ads/PromoteAdModal'
import { Button } from '@/components/ui/button' // Đảm bảo import Button mới
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import 'remixicon/fonts/remixicon.css'

import { getListJobsByUser } from '@/utils/ads/adsHandlers'
import { useAuth } from '@/context/authContext'
import { API_ROUTES } from '@/constants/apiRoute'
import { useAdsContext } from '@/context/adsContext'

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatUnixToLocal = (secs) => {
  if (!secs && secs !== 0) return null
  try {
    const d = new Date(Number(secs) * 1000)
    return Number.isNaN(d.getTime()) ? String(secs) : d.toLocaleDateString()
  } catch {
    return String(secs)
  }
}

const formatIsoToLocal = (isoStr) => {
  if (!isoStr) return null
  try {
    const d = new Date(isoStr)
    return Number.isNaN(d.getTime()) ? isoStr : d.toLocaleDateString()
  } catch {
    return isoStr
  }
}

const formatLocation = (addressInfo) => {
  const city = addressInfo?.city || ''
  const state = addressInfo?.state || ''
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return '—'
}

const getSalaryDisplay = (item) => {
  return item.salary?.display_text || item.price_salary || 'Contact for price'
}

const getStatusStyle = (status) => {
  const s = status?.toLowerCase() || 'expired'
  const styles = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-neutral-100 text-neutral-500',
    deactive: 'bg-neutral-100 text-neutral-500',
  }
  return styles[s] || styles.expired
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdsListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.user_id || null

  const { setEditJob, setCopyJob } = useAdsContext()

  const [searchTerm, setSearchTerm] = useState('')
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isPromoteOpen, setIsPromoteOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)

  const [serverMeta, setServerMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    pageSize: 12,
  })

  // Data Fetching
  useEffect(() => {
    let mounted = true
    const loadJobs = async () => {
      setIsLoading(true)
      setFetchError(null)
      try {
        const token = Cookies.get('vos_token')
        const data = await getListJobsByUser({ token, userId, page: currentPage, pageSize: 12 })

        if (!mounted) return

        if (data?.jobPosts && Array.isArray(data.jobPosts)) {
          setJobs(data.jobPosts)
          setServerMeta({
            currentPage: data.currentPage ?? 1,
            totalPages: data.totalPages ?? 1,
            totalJobs: data.totalJobs ?? 0,
            pageSize: data.pageSize ?? 12,
          })
        } else if (Array.isArray(data)) {
          setJobs(data)
          setServerMeta({ currentPage: 1, totalPages: 1, totalJobs: data.length, pageSize: data.length })
        } else {
          setJobs([])
          setServerMeta({ currentPage: 1, totalPages: 1, totalJobs: 0, pageSize: 12 })
        }
      } catch (err) {
        console.error('Failed to load jobs:', err)
        if (!mounted) return
        setFetchError('Unable to load your ads. Please try again.')
        setJobs([])
        setServerMeta({ currentPage: 1, totalPages: 1, totalJobs: 0, pageSize: 12 })
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    loadJobs()
    return () => { mounted = false }
  }, [userId, currentPage])

  const filteredJobs = searchTerm
    ? jobs.filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : jobs

  // Handlers
  const handleGoToPost = (id) => {
    if (!id) return
    const url = API_ROUTES.listingPage(id)
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleEdit = (id) => {
    const job = jobs.find(j => j.id === id)
    if (job) setEditJob(job)
    router.push(`/ads/create?edit=${id}`)
  }

  const handleDuplicate = (id) => {
    const job = jobs.find(j => j.id === id)
    if (job) setCopyJob(job)
    router.push(`/ads/create?duplicate=${id}`)
  }

  const handlePauseClick = (ad) => { setSelectedAd(ad); setIsDeleteOpen(true) }
  const handlePromoteClick = (ad) => { setSelectedAd(ad); setIsPromoteOpen(true) }
  const goToPage = (page) => { if (page >= 1 && page <= serverMeta.totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) } }
  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const getPaginationPages = () => {
    const { currentPage, totalPages } = serverMeta
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      if (currentPage <= 3) end = 4
      if (currentPage >= totalPages - 2) start = totalPages - 3
      if (start > 2) pages.push('...')
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="animate-fade-in mx-auto max-w-[1400px] px-4 pt-6 pb-32 font-sans text-neutral-900">

      {/* TOP BAR */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row">
        <Input
          placeholder="Search by title or ad code..."
          className="h-10 border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-blue-600 w-full lg:max-w-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="ml-auto flex w-full gap-2 lg:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-10 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/ads/create">
            {/* UPDATED: Dùng variant 'brand' */}
            <Button variant="brand" className="h-10 w-full lg:w-auto px-6 font-bold">
              <i className="ri-add-line mr-2"></i> Create New Ad
            </Button>
          </Link>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="flex min-h-[600px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-none items-center justify-between border-b border-neutral-100 bg-white px-6 py-5">
          <h2 className="text-xl font-bold text-neutral-900">
            Posted Ads ({serverMeta.totalJobs})
          </h2>
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500">
            <i className="ri-eye-line text-neutral-400"></i> Total Views: 12,515
          </div>
        </div>

        {fetchError && <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-800">{fetchError}</div>}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <TooltipProvider delayDuration={0}>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-neutral-100 hover:bg-transparent">
                  <TableHead className="w-[45%] pl-6 py-4 text-xs font-bold tracking-tight text-neutral-900 uppercase">Title</TableHead>
                  <TableHead className="w-[5%] text-center py-4 text-xs font-bold tracking-tight text-neutral-900 uppercase">Actions</TableHead>
                  <TableHead className="w-[10%] text-center py-4 text-xs font-bold tracking-tight text-neutral-500 uppercase">Views</TableHead>
                  <TableHead className="w-[15%] text-left py-4 text-xs font-bold tracking-tight text-neutral-500 uppercase">Engagement</TableHead>
                  <TableHead className="w-[25%] text-left py-4 text-xs font-bold tracking-tight text-neutral-500 uppercase">Details</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-neutral-500" colSpan={5}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <span>Loading ads...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-12 text-center text-neutral-500" colSpan={5}>
                      {searchTerm ? 'No ads match your search.' : 'No ads found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((item) => {
                    const postedDate = item.createdAt ? formatUnixToLocal(item.createdAt) : '—'
                    const leaseExpiration = item.sales_info?.lease_expiration ? formatIsoToLocal(item.sales_info.lease_expiration) : null

                    return (
                      <TableRow key={item.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/30">
                        {/* Col 1 */}
                        <TableCell className="py-6 align-top pl-6">
                          <div className="flex flex-col items-start gap-1 max-w-[350px] lg:max-w-md">
                            <span className="font-mono text-[10px] text-neutral-400 break-all">Ad Code: {item.id}</span>
                            <h3 className="mb-1 cursor-pointer text-base leading-tight font-bold text-neutral-900 transition-colors hover:text-blue-600 line-clamp-2 break-words w-full"
                              title={item.title} onClick={() => handleGoToPost(item.id)}>
                              {item.title || "Untitled Post"}
                            </h3>
                            <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(item.status)}`}>
                              {item.status || 'Expired'}
                            </span>
                            <p className="mb-2 text-sm leading-relaxed text-neutral-500 line-clamp-3 break-words w-full">
                              {item.description || "No description available. "}
                            </p>
                            <div className="mb-3 text-sm font-bold text-blue-600 truncate w-full" title={getSalaryDisplay(item)}>
                              {getSalaryDisplay(item)}
                            </div>

                            {/* UPDATED: Dùng variant 'brand-subtle' và size 'xs' */}
                            <Button
                              variant="brand-subtle"
                              size="xs"
                              className="rounded-sm"
                              onClick={() => handleGoToPost(item.id)}
                            >
                              <i className="ri-eye-line mr-1.5"></i> View Post
                            </Button>
                          </div>
                        </TableCell>

                        {/* Col 2: Actions */}
                        <TableCell className="py-6 align-top text-center">
                          <div className="flex flex-col items-center gap-1">
                            {/* UPDATED: Truyền variant vào ActionIcon */}
                            <ActionIcon icon="ri-pencil-line" tooltip="Edit" onClick={() => handleEdit(item.id)} variant="icon-ghost" />
                            <ActionIcon icon="ri-rocket-line" tooltip="Promote" onClick={() => handlePromoteClick(item)} variant="icon-warning" />
                            <ActionIcon icon="ri-file-copy-line" tooltip="Copy" onClick={() => handleDuplicate(item.id)} variant="icon-ghost" />
                            <ActionIcon icon="ri-delete-bin-line" tooltip="Delete" onClick={() => handlePauseClick(item)} variant="icon-destructive" />
                          </div>
                        </TableCell>

                        {/* Other Cols... */}
                        <TableCell className="py-6 align-top text-center">
                          <span className="mt-2 block text-xl font-bold text-neutral-900">{item.views ?? 0}</span>
                        </TableCell>
                        <TableCell className="py-6 align-top">
                          <div className="mt-1 flex flex-col gap-3">
                            <EngagementItem icon="ri-file-list-3-line" label="Applications" value={item.engagement?.applications ?? 0} />
                            <EngagementItem icon="ri-share-forward-line" label="Shares" value={item.engagement?.shares ?? 0} />
                          </div>
                        </TableCell>
                        <TableCell className="py-6 align-top">
                          <div className="mt-1 space-y-2.5">
                            <DetailRow icon="ri-folder-line" text={item.category || '—'} />
                            <DetailRow icon="ri-map-pin-line" text={formatLocation(item.address_info)} />
                            <DetailRow icon="ri-calendar-line" text={`Posted: ${postedDate}`} />
                            {leaseExpiration && <DetailRow icon="ri-building-line" text={`Lease Exp: ${leaseExpiration}`} color="text-orange-700" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-none items-center justify-between border-t border-neutral-100 bg-neutral-50/30 px-6 py-4">
          <div className="text-xs font-medium text-neutral-500">
            {searchTerm ? (
              <>Showing <span className="font-bold text-neutral-900">{filteredJobs.length}</span> results in current page</>
            ) : (
              <>Page <span className="font-bold text-neutral-900">{serverMeta.currentPage}</span> of <span className="font-bold text-neutral-900">{serverMeta.totalPages}</span> • Total: <span className="font-bold text-neutral-900">{serverMeta.totalJobs}</span> ads</>
            )}
          </div>

          {!searchTerm && serverMeta.totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* UPDATED: Dùng variant 'icon-ghost' cho nút điều hướng */}
              <Button
                variant="icon-ghost"
                size="icon-sm"
                className="bg-white hover:bg-neutral-100 border border-transparent rounded-sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="ri-arrow-left-s-line text-neutral-600"></i>
              </Button>

              <div className="flex items-center gap-1">
                {getPaginationPages().map((page, idx) => (
                  <React.Fragment key={idx}>
                    {page === '...' ? (
                      <span className="px-2 text-neutral-400">...</span>
                    ) : (
                      // UPDATED: Dùng variant 'pagination' và 'pagination-active'
                      <Button
                        variant={currentPage === page ? 'pagination-active' : 'pagination'}
                        size="sm"
                        className="h-8 w-8 rounded-sm p-0 text-xs font-bold"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Button
                variant="icon-ghost"
                size="icon-sm"
                className="bg-white hover:bg-neutral-100 border border-transparent rounded-sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === serverMeta.totalPages}
              >
                <i className="ri-arrow-right-s-line text-neutral-600"></i>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {selectedAd && (
        <>
          <PromoteAdModal isOpen={isPromoteOpen} onClose={() => setIsPromoteOpen(false)} onConfirm={() => setIsPromoteOpen(false)} />
          <ConfirmDeletePost isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => setIsDeleteOpen(false)} post={selectedAd} />
        </>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

// UPDATED: ActionIcon sử dụng Button với variant
const ActionIcon = ({ icon, tooltip, onClick, variant = 'icon-ghost' }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={variant}
        size="icon-sm"
        onClick={onClick}
        className="rounded-sm transition-all"
      >
        <i className={`${icon} text-lg`}></i>
      </Button>
    </TooltipTrigger>
    <TooltipContent side="left" className="border-none bg-black text-[10px] font-bold tracking-wider text-white uppercase">
      {tooltip}
    </TooltipContent>
  </Tooltip>
)

const EngagementItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <i className={`${icon} mt-0.5 text-neutral-400 shrink-0`}></i>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">{label}</span>
      <span className="text-sm font-bold text-neutral-900">{value}</span>
    </div>
  </div>
)

const DetailRow = ({ icon, text, color = 'text-neutral-600' }) => (
  <div className={`flex items-start gap-3 text-xs ${color}`}>
    <i className={`${icon} w-4 text-center text-neutral-400 shrink-0 mt-0.5`}></i>
    <span className="line-clamp-2 break-words leading-relaxed" title={text}>{text}</span>
  </div>
)