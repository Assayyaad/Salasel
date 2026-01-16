import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./shared/components/NavBar";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
  description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
  abstract: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
  alternates: {
    languages: {
      ar: '/',
    },
  },
  appleWebApp: {
    title: 'سلاسل',
  },
  applicationName: 'سلاسل',
  metadataBase: new URL('https://salasel.app'),
  category: 'Education',
  classification: 'Education',
  icons: {
    icon: '/img/logo.webp',
    apple: '/img/logo.webp',
  },
  manifest: '/manifest.json',
  keywords: [],
  openGraph: {
    title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
    description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
    url: 'https://salasel.app/',
    siteName: 'سلاسل',
    type: 'website',
    locale: 'ar',
  },
  robots: {
    'index': true,
    'follow': true,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    'max-snippet': -1,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
    description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
    site: '@SalaselApp',
  },
  other: {
    'preconnect': [
      'https://img.youtube.com',
      'https://youtube.com',
      'https://www.youtube.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'dns-prefetch': [
      '//img.youtube.com',
      '//youtube.com',
      '//www.youtube.com',
      '//fonts.googleapis.com',
      '//fonts.gstatic.com',
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#2e4b2c',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
