import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

export { metadata, viewport } from './static'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<Readonly<RootLayoutProps>> = ({ children }) => {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}

export default RootLayout
