import type { Metadata } from 'next'
import type { Language, Translations } from '@/app/types'

import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { allLanguages, defaultLanguage, metadata } from '@/app/static'
import { getLanguage, getTranslations } from '@/app/translate'
import LanguageSwitcher from '@/app/shared/components/LanguageSwitcher'
import NotesInbox from '@/app/shared/components/NotesInbox'
import FeedbackWidget from '@/app/shared/components/FeedbackWidget'
import '@/app/globals.css'

export { viewport } from '@/app/static'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
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

  // Generate alternate language links for hreflang
  const baseUrl = 'https://salasel.app'
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `${baseUrl}/${l.code}`
      return acc
    },
    { 'x-default': `${baseUrl}/${defaultLanguage}` } as Record<string, string>,
  )

  return {
    ...metadata,
    title: t.appFullTitle,
    description: t.appDescription,
    alternates: {
      languages: langAlts,
    },
    appleWebApp: {
      title: t.appTitle,
    },
    applicationName: t.appTitle,
    openGraph: {
      title: t.appFullTitle,
      description: t.appDescription,
      url: `${baseUrl}/${currLang.code}`,
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
      images: [`${baseUrl}/img/logo.webp`],
    },
  }
}

const LanguageLayout: React.FC<Readonly<LanguageLayoutProps>> = async ({ children, params }) => {
  const { lang: langCode } = await params
  const lang = getLanguage(langCode)
  const t: Translations = getTranslations(langCode)

  return (
    <html lang={lang.code} dir={lang.dir}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotesInbox />
        <div className={`fixed top-3 z-50 ${lang.dir === 'rtl' ? 'left-4' : 'right-4'}`}>
          <LanguageSwitcher currentLang={lang.code} dir={lang.dir} />
        </div>
        {children}
        <FeedbackWidget t={t} lang={lang.code} />
      </body>
    </html>
  )
}

export default LanguageLayout
