import React from 'react'

export const metadata = {
  title: 'Business Dashboard - Manage Your Community',
  description:
    'Manage your business presence and analytics from your dashboard.',
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

export default function BusinessListLayout({ children }) {
  return <>{children}</>
}
