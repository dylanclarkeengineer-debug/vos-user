import React from 'react'

export const metadata = {
  title: 'Ads Dashboard - Manage Your Community Presence',
  description:
    'Access and manage your advertisements within the community dashboard. Monitor performance, edit listings, and optimize your ad strategy all in one place.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function DashboardLayout({ children }) {
  return <>{children}</>
}
