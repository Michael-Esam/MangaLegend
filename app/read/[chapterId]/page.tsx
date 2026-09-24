import type { Metadata } from 'next'
import { ChapterReaderContent } from '@/components/reader/chapter-reader-content'
import { SITE_CONFIG, generateBreadcrumbJsonLd } from '@/lib/seo'

interface ChapterPageProps {
  params: { chapterId: string }
  searchParams?: { mangaId?: string }
}

async function getMangaTitle(mangaId: string): Promise<string> {
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

export async function generateMetadata({ params, searchParams }: ChapterPageProps): Promise<Metadata> {
  const cleanChapterId = params.chapterId.split('/')[0]
  const canonicalUrl = `${SITE_CONFIG.url}/read/${cleanChapterId}`
  
  let mangaTitle = ''
  if (searchParams?.mangaId) {
    mangaTitle = await getMangaTitle(searchParams.mangaId)
  }

  const pageTitle = mangaTitle 
    ? `Read ${mangaTitle} Chapter ${cleanChapterId} Online Free`
    : `Read Chapter ${cleanChapterId} Online Free`

  const metaDescription = mangaTitle
    ? `Read ${mangaTitle} Chapter ${cleanChapterId} online in high quality for free on MangaLegends. Experience fast loading and custom reading views.`
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

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: `Chapter ${cleanChapterId}`, url: `/read/${cleanChapterId}` },
  ])

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
