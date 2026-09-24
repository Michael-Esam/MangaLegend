import type { Metadata } from 'next'
import { MangaDetailContent } from '@/components/manga/manga-detail-content'
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd } from '@/lib/seo'

interface MangaPageProps {
  params: { id: string }
}

async function getMangaInfo(rawId: string) {
  const cleanId = rawId.split('/')[0]
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId)

  try {
    if (isUuid) {
      const res = await fetch(
        `https://api.mangadex.org/manga/${cleanId}?includes[]=cover_art&includes[]=author`,
        { next: { revalidate: 600 } }
      )
      if (res.ok) {
        const data = await res.json()
        const rawManga = data.data
        const title =
          rawManga.attributes?.title?.en ||
          Object.values(rawManga.attributes?.title || {})[0] ||
          'Manga'
        const description = rawManga.attributes?.description?.en || ''
        const coverFile = rawManga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName
        const coverUrl = coverFile ? `https://uploads.mangadex.org/covers/${cleanId}/${coverFile}` : ''
        return { id: cleanId, title, description, coverUrl }
      }
    }

    const res = await fetch(`https://consumet-api-rouge.vercel.app/manga/mangapill/info?id=${cleanId}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      const title = data.title || 'Manga'
      const description = data.description || ''
      const coverUrl = data.image || `https://cdn.readdetectiveconan.com/file/mangapill/i/${cleanId}.jpeg`
      return { id: cleanId, title, description, coverUrl }
    }
  } catch {
    // Fallback if fetch fails
  }

  return {
    id: cleanId,
    title: 'Manga Detail',
    description: 'Read your favorite manga online for free on MangaLegends.',
    coverUrl: '',
  }
}

export async function generateMetadata({ params }: MangaPageProps): Promise<Metadata> {
  const cleanId = params.id.split('/')[0]
  const manga = await getMangaInfo(params.id)
  const canonicalUrl = `${SITE_CONFIG.url}/manga/${cleanId}`
  const pageTitle = `${manga.title} Manga`
  const metaDescription =
    manga.description && manga.description.length > 10
      ? manga.description.slice(0, 160).trim()
      : `Read ${manga.title} manga online for free on MangaLegends. High quality chapter updates.`

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
      images: manga.coverUrl
        ? [
            {
              url: manga.coverUrl,
              alt: manga.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
      images: manga.coverUrl ? [manga.coverUrl] : undefined,
    },
  }
}

export default async function MangaPage({ params }: MangaPageProps) {
  const cleanId = params.id.split('/')[0]
  const manga = await getMangaInfo(params.id)
  const canonicalUrl = `${SITE_CONFIG.url}/manga/${cleanId}`

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: manga.title, url: `/manga/${cleanId}` },
  ])

  const webPageJsonLd = generateWebPageJsonLd({
    name: `${manga.title} Manga`,
    description: manga.description || `Read ${manga.title} online`,
    url: canonicalUrl,
    image: manga.coverUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <MangaDetailContent id={params.id} />
    </>
  )
}
