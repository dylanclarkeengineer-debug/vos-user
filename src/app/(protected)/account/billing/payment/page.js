'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Import CSS RemixIcon
import 'remixicon/fonts/remixicon.css'

import { Badge } from '@/components/ui/badge'
// Import ShadCN UI Components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- MOCK DATA ---
const PACKAGES = {
  deposit: [
    { id: 'starter', name: 'Starter Pack', price: 10, points: 100, bonus: 0 },
    { id: 'growth', name: 'Growth Pack', price: 50, points: 550, bonus: 10 },
    {
      id: 'business',
      name: 'Business Pack',
      price: 100,
      points: 1200,
      bonus: 20,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 500,
      points: 6500,
      bonus: 30,
    },
  ],
  bundle: [
    {
      id: 'flash',
      name: 'Flash Sale',
      points: 150,
      equivPrice: 15,
      sub: 'Limited Time',
    },
    {
      id: 'monthly',
      name: 'Monthly Push',
      points: 600,
      equivPrice: 60,
      sub: 'Most Popular',
    },
    {
      id: 'dominator',
      name: 'Dominator',
      points: 1000,
      equivPrice: 100,
      sub: 'Max Exposure',
    },
  ],
}

const PAYMENT_METHODS = [
  {
    id: 'wallet',
    name: 'My Wallet',
    icon: 'ri-wallet-3-line',
    desc: 'Balance: 2,450 pts',
    type: 'internal',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: 'ri-qr-code-line',
    desc: 'Scan QR Code',
    type: 'gateway',
  },
  {
    id: 'card',
    name: 'Credit Card',
    icon: 'ri-bank-card-line',
    desc: 'Visa / Master',
    type: 'gateway',
  },
  {
    id: 'momo',
    name: 'E-Wallet',
    icon: 'ri-smartphone-line',
    desc: 'MoMo / ZaloPay',
    type: 'gateway',
  },
]

