import { Inter } from 'next/font/google'

import './globals.css'

import { AuthProvider } from '@/context/authContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VGC System',
  description:
    'A comprehensive system for your business needs, news, posts, and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
