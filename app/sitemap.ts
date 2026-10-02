import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'
import { getSupportedGenres } from '@/lib/genres'

const BASE_URL = SITE_CONFIG.url

// Verified famous manga IDs from existing app definitions
const FAMOUS_MANGA_IDS = [
  '2', '2085', '1', '4741', '723', '6681', '2285', '5751', '552', '3069',
  '938', '4524', '8136', '1063', '6', '1828', '3262', '524', '4143', '5085',
  '580', '1515', '1059', '8', '4', '3', '9', '2061', '4458', '5830',
  '7822', '5460', '5035', '651', '2816', '2035', '1390', '1166', '1206', '9471'
]

async function getMangaIds(): Promise<string[]> {
  const mangaIdSet = new Set<string>(FAMOUS_MANGA_IDS)

  try {
    const resConsumet = await fetch('https://consumet-api-rouge.vercel.app/manga/mangapill/popular', {
      next: { revalidate: 3600 },
    })
    if (resConsumet.ok) {
      const data = await resConsumet.json()
      const results = Array.isArray(data) ? data : (data.results || [])
      for (const item of results) {
        if (item?.id) {
          const cleanId = String(item.id).split('/')[0]
          if (cleanId) mangaIdSet.add(cleanId)
        }
      }
    }
  } catch {
    // Fallback set will be used if fetch fails
  }

  try {
    const resMangaDex = await fetch(
      'https://api.mangadex.org/manga?limit=30&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive',
      { next: { revalidate: 3600 } }
    )
    if (resMangaDex.ok) {
      const data = await resMangaDex.json()
      if (Array.isArray(data?.data)) {
        for (const manga of data.data) {
          if (manga?.id) {
            mangaIdSet.add(manga.id)
          }
        }
      }
    }
  } catch {
    // Fallback set will be used if fetch fails
  }

  return Array.from(mangaIdSet)
}

async function getChapterRoutes(mangaIds: string[]): Promise<MetadataRoute.Sitemap> {
  const chapterIdSet = new Set<string>()

  // Fetch chapters for manga IDs in small batches concurrently
  const BATCH_SIZE = 10
  for (let i = 0; i < mangaIds.length; i += BATCH_SIZE) {
    const batch = mangaIds.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (mangaId) => {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mangaId)

        try {
          if (isUuid) {
            const res = await fetch(
              `https://api.mangadex.org/manga/${mangaId}/feed?limit=100&translatedLanguage[]=en&order[chapter]=desc`,
              { next: { revalidate: 3600 } }
            )
            if (res.ok) {
              const data = await res.json()
              if (Array.isArray(data?.data)) {
                for (const ch of data.data) {
                  if (ch?.id) {
                    const cleanChapterId = String(ch.id).split('/')[0]
                    if (cleanChapterId) chapterIdSet.add(cleanChapterId)
                  }
                }
              }
            }
          } else {
            const res = await fetch(
              `https://consumet-api-rouge.vercel.app/manga/mangapill/info?id=${mangaId}`,
              { next: { revalidate: 3600 } }
            )
            if (res.ok) {
              const data = await res.json()
              if (Array.isArray(data?.chapters)) {
                for (const ch of data.chapters) {
                  if (ch?.id) {
                    const cleanChapterId = String(ch.id).split('/')[0]
                    if (cleanChapterId) chapterIdSet.add(cleanChapterId)
                  }
                }
              }
            }
          }
        } catch {
          // Ignore error for individual manga fetch
        }
      })
    )
  }

  const currentDate = new Date().toISOString()
  return Array.from(chapterIdSet).map((chapterId) => ({
    url: `${BASE_URL}/read/${chapterId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mangaIds = await getMangaIds()
  const genres = await getSupportedGenres()
  const chapterRoutes = await getChapterRoutes(mangaIds)
  const currentDate = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const genreRoutes: MetadataRoute.Sitemap = genres.map((g) => ({
    url: `${BASE_URL}/genre/${g.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const mangaRoutes: MetadataRoute.Sitemap = mangaIds.map((id) => ({
    url: `${BASE_URL}/manga/${id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  return [...staticRoutes, ...genreRoutes, ...mangaRoutes, ...chapterRoutes]
}
