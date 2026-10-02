import type { Metadata } from 'next'
import { MangaDetailContent } from '@/components/manga/manga-detail-content'
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd } from '@/lib/seo'
import type { Manga, Chapter } from '@/types/manga'

interface MangaPageProps {
  params: { id: string }
}

async function getMangaInfo(rawId: string) {
  const cleanId = rawId.split('/')[0]
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId)

  try {
    if (isUuid) {
      const [mangaRes, feedRes] = await Promise.all([
        fetch(`https://api.mangadex.org/manga/${cleanId}?includes[]=cover_art&includes[]=author&includes[]=artist`, {
          next: { revalidate: 600 },
        }),
        fetch(`https://api.mangadex.org/manga/${cleanId}/feed?limit=96&translatedLanguage[]=en&order[chapter]=desc`, {
          next: { revalidate: 300 },
        }),
      ])

      if (mangaRes.ok) {
        const mangaData = await mangaRes.json()
        const feedData = feedRes.ok ? await feedRes.json() : { data: [] }
        const rawManga = mangaData.data
        const rawFeed = feedData.data || []

        const title =
          rawManga.attributes?.title?.en ||
          Object.values(rawManga.attributes?.title || {})[0] ||
          'Manga'
        const description = rawManga.attributes?.description?.en || ''
        const coverFile = rawManga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName
        const coverUrl = coverFile ? `https://uploads.mangadex.org/covers/${cleanId}/${coverFile}` : ''

        const chapters: Chapter[] = rawFeed.map((ch: any) => ({
          id: ch.id.split('/')[0],
          type: 'chapter' as const,
          attributes: {
            volume: ch.attributes?.volume || null,
            chapter: ch.attributes?.chapter || null,
            title: ch.attributes?.title ? `Ch. ${ch.attributes.chapter || ''} - ${ch.attributes.title}` : `Chapter ${ch.attributes?.chapter || ''}`,
            translatedLanguage: 'en',
            originalLanguage: '',
            external: null,
            publishAt: '',
            readableAt: '',
            createdAt: '',
            updatedAt: '',
            pages: 0,
            version: 1,
          },
          relationships: [{ id: cleanId, type: 'manga' as const }],
        }))

        const initialManga: Manga = {
          id: cleanId,
          type: 'manga' as const,
          attributes: {
            ...rawManga.attributes,
            title: { en: title },
            description: { en: description },
          },
          relationships: rawManga.relationships || [
            {
              id: cleanId,
              type: 'cover_art' as const,
              attributes: { fileName: coverUrl } as any,
            },
          ],
        }

        return { id: cleanId, title, description, coverUrl, initialManga, chapters }
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

      const chapters: Chapter[] = (data.chapters || []).map((ch: any) => ({
        id: String(ch.id).split('/')[0],
        type: 'chapter' as const,
        attributes: {
          volume: null,
          chapter: ch.chapter || null,
          title: ch.title,
          translatedLanguage: 'en',
          originalLanguage: '',
          external: null,
          publishAt: '',
          readableAt: '',
          createdAt: '',
          updatedAt: '',
          pages: 0,
          version: 1,
        },
        relationships: [{ id: cleanId, type: 'manga' as const }],
      }))

      const initialManga: Manga = {
        id: cleanId,
        type: 'manga' as const,
        attributes: {
          title: { en: title },
          altTitles: (data.altTitles || []).map((t: string) => ({ en: t })),
          description: { en: description },
          status: (data.status?.toLowerCase() || 'ongoing') as any,
          year: data.releaseDate ? parseInt(data.releaseDate) || null : null,
          contentRating: 'safe',
          tags: (data.genres || []).filter(Boolean).map((g: string) => ({
            id: g.toLowerCase().replace(/\s+/g, '-'),
            type: 'tag' as const,
            attributes: {
              name: { en: g },
              description: {},
              group: 'genre' as const,
              version: 1,
            },
          })),
          originalLanguage: '',
          lastChapter: data.chapters?.[0]?.title || null,
          lastVolume: null,
          chapterNumbersReset: false,
          linkedChapters: [],
          createdAt: '',
          updatedAt: '',
          state: 'published',
        },
        relationships: [
          {
            id: cleanId,
            type: 'cover_art' as const,
            attributes: { fileName: coverUrl } as any,
          },
        ],
      }

      return { id: cleanId, title, description, coverUrl, initialManga, chapters }
    }
  } catch {
    // Fallback if fetch fails
  }

  return {
    id: cleanId,
    title: 'Manga Detail',
    description: 'Read your favorite manga online for free on MangaLegends.',
    coverUrl: '',
    initialManga: undefined,
    chapters: [],
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
      <MangaDetailContent
        id={params.id}
        initialManga={manga.initialManga}
        initialChapters={manga.chapters}
      />
    </>
  )
}

