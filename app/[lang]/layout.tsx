import type { Metadata } from 'next'
import type { Language } from '@/app/types'

import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
import { allLanguages, defaultLanguage, metadata } from '@/app/static'
import { getLanguage } from '@/app/translate'
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations({ locale: lang })
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
    title: t('appFullTitle'),
    description: t('appDescription'),
    alternates: {
      languages: langAlts,
    },
    appleWebApp: {
      title: t('appTitle'),
    },
    applicationName: t('appTitle'),
    openGraph: {
      title: t('appFullTitle'),
      description: t('appDescription'),
      url: `${baseUrl}/${currLang.code}`,
      siteName: t('appTitle'),
      type: 'website',
      locale: currLang.code,
      alternateLocale: allLanguages.filter((l) => l.code !== currLang.code).map((l) => l.code),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('appFullTitle'),
      description: t('appDescription'),
      site: '@SalaselApp',
      images: [`${baseUrl}/img/logo.webp`],
    },
  }
}

const LanguageLayout: React.FC<Readonly<LanguageLayoutProps>> = async ({ children, params }) => {
  const { lang: langCode } = await params
  const lang = getLanguage(langCode)
  const messages = await getMessages()

  return (
    <html lang={lang.code} dir={lang.dir}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LanguageLayout
