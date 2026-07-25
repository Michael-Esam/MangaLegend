const BASE_URL = 'https://mangahook-api.vercel.app'

export interface MangaHookManga {
  id: string
  image: string
  title: string
  chapter: string
  view: string
  description?: string
}

export interface MangaHookChapter {
  id: string
  path: string
  name: string
  view: string
  createdAt: string
}

export interface MangaHookMangaDetail {
  imageUrl: string
  name: string
  author: string
  status: string
  updated: string
  view: string
  genres: string[]
  chapterList: MangaHookChapter[]
}

export interface MangaHookChapterPages {
  title: string
  currentChapter: string
  chapterListIds: { id: string; name: string }[]
  images: { title: string; image: string }[]
}

export interface MangaHookMetaData {
  totalStories: number
  totalPages: number
  type: { id: string; type: string }[]
  state: { id: string; type: string }[]
  category: { id: string; type: string }[]
}

export interface MangaHookListResponse {
  mangaList: MangaHookManga[]
  metaData: MangaHookMetaData
}

export interface MangaHookSearchResponse {
  mangaList: { id: string; image: string; title: string }[]
  metaData: { totalPages: number }
}

// Transform MangaHook to internal format
export function transformManga(manga: MangaHookManga) {
  return {
    id: manga.id,
    type: 'manga' as const,
    attributes: {
      title: { en: manga.title },
      altTitles: [],
      description: { en: manga.description || '' },
      status: 'ongoing' as const,
      year: null,
      contentRating: 'safe' as const,
      tags: [],
      originalLanguage: '',
      lastChapter: null,
      lastVolume: null,
      chapterNumbersReset: false,
      linkedChapters: [],
      createdAt: '',
      updatedAt: '',
      state: 'published' as const,
    },
    relationships: [
      {
        id: manga.id,
        type: 'cover_art' as const,
        attributes: { fileName: manga.image } as any,
      },
    ],
  }
}

export async function fetchMangaList(options?: {
  page?: number
  category?: string
  type?: 'newest' | 'latest' | 'topview'
  state?: string
  limit?: number
}): Promise<MangaHookListResponse> {
  const params = new URLSearchParams()
  if (options?.page) params.append('page', String(options.page))
  if (options?.category) params.append('category', options.category)
  if (options?.type) params.append('type', options.type)
  if (options?.state) params.append('state', options.state)

  const res = await fetch(`${BASE_URL}/api/mangaList?${params}`)
  if (!res.ok) throw new Error(`MangaHook API error: ${res.status}`)
  return res.json()
}

export async function fetchSearchManga(query: string, page = 1): Promise<MangaHookSearchResponse> {
  const res = await fetch(`${BASE_URL}/api/search/${encodeURIComponent(query)}?page=${page}`)
  if (!res.ok) throw new Error(`MangaHook API error: ${res.status}`)
  return res.json()
}

export async function fetchMangaById(id: string): Promise<MangaHookMangaDetail> {
  const res = await fetch(`${BASE_URL}/api/manga/${id}`)
  if (!res.ok) throw new Error(`MangaHook API error: ${res.status}`)
  return res.json()
}

export async function fetchChapterPages(mangaId: string, chapterId: string): Promise<MangaHookChapterPages> {
  const res = await fetch(`${BASE_URL}/api/manga/${mangaId}/${chapterId}`)
  if (!res.ok) throw new Error(`MangaHook API error: ${res.status}`)
  return res.json()
}
