'use client'

import React, { createContext, useContext, useState } from 'react'

const AdsContext = createContext(null)

export function AdsProvider({ children }) {
    const [editJob, setEditJob] = useState(null)
    const [copyJob, setCopyJob] = useState(null)

    const clearEditJob = () => setEditJob(null)
    const clearCopyJob = () => setCopyJob(null)

    const value = {
        editJob,
        copyJob,
        setEditJob,
        setCopyJob,
        clearEditJob,
        clearCopyJob,
    }

    return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>
}

export function useAdsContext() {
    const ctx = useContext(AdsContext)
    if (!ctx) {
        throw new Error('useAdsContext must be used inside AdsProvider')
    }
    return ctx
}