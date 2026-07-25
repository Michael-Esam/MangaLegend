import type { Manga, Chapter, ChapterPages, Author, Cover, Tag } from '@/types/manga'

const BASE_URL = 'https://api.mangadex.org'

export function getCoverUrl(mangaId: string, coverId: string, filename: string): string {
  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}`
}

export function getChapterImageUrl(baseUrl: string, hash: string, filename: string): string {
  return `${baseUrl}/data/${hash}/${filename}`
}

export async function fetchManga(params: {
  limit?: number
  offset?: number
  title?: string
  authorOrArtist?: string
  tags?: string[]
  includedTags?: string[]
  excludedTags?: string[]
  status?: string[]
  originalLanguage?: string[]
  contentRating?: string[]
  order?: Record<string, string>
}): Promise<Manga[]> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v))
    } else if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const res = await fetch(`${BASE_URL}/manga?${searchParams}`, {
    next: { revalidate: 300 },
  })
  const data = await res.json()
  return data.data
}

export async function fetchTrendingManga(limit = 10): Promise<Manga[]> {
  const res = await fetch(
    `${BASE_URL}/manga?limit=${limit}&order[followedCount]=desc&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`,
    { next: { revalidate: 300 } }
  )
  const data = await res.json()
  return data.data
}

export async function fetchMangaById(id: string): Promise<Manga> {
  const res = await fetch(`${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`, {
    next: { revalidate: 600 },
  })
  const data = await res.json()
  return data.data
}

export async function fetchMangaChapters(mangaId: string, options?: {
  limit?: number
  offset?: number
  translatedLanguage?: string[]
  order?: Record<string, string>
}): Promise<Chapter[]> {
  const params = new URLSearchParams()
  const langs = options?.translatedLanguage || ['en']
  langs.forEach(l => params.append('translatedLanguage[]', l))
  if (options?.limit) params.append('limit', String(options.limit))
  if (options?.offset) params.append('offset', String(options.offset))
  if (options?.order) {
    Object.entries(options.order).forEach(([k, v]) => params.append(`order[${k}]`, v))
  } else {
    params.append('order[chapter]', 'desc')
  }

  const res = await fetch(`${BASE_URL}/manga/${mangaId}/feed?${params}&includes[]=scanlation_group`, {
    next: { revalidate: 300 },
  })
  const data = await res.json()
  return data.data
}

export async function fetchChapterPages(chapterId: string): Promise<ChapterPages> {
  const res = await fetch(`${BASE_URL}/at-home/server/${chapterId}`, {
    cache: 'force-cache',
  })
  const data = await res.json()
  return data
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tag`, { next: { revalidate: 3600 } })
  const data = await res.json()
  return data.data
}

export async function fetchSearchSuggestions(query: string): Promise<Manga[]> {
  if (!query || query.length < 2) return []
  const res = await fetch(
    `${BASE_URL}/manga?title=${encodeURIComponent(query)}&limit=8&contentRating[]=safe&contentRating[]=suggestive`
  )
  const data = await res.json()
  return data.data
}

export function buildCoverUrl(mangaId: string, coverId: string, filename: string, size: 'small' | 'original' = 'original'): string {
  // If filename is already a full URL (from another API like Jikan), use it directly
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }
  // Otherwise assume it's a MangaDex cover filename
  const suffix = size === 'small' ? 'data-s' : 'data'
  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}`
}
