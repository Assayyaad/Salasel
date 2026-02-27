import { allLanguages } from '@/app/static'

export interface HomeParams {
  lang: string
}

export async function generateStaticParams(): Promise<HomeParams[]> {
  const params: HomeParams[] = []

  // Generate params for each language
  for (const l of allLanguages) {
    params.push({ lang: l.code })
  }

  return params
}
