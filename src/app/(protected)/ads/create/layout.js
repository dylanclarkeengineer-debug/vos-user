import React from 'react'

export const metadata = {
  title: 'Create Ad Dashboard',
  description:
    'Create your own ads to reach a wider audience and grow your presence.',
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

export default function AdsCreateLayout({ children }) {
  return <>{children}</>
}
