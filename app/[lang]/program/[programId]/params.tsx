import { getPrograms } from '@/app/db'
import { allLanguages } from '@/app/static'

export interface ProgramParams {
  lang: string
  programId: string
}

export function generateStaticParams(): ProgramParams[] {
  const programs = getPrograms()
  const params: ProgramParams[] = []

  for (const id in programs) {
    if (!Object.hasOwn(programs, id)) continue

    for (const l of allLanguages) {
      params.push({ lang: l.code, programId: id })
    }
  }

  return params
}
