'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import CreateForm from '@/components/ads/CreateForm'
import { useAdsContext } from '@/context/adsContext'

export default function CreateAdsPage() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('new')

  // 1. Lấy Data từ Context
  const { editJob, copyJob } = useAdsContext()

  const editId = searchParams?.get?.('edit')
  const copyId = searchParams?.get?.('copy')

  // 2. Logic chọn Data (Giống hệt lúc dùng Zustand)
  let jobData = null

  if (editId && editJob && String(editJob.id) === String(editId)) {
    jobData = editJob
  } else if (copyId && copyJob) {
    jobData = copyJob
  }

  useEffect(() => {
    if (editId) setMode('edit')
    else if (copyId) setMode('copy')
    else setMode('new')
  }, [editId, copyId])

  return (
    <CreateForm type={mode} adsProps={jobData} />
  )
}