export default function PaymentMethodsPage() {
  const router = useRouter()

  // --- LOCAL STATE FOR UI DEMO ---
  const [transactionType, setTransactionType] = useState('deposit') // 'deposit' | 'bundle'
  const [selectedItemId, setSelectedItemId] = useState('starter')
  const [selectedMethod, setSelectedMethod] = useState('bank')

  // Demo States
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Helper: Get Current Item
  const currentItem = useMemo(() => {
    const list =
      transactionType === 'deposit' ? PACKAGES.deposit : PACKAGES.bundle
    return list.find((i) => i.id === selectedItemId) || list[0]
  }, [transactionType, selectedItemId])

  // Demo Payment Handler
  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
    }, 2000) // Giả lập chờ 2s
  }

  return (
    <div className="min-h-screen bg-white pt-8 pb-20 font-sans text-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        {/* 1. Back Button */}
        <button
          onClick={() => router.back()}
          className="group mb-8 flex items-center text-sm font-bold tracking-wider text-neutral-500 uppercase transition-colors hover:text-neutral-900"
        >
          <i className="ri-arrow-left-line mr-2 text-lg transition-transform group-hover:-translate-x-1"></i>
          Back to Billing
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* --- LEFT COLUMN: SELECTION --- */}
          <div className="space-y-8 lg:col-span-2">
            {/* A. Transaction Type Switcher */}
            <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
              <button
                onClick={() => {
                  setTransactionType('deposit')
                  setSelectedItemId('starter')
                }}
                className={cn(
                  'flex-1 rounded-md py-3 text-sm font-bold tracking-wide uppercase transition-all',
                  transactionType === 'deposit'
                    ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-black/5'
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                <i className="ri-coins-line mr-2 align-bottom"></i> Buy Points
              </button>
              <button
                onClick={() => {
                  setTransactionType('bundle')
                  setSelectedItemId('flash')
                }}
                className={cn(
                  'flex-1 rounded-md py-3 text-sm font-bold tracking-wide uppercase transition-all',
                  transactionType === 'bundle'
                    ? 'bg-white text-neutral-900 shadow-sm ring-1 ring-black/5'
                    : 'text-neutral-400 hover:text-neutral-600'
                )}
              >
                <i className="ri-box-3-line mr-2 align-bottom"></i> Buy Bundle
              </button>
            </div>

            {/* B. Item Grid */}
            <div>
              <h2 className="mb-4 font-serif text-lg font-bold text-neutral-900">
                {transactionType === 'deposit'
                  ? 'Select Package'
                  : 'Select Bundle'}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {(transactionType === 'deposit'
                  ? PACKAGES.deposit
                  : PACKAGES.bundle
                ).map((item) => {
                  const isSelected = selectedItemId === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={cn(
                        'relative flex h-32 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all',
                        isSelected
                          ? 'scale-[1.02] border-neutral-900 bg-neutral-900 text-white shadow-lg'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            'mb-1 text-xs font-bold tracking-wider uppercase',
                            isSelected ? 'text-neutral-400' : 'text-neutral-500'
                          )}
                        >
                          {item.name}
                        </p>
                        <p
                          className={cn(
                            'text-xl font-bold',
                            isSelected ? 'text-white' : 'text-neutral-900'
                          )}
                        >
                          {transactionType === 'deposit'
                            ? `$${item.price}`
                            : `${item.points} pts`}
                        </p>
                      </div>

                      {/* Badge or Icon */}
                      {isSelected && (
                        <div className="absolute -right-2 -bottom-2 text-neutral-800 opacity-20">
                          <i className="ri-checkbox-circle-fill text-6xl"></i>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* C. Payment Methods */}
            <Card className="border-neutral-200 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Payment Method
                </CardTitle>
                <CardDescription>Choose how you want to pay.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  // Logic ẩn ví khi nạp tiền
                  if (transactionType === 'deposit' && method.id === 'wallet')
                    return null

                  const isSelected = selectedMethod === method.id
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        'flex cursor-pointer items-center rounded-xl border p-4 transition-all hover:bg-neutral-50',
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200'
                      )}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div
                        className={cn(
                          'mr-4 flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-colors',
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-500'
                        )}
                      >
                        <i className={method.icon}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-neutral-900">
                          {method.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {method.desc}
                        </p>
                      </div>
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300">
                        {isSelected && (
                          <div className="h-3 w-3 rounded-full bg-neutral-900"></div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden border-neutral-200 shadow-xl">
                <div className="bg-neutral-900 p-6 text-center text-white">
                  <p className="mb-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
                    Total Amount
                  </p>
                  <h3 className="font-serif text-4xl font-bold">
                    {transactionType === 'deposit'
                      ? `$${currentItem.price}`
                      : selectedMethod === 'wallet'
                        ? `${currentItem.points} pts`
                        : `$${currentItem.equivPrice}`}
                  </h3>
                </div>

                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-neutral-900">
                          {currentItem.name}
                        </p>
                        <p className="text-xs text-neutral-500 capitalize">
                          {transactionType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-neutral-900">
                          {transactionType === 'deposit'
                            ? `$${currentItem.price}`
                            : `${currentItem.points} pts`}
                        </p>
                      </div>
                    </div>

                    {transactionType === 'deposit' && currentItem.bonus > 0 && (
                      <div className="flex items-center justify-between rounded-lg bg-green-50 p-2 text-xs text-green-600">
                        <span className="flex items-center gap-1 font-bold">
                          <i className="ri-gift-line"></i> Bonus (+
                          {currentItem.bonus}%)
                        </span>
                        <span className="font-bold">
                          +{(currentItem.points * currentItem.bonus) / 100} pts
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                      Total Receive
                    </span>
                    <span className="flex items-center gap-1 text-lg font-bold text-neutral-900">
                      {transactionType === 'deposit'
                        ? currentItem.points +
                          (currentItem.points * (currentItem.bonus || 0)) / 100
                        : currentItem.points}
                      <span className="ml-1 text-xs font-normal text-neutral-500">
                        pts
                      </span>
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-neutral-100 bg-neutral-50 p-6">
                  <Button
                    onClick={handlePayment}
                    className="h-12 w-full bg-neutral-900 text-xs font-bold tracking-widest text-white uppercase hover:bg-black"
                  >
                    <i className="ri-shield-check-line mr-2 text-base"></i>
                    {transactionType === 'deposit'
                      ? 'Pay Now'
                      : 'Confirm Purchase'}
                  </Button>
                </CardFooter>
              </Card>

              <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-neutral-400">
                <i className="ri-lock-line"></i> Secure 256-bit SSL Encrypted
                payment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: PROCESSING --- */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="mb-4 animate-spin text-5xl text-neutral-900">
            <i className="ri-loader-4-line"></i>
          </div>
          <p className="animate-pulse text-sm font-bold tracking-widest text-neutral-600 uppercase">
            Processing Payment...
          </p>
        </div>
      )}

      {/* --- MODAL 2: SUCCESS --- */}
      {showSuccess && (
        <div className="animate-in fade-in zoom-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm duration-300">
          <Card className="relative w-full max-w-sm overflow-hidden border-0 shadow-2xl">
            <div className="absolute top-0 left-0 h-2 w-full bg-green-500"></div>
            <CardHeader className="pt-10 pb-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                <i className="ri-check-line"></i>
              </div>
              <CardTitle className="font-serif text-2xl font-bold text-neutral-900">
                Payment Successful!
              </CardTitle>
              <CardDescription>
                Your transaction has been completed.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 text-center">
              <div className="my-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                <p className="mb-1 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  New Balance
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  {(
                    2450 +
                    (transactionType === 'deposit' ? currentItem.points : 0)
                  ).toLocaleString()}{' '}
                  pts
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/home/billing2/history')}
                >
                  View Receipt
                </Button>
                <Button
                  className="flex-1 bg-neutral-900 text-white hover:bg-black"
                  onClick={() => {
                    setShowSuccess(false)
                    router.push('/home/billing2')
                  }}
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
