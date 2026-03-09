import type { ProgramParams } from '@/app/[lang]/program/[programId]/params'

import React from 'react'
import ProgramHeader from '@/app/[lang]/program/[programId]/components/ProgramHeader'
import ProgramPlaylists from '@/app/[lang]/program/[programId]/components/ProgramPlaylists'
import { getProgram, getProgramPlaylists } from '@/app/db'
import { getTranslations } from '@/app/translate'

export { generateStaticParams } from '@/app/[lang]/program/[programId]/params'
export { generateMetadata } from '@/app/[lang]/program/[programId]/meta'

export const revalidate = 3600 // Revalidate every hour

export interface ProgramPageProps {
  params: Promise<ProgramParams>
}

const ProgramPage: React.FC<ProgramPageProps> = async ({ params }) => {
  const { lang, programId } = await params
  const t = getTranslations(lang)
  const program = getProgram(programId)

  if (!program) {
    return <div>{t.programNotFound}</div>
  }

  const playlists = getProgramPlaylists(programId)

  return (
    <>
      <ProgramHeader program={program} t={t} />
      <ProgramPlaylists playlists={playlists} lang={t.__language.code} t={t} />
    </>
  )
}

export default ProgramPage
