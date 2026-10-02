import type { Metadata } from 'next'
import { ChapterReaderContent } from '@/components/reader/chapter-reader-content'
import { SITE_CONFIG, generateBreadcrumbJsonLd } from '@/lib/seo'

interface ChapterPageProps {
  params: { chapterId: string }
  searchParams?: { mangaId?: string }
}

interface ChapterContext {
  mangaId: string
  mangaTitle: string
  chapterNum: string
}

async function fetchMangaTitleById(mangaId: string): Promise<string> {
  const cleanId = mangaId.split('/')[0]
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId)

  try {
    if (isUuid) {
      const res = await fetch(`https://api.mangadex.org/manga/${cleanId}`, {
        next: { revalidate: 600 },
      })
      if (res.ok) {
        const data = await res.json()
        const rawManga = data.data
        return (
          rawManga?.attributes?.title?.en ||
          Object.values(rawManga?.attributes?.title || {})[0] ||
          ''
        )
      }
    }

    const res = await fetch(`https://consumet-api-rouge.vercel.app/manga/mangapill/info?id=${cleanId}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      return data.title || ''
    }
  } catch {
    // Fallback if fetch fails
  }

  return ''
}

async function getChapterContext(
  rawChapterId: string,
  searchParamsMangaId?: string
): Promise<ChapterContext> {
  const cleanChapterId = rawChapterId.split('/')[0]
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanChapterId)

  let mangaId = searchParamsMangaId || ''
  let mangaTitle = ''
  let chapterNum = cleanChapterId

  // 1. If chapterId is MangaDex UUID, query chapter details to get parent manga & chapter number
  if (isUuid) {
    try {
      const res = await fetch(`https://api.mangadex.org/chapter/${cleanChapterId}?includes[]=manga`, {
        next: { revalidate: 600 },
      })
      if (res.ok) {
        const data = await res.json()
        const chapterAttr = data.data?.attributes
        if (chapterAttr?.chapter) {
          chapterNum = chapterAttr.chapter
        }
        const mangaRel = data.data?.relationships?.find((r: any) => r.type === 'manga')
        if (mangaRel) {
          if (!mangaId) mangaId = mangaRel.id
          const titles = mangaRel.attributes?.title
          if (titles) {
            mangaTitle = titles.en || (Object.values(titles)[0] as string) || ''
          }
        }
      }
    } catch {
      // Ignore error, fallback logic handles remaining fields
    }
  }

  // 2. If mangaId is missing and chapterId is in format "mangaId-chapterId" (e.g. 2-11192000)
  if (!mangaId && cleanChapterId.includes('-')) {
    const candidateId = cleanChapterId.split('-')[0]
    if (/^\d+$/.test(candidateId)) {
      mangaId = candidateId
    }
  }

  // 3. If mangaId is known but mangaTitle not resolved yet, fetch title
  if (mangaId && !mangaTitle) {
    mangaTitle = await fetchMangaTitleById(mangaId)
  }

  return { mangaId, mangaTitle, chapterNum }
}

export async function generateMetadata({ params, searchParams }: ChapterPageProps): Promise<Metadata> {
  const cleanChapterId = params.chapterId.split('/')[0]
  const canonicalUrl = `${SITE_CONFIG.url}/read/${cleanChapterId}`
  
  const { mangaTitle, chapterNum } = await getChapterContext(params.chapterId, searchParams?.mangaId)

  const pageTitle = mangaTitle 
    ? `Read ${mangaTitle} Chapter ${chapterNum} Online Free`
    : `Read Chapter ${cleanChapterId} Online Free`

  const metaDescription = mangaTitle
    ? `Read ${mangaTitle} Chapter ${chapterNum} online in high quality for free on MangaLegends. Experience fast loading and custom reading views.`
    : `Read chapter ${cleanChapterId} online in high quality for free on MangaLegends. Experience fast loading and custom reading views.`

  return {
    title: pageTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
    },
    twitter: {
      card: 'summary',
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
    },
  }
}

export default async function ChapterPage({ params, searchParams }: ChapterPageProps) {
  const cleanChapterId = params.chapterId.split('/')[0]
  const { mangaId, mangaTitle, chapterNum } = await getChapterContext(params.chapterId, searchParams?.mangaId)

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
  ]

  if (mangaId && mangaTitle) {
    breadcrumbItems.push({ name: mangaTitle, url: `/manga/${mangaId}` })
  }

  const displayChapter = chapterNum && chapterNum !== cleanChapterId
    ? `Chapter ${chapterNum}`
    : `Chapter ${cleanChapterId}`

  breadcrumbItems.push({ name: displayChapter, url: `/read/${cleanChapterId}` })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterReaderContent chapterId={params.chapterId} />
    </>
  )
}

