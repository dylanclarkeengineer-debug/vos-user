'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { API_ROUTES } from '@/constants/apiRoute'

export default function PostSuccessModal({
    isOpen,
    onClose,
    successData,
    formData,
    mainImagePreview,
    addressInfo
}) {
    const [isCopied, setIsCopied] = useState(false)

    if (!isOpen || !successData) return null

    // Helper logic
    const getPostUrl = () => successData?.job_id ? API_ROUTES.listingPage(successData.job_id) : ''

    const handleCopyLink = () => {
        const url = getPostUrl()
        if (url) {
            navigator.clipboard.writeText(url)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const handleShare = () => {
        const url = getPostUrl()
        if (navigator.share) {
            navigator.share({
                title: formData.title,
                text: formData.description,
                url: url,
            }).catch(console.error)
        } else {
            handleCopyLink()
        }
    }

    const handleGoToPost = () => {
        const url = getPostUrl()
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">

            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-100 shadow-sm">
                        <i className="ri-checkbox-circle-fill text-3xl text-green-500"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Post Published!</h2>
                    <p className="text-sm text-gray-500">Your ad is now live on the marketplace.</p>
                </div>

                <div className="space-y-6">

                    {/* Share Section */}
                    <div>
                        <Label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Share Link</Label>
                        <div className="flex rounded-md shadow-sm">
                            <div className="relative flex-grow focus-within:z-10">
                                <input
                                    type="text"
                                    className="block w-full rounded-l-md border-gray-300 pl-3 pr-3 py-2 text-sm text-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                    value={getPostUrl()}
                                    readOnly
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="relative -ml-px inline-flex items-center space-x-1 border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <i className="ri-share-forward-line text-blue-600"></i>
                            </button>
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                title="Copy Link"
                            >
                                {isCopied ? <i className="ri-check-line text-green-600 text-lg"></i> : <i className="ri-file-copy-line text-lg"></i>}
                            </button>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div>
                        <Label className="mb-2 block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Compact Preview
                        </Label>

                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="flex p-4 gap-4">
                                {/* Image Left */}
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                    {mainImagePreview ? (
                                        <img
                                            src={mainImagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <i className="ri-image-line text-2xl"></i>
                                        </div>
                                    )}
                                </div>

                                {/* Content Right */}
                                <div className="flex-1 min-w-0 flex flex-col justify-start">
                                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-1 break-words">
                                        {formData.title || "No Title Provided"}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 break-words mb-2 leading-relaxed">
                                        {formData.description || "No description provided."}
                                    </p>

                                    {/* Location Info */}
                                    {(formData.city || formData.state || addressInfo?.fullAddress) && (
                                        <div className="mt-auto flex items-center text-[10px] text-gray-400">
                                            <i className="ri-map-pin-line mr-1"></i>
                                            <span className="truncate max-w-[200px]">
                                                {addressInfo?.fullAddress || `${formData.city}, ${formData.state} ${formData.zipcode}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                                <Button
                                    onClick={handleGoToPost}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm h-10"
                                >
                                    View Post Now <i className="ri-arrow-right-line ml-1"></i>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}