'use client'

import { useQuery } from '@tanstack/react-query'
import type { Manga } from '@/types/manga'

interface ConsumetManga {
  id: string
  title: string
  altTitles?: string[]
  image?: string
  status?: string
  genres?: string[]
  chapters?: ConsumetChapter[]
  description?: string
  releaseDate?: string
}

interface ConsumetChapter {
  id: string
  title: string
  chapter?: string
  mangaId: string
}

function consumetToManga(consumet: any): Manga {
  if (consumet && consumet.type === 'manga') {
    return consumet as Manga
  }

  // Normalize ID: Consumet often returns "2009/slug-title", keep only the numeric part
  const cleanId = consumet.id ? consumet.id.split('/')[0] : ''
  const coverImage = consumet.image || ''

  let year: number | null = null
  if (consumet.releaseDate) {
    const parsed = parseInt(consumet.releaseDate)
    if (!isNaN(parsed)) year = parsed
  }

  return {
    id: cleanId,
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
        id: cleanId,
        type: 'cover_art' as const,
        attributes: { fileName: coverImage } as any,
      },
    ],
  }
}

export function useTrendingManga(limit = 12) {
  return useQuery({
    queryKey: ['trending-manga', limit],
    queryFn: async () => {
      const res = await fetch('/api/trending')
      const data = await res.json()
      const results = Array.isArray(data) ? data : (data.results || [])
      return (results.slice(0, limit)).map(consumetToManga)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function usePopularManga() {
  return useQuery({
    queryKey: ['popular-manga'],
    queryFn: async () => {
      const res = await fetch('/api/popular')
      const data = await res.json()
      const results = Array.isArray(data) ? data : (data.results || [])
      // MangaDex data already has type: 'manga', consumetToManga passes it through
      return results.map(consumetToManga)
    },
    staleTime: 60 * 60 * 1000,
  })
}


export function useMangaSearch(params: {
  title?: string
  tags?: string[]
  status?: string[]
  limit?: number
}) {
  return useQuery({
    queryKey: ['manga-search', params],
    queryFn: async () => {
      if (!params.title) return []
      const res = await fetch(`/api/search?q=${encodeURIComponent(params.title)}&limit=${params.limit || 20}`)
      const data = await res.json()
      return (data.results || []).map(consumetToManga)
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useManga(id: string) {
  return useQuery({
    queryKey: ['manga', id],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error('Manga not found')
      const data = await res.json()
      return consumetToManga(data)
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export function useMangaChapters(mangaId: string) {
  return useQuery({
    queryKey: ['manga-chapters', mangaId],
    queryFn: async () => {
      const res = await fetch(`/api/manga/${encodeURIComponent(mangaId)}`)
      if (!res.ok) return []
      const data = await res.json()
      return (data.chapters || []).map((ch: ConsumetChapter) => ({
        id: ch.id.split('/')[0],  // normalize: strip slug if present
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
    },
    enabled: !!mangaId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useChapterPages(chapterId: string, mangaId?: string) {
  return useQuery({
    queryKey: ['chapter-pages', chapterId, mangaId],
    queryFn: async () => {
      const mId = mangaId || ''
      const res = await fetch(`/api/chapter/${encodeURIComponent(chapterId)}?mangaId=${encodeURIComponent(mId)}`)
      const data = await res.json()
      return {
        result: 'ok' as const,
        baseUrl: '',
        chapter: {
          hash: '',
          data: Array.isArray(data)
            ? data.map((p: any) => typeof p === 'string' ? p : p.img)
            : [],
          dataSaver: [] as string[],
        },
      }
    },
    enabled: !!chapterId,
    staleTime: 30 * 60 * 1000,
  })
}

export function useReadingProgress(mangaId: string) {
  const getProgress = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(`reading-progress-${mangaId}`)
    return stored ? JSON.parse(stored) : null
  }

  const saveProgress = (chapterId: string, page: number) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(`reading-progress-${mangaId}`, JSON.stringify({
      chapterId,
      page,
      timestamp: Date.now(),
    }))
  }

  return { getProgress, saveProgress }
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => [],
    staleTime: 60 * 60 * 1000,
  })
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) return []
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
      const data = await res.json()
      return (data.results || []).map(consumetToManga)
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}
