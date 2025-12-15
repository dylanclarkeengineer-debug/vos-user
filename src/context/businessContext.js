'use client'

import React, { createContext, useContext, useState } from 'react'

const BusinessContext = createContext(null)

export function BusinessProvider({ children }) {
    const [editBusiness, setEditBusiness] = useState(null)
    const [copyBusiness, setCopyBusiness] = useState(null)

    const clearEditBusiness = () => setEditBusiness(null)
    const clearCopyBusiness = () => setCopyBusiness(null)
    const value = {
        editBusiness,
        copyBusiness,
        setEditBusiness,
        setCopyBusiness,
        clearEditBusiness,
        clearCopyBusiness,
    }

    return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}

export function useBusinessContext() {
    const ctx = useContext(BusinessContext)
    if (!ctx) {
        throw new Error('useBusinessContext must be used inside BusinessProvider')
    }
    return ctx
}