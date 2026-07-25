import type { Manga, Chapter, ChapterPages, Tag } from '@/types/manga'

const BASE_URL = 'https://api.jikan.moe/v4'

export interface JikanManga {
  mal_id: number
  title: string
  title_english: string | null
  title_japanese: string | null
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  status: string
  chapters: number | null
  volumes: number | null
  score: number | null
  synopsis: string | null
  genres: { mal_id: number; name: string }[]
  authors: { mal_id: number; name: string }[]
  published: {
    from: string | null
    to: string | null
    string: string
  }
  publishing: boolean
  type: string
}

export interface JikanChapter {
  mal_id: number
  chapter: number | null
  title: string
  volume: string | null
  publishedAt: string
}

function jikanToManga(jikan: JikanManga): Manga {
  return {
    id: String(jikan.mal_id),
    type: 'manga',
    attributes: {
      title: { en: jikan.title_english || jikan.title },
      altTitles: jikan.title_japanese ? [{ ja: jikan.title_japanese }] : [],
      description: { en: jikan.synopsis || '' },
      status: jikan.status?.toLowerCase() as any,
      year: jikan.published?.from ? new Date(jikan.published.from).getFullYear() : null,
      contentRating: 'safe',
      tags: jikan.genres.map(g => ({
        id: String(g.mal_id),
        type: 'tag' as const,
        attributes: {
          name: { en: g.name },
          description: {},
          group: 'genre' as const,
          version: 1,
        },
      })),
      originalLanguage: '',
      lastChapter: jikan.chapters ? String(jikan.chapters) : null,
      lastVolume: jikan.volumes ? String(jikan.volumes) : null,
      chapterNumbersReset: false,
      linkedChapters: [],
      createdAt: jikan.published?.from || '',
      updatedAt: jikan.published?.from || '',
      state: 'published',
    },
    relationships: [
      {
        id: String(jikan.mal_id),
        type: 'cover_art' as const,
        attributes: { fileName: jikan.images.jpg.large_image_url } as any,
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
  const searchParams = new URLSearchParams()
  if (params.title) searchParams.append('q', params.title)
  if (params.limit) searchParams.append('limit', String(params.limit))
  if (params.offset) searchParams.append('offset', String(params.offset))

  const res = await fetch(`${BASE_URL}/manga?${searchParams}`)
  const data = await res.json()
  return data.data.map(jikanToManga)
}

export async function fetchTrendingManga(limit = 10): Promise<Manga[]> {
  const res = await fetch(`${BASE_URL}/manga?order=scoring&limit=${limit}&sort=desc&filter=ready`)
  const data = await res.json()
  return data.data.map(jikanToManga)
}

export async function fetchMangaById(id: string): Promise<Manga> {
  const res = await fetch(`${BASE_URL}/manga/${id}`)
  const data = await res.json()
  return jikanToManga(data.data)
}

export async function fetchMangaChapters(mangaId: string, options?: {
  limit?: number
  offset?: number
  order?: Record<string, string>
}): Promise<Chapter[]> {
  const res = await fetch(`${BASE_URL}/manga/${mangaId}/chapters?page=1`)
  const data = await res.json()

  return (data.data || []).map((ch: JikanChapter) => ({
    id: `${mangaId}-${ch.mal_id}`,
    type: 'chapter',
    attributes: {
      volume: ch.volume,
      chapter: ch.chapter ? String(ch.chapter) : '?',
      title: ch.title,
      translatedLanguage: 'en',
      originalLanguage: '',
      external: null,
      publishAt: ch.publishedAt,
      readableAt: ch.publishedAt,
      createdAt: ch.publishedAt,
      updatedAt: ch.publishedAt,
      pages: 0,
      version: 1,
    },
    relationships: [],
  }))
}

export async function fetchChapterPages(chapterId: string): Promise<ChapterPages> {
  const [mangaId, chapterMalId] = chapterId.split('-')
  if (!mangaId || !chapterMalId) {
    throw new Error('Invalid chapter ID format')
  }

  const res = await fetch(`${BASE_URL}/manga/${mangaId}/chapters`)
  const data = await res.json()

  const chapter = data.data?.find((ch: JikanChapter) => String(ch.mal_id) === chapterMalId)
  if (!chapter) {
    return {
      result: 'ok',
      baseUrl: '',
      chapter: { hash: '', data: [], dataSaver: [] },
    }
  }

  return {
    result: 'ok',
    baseUrl: 'https://cdn.myanimelist.net',
    chapter: {
      hash: '',
      data: [],
      dataSaver: [],
    },
  }
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/manga/genres`)
  const data = await res.json()
  return (data.data || []).map((g: { mal_id: number; name: string }) => ({
    id: String(g.mal_id),
    type: 'tag' as const,
    attributes: {
      name: { en: g.name },
      description: {},
      group: 'genre' as const,
      version: 1,
    },
  }))
}

export async function fetchSearchSuggestions(query: string): Promise<Manga[]> {
  if (!query || query.length < 2) return []
  const res = await fetch(`${BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=8&filter=ready`)
  const data = await res.json()
  return data.data.map(jikanToManga)
}

export function buildCoverUrl(mangaId: string, _coverId: string, filename: string): string {
  return filename
}
