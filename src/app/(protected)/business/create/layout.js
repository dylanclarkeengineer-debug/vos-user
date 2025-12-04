import React from 'react'

export const metadata = {
  title: 'Business Create Dashboard',
  description: 'Create your own business to start your journey with us.',
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

export default function BusinessCreateLayout({ children }) {
  return <>{children}</>
}
