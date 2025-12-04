'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

// Dữ liệu các gói quảng cáo theo ảnh mẫu
const PROMOTION_OPTIONS = [
  {
    id: 'feature_top',
    title: 'Feature at Top',
    description: 'Pin your ad at the top of its category for 7 days',
    price: 50,
    icon: 'ri-vip-crown-2-line', // Hoặc ri-arrow-up-double-line
    theme: 'blue', // Dùng để map màu
  },
  {
    id: 'highlight_post',
    title: 'Highlight Post',
    description: 'Add a colored frame to make your ad stand out',
    price: 30,
    icon: 'ri-palette-line',
    theme: 'purple',
  },
  {
    id: 'notify_subscribers',
    title: 'Notify Subscribers',
    description: 'Send notifications to relevant job seekers in your category',
    price: 40,
    icon: 'ri-notification-3-line',
    theme: 'green',
  },
  {
    id: 'cross_platform',
    title: 'Cross-Platform Promotion',
    description: 'Share your ad across partner platforms for maximum reach',
    price: 60,
    icon: 'ri-share-forward-line', // Hoặc ri-share-circle-line
    theme: 'orange',
  },
]

// Helper để lấy class màu sắc động
const getThemeClasses = (theme) => {
  const themes = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      borderChecked: 'peer-checked:border-blue-500',
      bgChecked: 'peer-checked:bg-blue-50/30',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      borderChecked: 'peer-checked:border-purple-500',
      bgChecked: 'peer-checked:bg-purple-50/30',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      borderChecked: 'peer-checked:border-green-500',
      bgChecked: 'peer-checked:bg-green-50/30',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      borderChecked: 'peer-checked:border-orange-500',
      bgChecked: 'peer-checked:bg-orange-50/30',
    },
  }
  return themes[theme] || themes.blue
}

export default function PromoteAdModal({ isOpen, onClose, onConfirm }) {
  const [selectedOption, setSelectedOption] = useState(null)

  // Xử lý khi nhấn nút Buy Credits (hoặc Confirm)
  const handleConfirm = () => {
    if (selectedOption) {
      // Logic xử lý (ví dụ: gọi API, chuyển hướng)
      console.log('Selected Promotion:', selectedOption)
      if (onConfirm) onConfirm(selectedOption)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-0 shadow-2xl sm:max-w-[500px]">
        {/* --- HEADER --- */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-serif text-xl font-bold text-neutral-900">
              Promote Your Ad
            </DialogTitle>
            {/* Nút X đóng dialog đã có sẵn trong ShadCN DialogContent, nhưng nếu muốn custom thì thêm ở đây */}
          </div>
          <DialogDescription className="mt-1 text-sm text-neutral-500">
            Boost your ad's visibility with these promotion options:
          </DialogDescription>
        </DialogHeader>

        {/* --- BODY: OPTIONS LIST --- */}
        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-6 py-2">
          {PROMOTION_OPTIONS.map((option) => {
            const themeStyle = getThemeClasses(option.theme)
            return (
              <label
                key={option.id}
                className="group relative block cursor-pointer"
              >
                {/* Hidden Radio Input */}
                <input
                  type="radio"
                  name="promotion_option"
                  value={option.id}
                  className="peer sr-only"
                  onChange={() => setSelectedOption(option.id)}
                  checked={selectedOption === option.id}
                />

                {/* Card UI */}
                <div
                  className={`flex items-start gap-4 rounded-lg border border-neutral-200 p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm ${themeStyle.borderChecked} ${themeStyle.bgChecked} peer-checked:ring-1 peer-checked:ring-[inherit] peer-checked:ring-offset-0`}
                >
                  {/* Icon Box */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${themeStyle.bg} ${themeStyle.text}`}
                  >
                    <i className={`${option.icon} text-xl`}></i>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-0.5 text-sm font-bold text-neutral-900">
                      {option.title}
                    </h4>
                    <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500">
                      {option.description}
                    </p>
                    <p className={`mt-2 text-xs font-bold ${themeStyle.text}`}>
                      {option.price} Credits
                    </p>
                  </div>

                  {/* Check Circle (Optional - Visual indicator) */}
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 peer-checked:border-transparent peer-checked:bg-current ${themeStyle.text} `}
                  >
                    <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
              </label>
            )
          })}
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-6">
          <Separator />
          <div className="flex items-center justify-between gap-4 p-6">
            {/* Balance Info */}
            <div className="text-sm">
              <span className="mr-1 text-neutral-500">Current Balance:</span>
              <span className="font-bold text-neutral-900">120 Credits</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 border-neutral-200 px-4 text-xs font-bold tracking-wide text-neutral-600 uppercase hover:bg-neutral-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedOption}
                className={`h-10 px-6 text-xs font-bold tracking-wide text-white uppercase shadow-md transition-all ${selectedOption ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-neutral-300'} `}
              >
                Buy Credits
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
