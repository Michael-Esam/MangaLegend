import { fetchTags } from '@/lib/api'
import type { Tag } from '@/types/manga'

export interface GenreInfo {
  id: string
  name: string
  slug: string
}

export function slugifyGenre(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getSupportedGenres(): Promise<GenreInfo[]> {
  const tags = await fetchTags()
  const genreTags = tags.filter((t: Tag) => t.attributes?.group === 'genre')
  return genreTags
    .map((t: Tag) => {
      const name = t.attributes?.name?.en || Object.values(t.attributes?.name || {})[0] || ''
      return {
        id: t.id,
        name,
        slug: slugifyGenre(name),
      }
    })
    .filter((g: GenreInfo) => g.name && g.slug)
}

export async function getGenreBySlug(slug: string): Promise<GenreInfo | null> {
  const decoded = decodeURIComponent(slug)
  const normalizedSlug = slugifyGenre(decoded)
  const genres = await getSupportedGenres()
  return genres.find((g: GenreInfo) => g.slug === normalizedSlug) || null
}
