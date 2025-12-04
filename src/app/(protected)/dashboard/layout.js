import React from 'react'

export const metadata = {
  title: 'Dashboard Overview - VGC System',
  description:
    'Manage your community presence and analytics from your dashboard.',
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
