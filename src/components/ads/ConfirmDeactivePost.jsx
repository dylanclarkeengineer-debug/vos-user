'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function ConfirmDeletePost({
  isOpen,
  onClose,
  onConfirm,
  post,
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    // Giả lập delay gọi API
    setTimeout(() => {
      setIsLoading(false)
      onConfirm()
    }, 1000)
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-2xl sm:max-w-md">
        {/* --- ICON HEADER --- */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50">
            <i className="ri-alarm-warning-line text-3xl text-red-500"></i>
          </div>
        </div>

        {/* --- TITLE --- */}
        <DialogHeader className="px-8 pb-2 text-center">
          <DialogTitle className="font-serif text-2xl font-bold text-neutral-900">
            Deactivate This Post?
          </DialogTitle>
        </DialogHeader>

        {/* --- CONTENT BODY --- */}
        <div className="space-y-4 px-8 py-4">
          {/* Warning Box (Yellow) */}
          <div className="flex items-start gap-3 rounded-sm border border-[#FDE68A] bg-[#FFFDF5] p-3">
            <i className="ri-error-warning-line mt-0.5 text-[#B45309]"></i>
            <p className="text-xs leading-relaxed font-medium text-[#92400E]">
              Deactivated posts will no longer appear in search results.
            </p>
          </div>

          {/* Info Box (Blue) */}
          <div className="flex items-start gap-3 rounded-sm border border-[#BFDBFE] bg-[#EFF6FF] p-3">
            <i className="ri-refresh-line mt-0.5 text-[#1D4ED8]"></i>
            <p className="text-xs leading-relaxed font-medium text-[#1E40AF]">
              You can reactivate it anytime from the management dashboard.
            </p>
          </div>

          {/* Post Details Box */}
          <div className="rounded-sm border border-neutral-200 bg-neutral-50/30 p-4">
            <h4 className="mb-2 text-xs font-bold tracking-widest text-neutral-500 uppercase">
              Post Details:
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-neutral-900">
                <span className="font-medium text-neutral-500">Title: </span>
                <span className="font-bold">{post.title}</span>
              </p>
              <p className="text-sm text-neutral-900">
                <span className="font-medium text-neutral-500">Ad Code: </span>
                <span className="rounded bg-neutral-100 px-1 font-mono text-neutral-600">
                  {post.id}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <DialogFooter className="flex flex-col gap-3 border-t border-neutral-100 bg-neutral-50 p-4 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 w-full rounded-sm border-neutral-300 text-xs font-bold tracking-wider text-neutral-700 uppercase hover:bg-white sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-10 w-full rounded-sm bg-[#DC2626] text-xs font-bold tracking-wider text-white uppercase shadow-sm hover:bg-[#B91C1C] sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>{' '}
                Processing...
              </>
            ) : (
              'Deactivate Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
