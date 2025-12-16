'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { API_ROUTES } from '@/constants/apiRoute'

/**
 * BusinessSuccessModal
 *
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - successData: object (expected to contain at least `slug` or similar id)
 * - formData: object (submitted form data; used for title/description)
 * - mainImagePreview: string (image url/base64)
 * - addressInfo: object (optional address object / fullAddress)
 *
 * Behavior:
 * - Builds business page url via API_ROUTES.businessPage(slug)
 * - Allows opening business page in new tab, copying link, sharing (Web Share API)
 */
export default function BusinessSuccessModal({
    isOpen,
    onClose,
    successData,
    formData = {},
    mainImagePreview = null,
    addressInfo = {}
}) {
    const [copied, setCopied] = useState(false)

    if (!isOpen || !successData) return null

    const slug = successData.slug || successData.data?.slug || successData.business?.slug || ''
    const businessUrl = slug ? API_ROUTES.businessPage(slug) : ''

    const handleOpenNewTab = () => {
        if (!businessUrl) return
        window.open(businessUrl, '_blank', 'noopener,noreferrer')
    }

    const handleCopy = async () => {
        if (!businessUrl) return
        try {
            await navigator.clipboard.writeText(businessUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            console.error('Copy failed', e)
        }
    }

    const handleShare = () => {
        if (!businessUrl) return
        if (navigator.share) {
            navigator.share({
                title: formData.name || formData.title || 'My Business',
                text: addressInfo?.fullAddress || '',
                url: businessUrl
            }).catch(console.error)
        } else {
            handleCopy()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                    aria-label="Close"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-100 shadow-sm">
                        <i className="ri-checkbox-circle-fill text-3xl text-green-500"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Business Published!</h2>
                    <p className="text-sm text-gray-500">Your business is now live.</p>
                </div>

                <div className="space-y-6">
                    {/* Link + actions */}
                    <div>
                        <Label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Business Link
                        </Label>

                        <div className="flex rounded-md shadow-sm">
                            <div className="relative flex-grow focus-within:z-10">
                                <input
                                    type="text"
                                    className="block w-full rounded-l-md border-gray-300 pl-3 pr-3 py-2 text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                    value={businessUrl || ''}
                                    readOnly
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="relative -ml-px inline-flex items-center space-x-1 border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <i className="ri-share-forward-line text-blue-600"></i>
                            </button>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                title="Copy Link"
                            >
                                {copied ? <i className="ri-check-line text-green-600 text-lg"></i> : <i className="ri-file-copy-line text-lg"></i>}
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <Label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Compact Preview
                        </Label>

                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="flex p-4 gap-4">
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                    {mainImagePreview ? (
                                        <img src={mainImagePreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <i className="ri-image-line text-2xl"></i>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-start">
                                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-1 break-words">
                                        {formData.name || formData.title || 'No Name'}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 break-words mb-2 leading-relaxed">
                                        {addressInfo?.fullAddress || formData.website || ''}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                                <Button
                                    onClick={handleOpenNewTab}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm h-10"
                                >
                                    Open Business Page <i className="ri-arrow-right-line ml-1"></i>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}