// Example: Server Component using translations
import { getTranslations, getLanguage } from '@/app/translate'
import Link from 'next/link'

interface ExamplePageProps {
  params: {
    lang: string
  }
}

export default function ExamplePage({ params }: ExamplePageProps) {
  // Get translations for current language
  const t = getTranslations(params.lang)

  // Get language configuration
  const lang = getLanguage(params.lang)

  return (
    <div dir={lang.dir}>
      <h1>{t.appTitle}</h1>
      <p>{t.appDescription}</p>

      {/* Navigation with language prefix */}
      <nav>
        <Link href={`/${params.lang}/`}>{t.goBack}</Link>
      </nav>

      {/* Using content type translations */}
      <section>
        <h2>{t.filterContentTypeLabel}</h2>
        <ul>
          <li>{t.contents[0]}</li>
          <li>{t.contents[1]}</li>
          <li>{t.contents[2]}</li>
        </ul>
      </section>

      {/* Using presentation style translations */}
      <section>
        <h2>{t.filterPresentationStyleLabel}</h2>
        <ul>
          <li>{t.presentations[0]}</li>
          <li>{t.presentations[1]}</li>
          <li>{t.presentations[2]}</li>
          <li>{t.presentations[3]}</li>
        </ul>
      </section>

      {/* Common UI elements */}
      <div>
        <input placeholder={t.searchPlaceholder} />
        <button>{t.searchTab}</button>
      </div>

      {/* Loading state */}
      <p>{t.loading}</p>
    </div>
  )
}
