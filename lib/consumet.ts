import type { Manga, Chapter, ChapterPages, Tag } from '@/types/manga'

// Consumet API base URL
const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

export interface ConsumetManga {
  id: string
  title: string
  altTitles?: string[]
  image?: string
  status?: string
  genres?: string[]
  chapters?: ConsumetChapter[]
  description?: string
  author?: string
  rating?: string
  views?: string
  releaseDate?: string
}

export interface ConsumetChapter {
  id: string
  title: string
  chapter?: string
  mangaId: string
}

function consumetToManga(consumet: ConsumetManga): Manga {
  // Extract year from releaseDate if available
  let year: number | null = null
  if (consumet.releaseDate) {
    const parsed = parseInt(consumet.releaseDate)
    if (!isNaN(parsed)) year = parsed
  }

  return {
    id: consumet.id,
    type: 'manga',
    attributes: {
      title: { en: consumet.title },
      altTitles: (consumet.altTitles || []).map(t => ({ en: t })),
      description: { en: consumet.description || '' },
      status: (consumet.status?.toLowerCase() || 'ongoing') as any,
      year,
      contentRating: 'safe',
      tags: (consumet.genres || []).filter(g => g).map(g => ({
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
      lastChapter: consumet.chapters?.[0]?.title || null,
      lastVolume: null,
      chapterNumbersReset: false,
      linkedChapters: [],
      createdAt: '',
      updatedAt: '',
      state: 'published',
    },
    relationships: [
      {
        id: consumet.id,
        type: 'cover_art' as const,
        attributes: { fileName: consumet.image || '' } as any,
      },
    ],
  }
}

export async function fetchManga(params: {
  limit?: number
  offset?: number
  title?: string
  status?: string
  order?: Record<string, string>
}): Promise<Manga[]> {
  if (!params.title) return []
  const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/${encodeURIComponent(params.title)}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.results || []).map(consumetToManga)
}

export async function fetchTrendingManga(limit = 10): Promise<Manga[]> {
  const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/popular`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.slice(0, limit) || []).map(consumetToManga)
}

export async function fetchMangaById(id: string): Promise<Manga> {
  const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/info?id=${id}`)
  if (!res.ok) throw new Error('Manga not found')
  const data = await res.json()
  return consumetToManga(data)
}

export async function fetchMangaChapters(mangaId: string, options?: {
  limit?: number
  offset?: number
  order?: Record<string, string>
}): Promise<Chapter[]> {
  const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/info?id=${mangaId}`)
  if (!res.ok) return []
  const data = await res.json()

  return (data.chapters || []).map((ch: ConsumetChapter) => ({
    id: ch.id,
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
    relationships: [
      {
        id: mangaId,
        type: 'manga' as const,
      },
    ],
  }))
}

export async function fetchChapterPages(chapterId: string, mangaId: string): Promise<ChapterPages> {
  const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/read?chapterId=${chapterId}&mangaId=${mangaId}`)
  if (!res.ok) {
    return {
      result: 'ok',
      baseUrl: '',
      chapter: { hash: '', data: [], dataSaver: [] },
    }
  }
  const data = await res.json()
  // Mangapill returns array of { img, page } objects
  const pages = Array.isArray(data) ? data.map((p: { img: string; page?: number }) => p.img) : []
  return {
    result: 'ok',
    baseUrl: '',
    chapter: {
      hash: '',
      data: pages,
      dataSaver: pages,
    },
  }
}

export async function fetchTags(): Promise<Tag[]> {
  return []
}

export async function fetchSearchSuggestions(query: string): Promise<Manga[]> {
  if (!query || query.length < 2) return []
  return fetchManga({ title: query, limit: 8 })
}

export function buildCoverUrl(mangaId: string, coverId: string, filename: string): string {
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }
  return filename
}
