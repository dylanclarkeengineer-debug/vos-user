'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Import CSS RemixIcon
import 'remixicon/fonts/remixicon.css'

// Import ShadCN Components
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- MOCK REASONS ---
const REASONS = {
  DEPOSIT: [
    {
      value: 'money_deducted_no_points',
      label: 'Money deducted but points not added',
    },
    { value: 'wrong_amount', label: 'Wrong deposit amount credited' },
    { value: 'duplicate_payment', label: 'Charged twice for one transaction' },
    { value: 'other', label: 'Other issue' },
  ],
  SERVICE: [
    {
      value: 'points_deducted_no_service',
      label: 'Points deducted but service not active',
    },
    { value: 'service_error', label: 'Service not working as described' },
    { value: 'accidental_click', label: 'Accidental purchase' },
    { value: 'other', label: 'Other issue' },
  ],
}

export default function CreateRefundPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form State for Demo Interaction
  const [formData, setFormData] = useState({
    type: 'DEPOSIT', // 'DEPOSIT' | 'SERVICE'
    transactionRef: '',
    reason: '',
    otherDetail: '',
    description: '',
  })

  const handleTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, type, reason: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Fake API Call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/home/billing2/refunds')
    }, 1500)
  }

  const isOther = formData.reason === 'other'
  const currentReasons = REASONS[formData.type]

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-6 pt-8 pb-20">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <Link
          href="/account/billing/refunds"
          className="mb-4 inline-flex items-center text-sm font-bold tracking-wider text-neutral-500 uppercase transition-colors hover:text-neutral-900"
        >
          <i className="ri-arrow-left-line mr-2 text-lg"></i> Back to List
        </Link>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
          New Refund Request
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Submit a request for point restoration or transaction disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- FORM AREA --- */}
        <div className="space-y-8 lg:col-span-2">
          {/* 1. Select Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleTypeChange('DEPOSIT')}
              className={cn(
                'group relative rounded-xl border-2 p-6 text-left transition-all hover:border-indigo-400',
                formData.type === 'DEPOSIT'
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-neutral-200 bg-white'
              )}
            >
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors',
                  formData.type === 'DEPOSIT'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-100 text-neutral-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                )}
              >
                <i className="ri-money-dollar-circle-line"></i>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Deposit Issue
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Problems with top-up or payments.
              </p>
              {formData.type === 'DEPOSIT' && (
                <div className="absolute top-4 right-4 text-xl text-indigo-600">
                  <i className="ri-checkbox-circle-fill"></i>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('SERVICE')}
              className={cn(
                'group relative rounded-xl border-2 p-6 text-left transition-all hover:border-purple-400',
                formData.type === 'SERVICE'
                  ? 'border-purple-600 bg-purple-50/50'
                  : 'border-neutral-200 bg-white'
              )}
            >
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-colors',
                  formData.type === 'SERVICE'
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-100 text-neutral-400 group-hover:bg-purple-100 group-hover:text-purple-600'
                )}
              >
                <i className="ri-service-line"></i>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Service Issue
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Problems with ads, sticky posts, etc.
              </p>
              {formData.type === 'SERVICE' && (
                <div className="absolute top-4 right-4 text-xl text-purple-600">
                  <i className="ri-checkbox-circle-fill"></i>
                </div>
              )}
            </button>
          </div>

          {/* 2. Input Fields */}
          <Card className="border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction ID */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., TRX-12345678"
                    value={formData.transactionRef}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionRef: e.target.value,
                      })
                    }
                    className="h-11 border-neutral-200 bg-neutral-50 focus:ring-black"
                  />
                </div>

                {/* Reason Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.reason}
                    onValueChange={(val) =>
                      setFormData({ ...formData, reason: val })
                    }
                  >
                    <SelectTrigger className="h-11 border-neutral-200 bg-neutral-50">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentReasons.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Other Detail (Conditional) */}
                {isOther && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                    <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                      Specify Reason <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Please describe your issue..."
                      rows={2}
                      value={formData.otherDetail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          otherDetail: e.target.value,
                        })
                      }
                      className="border-neutral-200 bg-neutral-50"
                    />
                  </div>
                )}

                {/* Additional Note */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                    Additional Note
                  </label>
                  <Textarea
                    placeholder="Any extra details..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border-neutral-200 bg-neutral-50"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 flex-1 bg-neutral-900 text-xs font-bold tracking-widest text-white uppercase hover:bg-black"
                  >
                    {isLoading ? (
                      <>
                        <i className="ri-loader-4-line mr-2 animate-spin text-base"></i>{' '}
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-fill mr-2 text-base"></i>{' '}
                        Submit Request
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-12 border-neutral-300 px-8 text-xs font-bold tracking-widest text-neutral-600 uppercase hover:bg-neutral-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- SIDEBAR INFO --- */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 border-blue-100 bg-blue-50/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-blue-800 uppercase">
                <i className="ri-information-fill text-lg"></i> Important Note
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-blue-700">
                Refund requests are usually processed within{' '}
                <strong>24-48 hours</strong>.
              </p>
              <ul className="list-disc space-y-2 pl-4 text-xs text-blue-600">
                <li>Ensure your Transaction ID is correct.</li>
                <li>
                  Provide clear evidence (screenshots) if contacted by support.
                </li>
                <li>
                  Approved refunds will return Points directly to your wallet.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
