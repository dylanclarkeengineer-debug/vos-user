'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/context/authContext'

import 'remixicon/fonts/remixicon.css'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AdsProvider } from '@/context/adsContext'

const inter = Inter({ subsets: ['latin'] })

const MENU_ITEMS = [
  {
    id: 'ads',
    label: 'Advertising',
    icon: 'ri-megaphone-line',
    subItems: [
      {
        label: 'Create New Post',
        icon: 'ri-add-line',
        href: '/ads/create',
        title: 'Create New Classified Post',
      },
      {
        label: 'My Posted Ads',
        icon: 'ri-file-list-line',
        href: '/ads/list',
        title: 'My Posted Ads',
      },
      {
        label: 'Favorite Ads',
        icon: 'ri-heart-line',
        href: '/ads/favorites',
        title: 'Favorite Ads',
      },
      {
        label: 'Job Suggestions',
        icon: 'ri-lightbulb-line',
        href: '/ads/suggestions',
        title: 'Job Suggestions',
      },
      {
        label: 'Applied Jobs',
        icon: 'ri-briefcase-line',
        href: '/ads/applied',
        title: 'Applied Jobs',
      },
    ],
    caption: 'Việc làm & rao vặt',
  },
  {
    id: 'business',
    label: 'Business Hub',
    icon: 'ri-building-line',
    subItems: [
      {
        label: 'Create Business',
        icon: 'ri-add-circle-line',
        href: '/business/create',
        title: 'Create New Business',
      },
      {
        label: 'My Businesses',
        icon: 'ri-store-2-line',
        href: '/business/list',
        title: 'My Businesses',
      },
      {
        label: 'Analytics',
        icon: 'ri-bar-chart-2-line',
        href: '/business/analytics',
        title: 'Business Analytics',
      },
    ],
    caption: 'Quản lý và doanh nghiệp',
  },
  {
    id: 'news',
    label: 'Editorial News',
    icon: 'ri-newspaper-line',
    subItems: [
      {
        label: 'Latest Feed',
        icon: 'ri-rss-line',
        href: '/news/feed',
        title: 'Latest News Feed',
      },
      {
        label: 'Bookmarks',
        icon: 'ri-bookmark-line',
        href: '/news/bookmarks',
        title: 'Bookmarked News',
      },
    ],
    caption: 'Tin tức & bài viết',
  },
  {
    id: 'account',
    label: 'Account',
    icon: 'ri-user-settings-line',
    subItems: [
      {
        label: 'Profile Settings',
        icon: 'ri-settings-4-line',
        href: '/account/profile',
        title: 'Profile Settings',
      },
      {
        label: 'Security',
        icon: 'ri-shield-keyhole-line',
        href: '/account/security',
        title: 'Security Settings',
      },
      {
        label: 'Billing & Payments',
        icon: 'ri-wallet-line',
        href: '/account/billing',
        title: 'Billing & Payments',
      },
    ],
    caption: 'Cài đặt tài khoản',
  },
]

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const activeSectionId = MENU_ITEMS.find((section) =>
      section.subItems.some((item) => pathname.startsWith(item.href))
    )?.id

    if (activeSectionId) {
      setOpenItems([activeSectionId])
    }
  }, [pathname])

  const activePageInfo = useMemo(() => {
    if (pathname === '/dashboard') {
      return {
        title: 'Dashboard Overview',
        icon: 'ri-dashboard-line',
        breadcrumb: 'Dashboard',
      }
    }
    for (const section of MENU_ITEMS) {
      const match = section.subItems.find((item) =>
        pathname.startsWith(item.href)
      )

      if (match) {
        return {
          title: match.title,
          icon: match.icon,
          breadcrumb: `Dashboard / ${section.label} / ${match.label}`,
        }
      }
    }

    return {
      title: 'Dashboard',
      icon: 'ri-layout-grid-line',
      breadcrumb: 'Dashboard / Page',
    }
  }, [pathname])

  return (
    <div
      className={`fixed inset-0 flex h-screen w-full overflow-hidden bg-[#F8F8F8] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white ${inter.className}`}
    >
      <aside className="z-20 flex h-full w-72 shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white">
        <div className="shrink-0 p-8 pb-6">
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-neutral-200">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-neutral-900 font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <h3 className="truncate text-lg leading-tight font-bold text-neutral-900">
                {user?.name || 'John Doe'}
              </h3>
              <p className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase">
                Premium Member
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className={`h-9 w-full rounded-sm border-neutral-200 text-xs font-bold tracking-wider uppercase transition-all ${pathname === '/account/profile' ? 'border-neutral-900 bg-neutral-900 text-white' : 'hover:bg-neutral-50 hover:text-black'} `}
            >
              <Link href="/account/profile">
                <i className="ri-settings-3-line mr-2 text-sm"></i> Profile
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className={`h-9 w-full rounded-sm border-neutral-200 text-xs font-bold tracking-wider uppercase transition-all ${pathname === '/account/billing' ? 'border-neutral-900 bg-neutral-900 text-white' : 'hover:bg-neutral-50 hover:text-black'} `}
            >
              <Link href="/account/billing">
                <i className="ri-wallet-3-line mr-2 text-sm"></i> Billing
              </Link>
            </Button>
          </div>
        </div>

        <div className="shrink-0 px-8">
          <Separator className="bg-neutral-100" />
        </div>

        <div className="min-h-0 w-full flex-1">
          <ScrollArea className="h-full w-full px-4 py-6">
            <div className="w-full space-y-2">
              <Button
                asChild
                variant="ghost"
                className={`group h-11 w-full justify-start rounded-sm px-3 transition-all duration-200 ${pathname === '/dashboard'
                  ? 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 hover:text-white'
                  : 'text-neutral-800 hover:bg-neutral-50'
                  } `}
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <i
                    className={`ri-dashboard-line text-lg ${pathname === '/dashboard' ? 'text-white' : 'text-neutral-500 group-hover:text-black'}`}
                  ></i>
                  <span
                    className={`text-base tracking-tight ${pathname === '/dashboard' ? 'font-bold' : 'font-medium'}`}
                  >
                    Dashboard
                  </span>
                </Link>
              </Button>

              <Accordion
                type="multiple"
                value={openItems}
                onValueChange={setOpenItems}
                className="w-full space-y-2"
              >
                {MENU_ITEMS.map((section) => {
                  const isSectionActive = section.subItems.some((item) =>
                    pathname.startsWith(item.href)
                  )
                  return (
                    <AccordionItem
                      key={section.id}
                      value={section.id}
                      className="border-b-0"
                    >
                      {/* SỬA ĐỔI TẠI ĐÂY: Thêm caption bên dưới label */}
                      <AccordionTrigger className="group h-auto min-h-[44px] rounded-sm px-3 py-3 transition-colors hover:bg-neutral-50 hover:no-underline data-[state=open]:bg-neutral-50">
                        <div className="flex items-center gap-3 text-left text-neutral-800">
                          <span
                            className={`flex-shrink-0 transition-colors ${isSectionActive ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}
                          >
                            <i className={`${section.icon} text-lg`}></i>
                          </span>
                          <div className="flex flex-col">
                            <span
                              className={`mb-1 text-base leading-none font-medium tracking-tight ${isSectionActive ? 'font-bold text-black' : ''}`}
                            >
                              {section.label}
                            </span>
                            <span className="text-[10px] leading-tight font-normal text-neutral-400">
                              {section.caption}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-0 pt-1 pb-2">
                        <div className="ml-3 space-y-1 border-l border-neutral-200 py-1 pl-3">
                          {section.subItems.map((item, idx) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                              <Button
                                key={idx}
                                asChild
                                variant="ghost"
                                className={`h-9 w-full justify-start gap-3 rounded-md px-3 text-sm transition-all duration-200 ${isActive
                                  ? 'bg-neutral-900 font-bold text-white shadow-sm hover:bg-neutral-800 hover:text-white'
                                  : 'font-normal text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                                  } `}
                              >
                                <Link href={item.href}>
                                  <i
                                    className={`${item.icon} text-base ${isActive ? 'opacity-100' : 'opacity-70'}`}
                                  ></i>
                                  <span className="tracking-wide">
                                    {item.label}
                                  </span>
                                </Link>
                              </Button>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </ScrollArea>
        </div>

        <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
          <div className="space-y-3 rounded-sm border border-neutral-200 bg-neutral-50 p-4">
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Need Helps?
              </h4>
            </div>
            <div className="space-y-2 border-t border-neutral-200/50 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-400">
                  <i className="ri-mail-line text-[10px]"></i>
                </div>
                <span>info@vgcnews24.com</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-400">
                  <i className="ri-phone-line text-[10px]"></i>
                </div>
                <span>+1 (678) 679-2347</span>
              </div>

              <Link
                href="/privacy-policy"
                className="flex items-center gap-2 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-sm border border-blue-200 bg-white text-blue-600">
                  <i className="ri-shield-check-line text-[10px]"></i>
                </div>
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#F8F8F8]">
        <header className="z-10 flex h-20 shrink-0 flex-col justify-center border-b border-neutral-200 bg-white px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
              <i
                className={`${activePageInfo.icon} text-xl text-neutral-700`}
              ></i>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {activePageInfo.title}
            </h1>
          </div>
          <div className="mt-1 text-xs font-medium text-neutral-500">
            {activePageInfo.breadcrumb}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth p-8">
          <div className="mx-auto max-w-7xl pb-10">
            <AdsProvider>
              {children}
            </AdsProvider>
          </div>
        </div>
      </main>
    </div>
  )
}
