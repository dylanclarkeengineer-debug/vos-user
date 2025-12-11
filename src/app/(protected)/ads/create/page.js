// page.js
'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import CreateForm from '@/components/ads/CreateForm'
import { useAdsStore } from '@/stores/adsStore'

export default function CreateAdsPage() {
  const searchParams = useSearchParams()
  // const [initialJob, setInitialJob] = useState(null) // <--- XÓA state này
  const [mode, setMode] = useState('new')

  // Lấy thẳng từ Store
  const editJob = useAdsStore(state => state.editJob)
  const copyJob = useAdsStore(state => state.copyJob)

  // Xác định data truyền xuống
  // Nếu có ID trên URL VÀ có data trong store thì lấy, không thì null
  const editId = searchParams?.get?.('edit')
  const copyId = searchParams?.get?.('copy')

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
    // Truyền thẳng biến jobData tính toán ở trên
    <CreateForm type={mode} adsProps={jobData} />
  )
}