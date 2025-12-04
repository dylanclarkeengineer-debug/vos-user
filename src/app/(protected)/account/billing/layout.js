'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// QUAN TRỌNG: Import CSS của RemixIcon
import 'remixicon/fonts/remixicon.css'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- MOCK DATA: MENU ITEMS ---
const NAV_ITEMS = [
  { name: 'Store', href: '/account/billing', icon: 'ri-store-2-line' },
  { name: 'Top Up', href: '/account/billing/payment', icon: 'ri-coins-line' },
  {
    name: 'History',
    href: '/account/billing/history',
    icon: 'ri-history-line',
  },
  {
    name: 'Refunds',
    href: '/account/billing/refunds',
    icon: 'ri-exchange-dollar-line',
  },
]

// --- MOCK DATA: USER ---
const MOCK_USER = {
  name: 'John Doe',
  points: 2450,
  avatar: 'https://github.com/shadcn.png',
}

export default function PricingLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 1. Logo */}
            <Link
              href="/dashboard"
              className="group flex flex-shrink-0 cursor-pointer items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                V
              </div>
              <span className="hidden text-lg font-bold tracking-tight text-slate-900 sm:block">
                VGC System
              </span>
            </Link>

            {/* 2. Desktop Nav */}
            <nav className="hidden space-x-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-slate-100 font-bold text-indigo-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <i
                      className={cn(
                        item.icon,
                        'mr-2 text-lg',
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      )}
                    ></i>
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* 3. User Widget (Mocked) */}
            <div className="flex flex-shrink-0 items-center gap-4">
              {/* Wallet Badge */}
              <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1 pr-1 pl-3 shadow-sm transition-colors hover:border-indigo-200 sm:flex">
                <div className="mr-1 flex flex-col items-end leading-none">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Balance
                  </span>
                  <div className="flex items-center gap-1 font-mono font-bold text-indigo-700">
                    {/* SỬA LỖI HYDRATION: Thêm 'en-US' để cố định format */}
                    {MOCK_USER.points.toLocaleString('en-US')}
                    <i className="ri-copper-coin-fill text-sm text-yellow-500"></i>
                  </div>
                </div>
                <Link
                  href="/billing/payment-methods"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-all hover:scale-105 hover:bg-indigo-700"
                >
                  <i className="ri-add-line text-lg"></i>
                </Link>
              </div>

              {/* User Dropdown Trigger */}
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="hidden flex-col items-end lg:flex">
                  <span className="max-w-[100px] truncate text-sm text-slate-700">
                    {MOCK_USER.name}
                  </span>
                </div>
                <div className="group relative">
                  <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={MOCK_USER.avatar} alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Menu (Hover to show) */}
                  <div className="invisible absolute top-full right-0 z-50 mt-2 w-48 origin-top-right transform rounded-lg border border-slate-100 bg-white opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    <div className="border-b border-slate-50 px-4 py-3 lg:hidden">
                      <p className="text-sm font-bold text-slate-900">
                        {MOCK_USER.name}
                      </p>
                      <p className="text-xs text-slate-500">Premium Member</p>
                    </div>
                    <button className="flex w-full items-center gap-2 rounded-b-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
                      <i className="ri-logout-box-r-line text-lg"></i> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Mobile Nav Bar */}
        <div className="border-t border-slate-100 bg-white md:hidden">
          {/* Mobile Wallet Status */}
          <div className="flex items-center justify-between border-b border-indigo-100 bg-indigo-50/50 px-4 py-2">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-900">
              <i className="ri-wallet-3-line text-lg text-indigo-500"></i>
              {/* SỬA LỖI HYDRATION: Thêm 'en-US' */}
              <span>
                Balance: {MOCK_USER.points.toLocaleString('en-US')} Pts
              </span>
            </div>
            <Link
              href="/billing/payment-methods"
              className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
            >
              Top Up
            </Link>
          </div>
          {/* Scrollable Links */}
          <div className="no-scrollbar flex space-x-2 overflow-x-auto px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
                      : 'border-transparent bg-slate-50 text-slate-600'
                  )}
                >
                  <i
                    className={cn(
                      item.icon,
                      'mr-1.5 text-base',
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    )}
                  ></i>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
