import type { Metadata } from 'next'
import type { Language, Translations } from '@/app/types'

import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { allLanguages, metadata } from '@/app/static'
import { getLanguage, getTranslations } from '@/app/translate'
import '@/app/globals.css'

export { viewport } from '@/app/static'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export interface LanguageLayoutProps {
  children: React.ReactNode
  params: Promise<{
    lang: string
  }>
}

export async function generateStaticParams() {
  return allLanguages.map((l: Language) => ({
    lang: l.code,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t: Translations = getTranslations(lang)
  const currLang: Language = getLanguage(lang)

  return {
    ...metadata,
    title: t.appFullTitle,
    description: t.appDescription,
    appleWebApp: {
      title: t.appTitle,
    },
    applicationName: t.appTitle,
    openGraph: {
      title: t.appFullTitle,
      description: t.appDescription,
      url: `https://salasel.app/${currLang.code}`,
      siteName: t.appTitle,
      type: 'website',
      locale: currLang.code,
      alternateLocale: allLanguages.filter((l) => l.code !== currLang.code).map((l) => l.code),
    },
    twitter: {
      card: 'summary_large_image',
      title: t.appFullTitle,
      description: t.appDescription,
      site: '@SalaselApp',
    },
  }
}

const LanguageLayout: React.FC<Readonly<LanguageLayoutProps>> = async ({ children, params }) => {
  const { lang: langCode } = await params
  const lang = getLanguage(langCode)

  return (
    <html lang={lang.code} dir={lang.dir}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}

export default LanguageLayout
