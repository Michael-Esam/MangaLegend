'use client'

import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { MangaHeader } from '@/components/manga/manga-header'
import { ChapterList } from '@/components/manga/chapter-list'
import { MangaCard } from '@/components/manga/manga-card'
import { useManga, useMangaChapters, useTrendingManga } from '@/lib/hooks/useManga'
import { Skeleton } from '@/components/ui/skeleton'
import type { Manga, AuthorAttributes } from '@/types/manga'
import { getTitle, getDescription } from '@/lib/utils'
import { AdsterraNativeBanner } from '@/components/ads/AdsterraNativeBanner'

interface MangaDetailContentProps {
  id: string
}

export function MangaDetailContent({ id }: MangaDetailContentProps) {
  const { data: manga, isLoading: mangaLoading } = useManga(id)
  const { data: chapters, isLoading: chaptersLoading } = useMangaChapters(id)
  const { data: trending } = useTrendingManga(6)

  if (mangaLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            <div>
              <Skeleton className="w-48 md:w-56 aspect-[3/4]" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!manga) {
    notFound()
  }

  const title = getTitle(manga)
  const description = getDescription(manga)
  const authorRelation = manga.relationships?.find(r => r.type === 'author')
  const artistRelation = manga.relationships?.find(r => r.type === 'artist')
  const rawAuthor = (authorRelation?.attributes as AuthorAttributes | undefined)?.name
  const rawArtist = (artistRelation?.attributes as AuthorAttributes | undefined)?.name
  const author = rawAuthor && rawAuthor !== 'Unknown' ? rawAuthor : undefined
  const artist = rawArtist && rawArtist !== 'Unknown' ? rawArtist : undefined
  const genreTags = (manga.attributes?.tags || []).filter(t => t.attributes?.group === 'genre' || t.attributes?.group === 'theme')
  const genresList = genreTags.map(t => Object.values(t.attributes?.name || {})[0]).filter(Boolean)
  const genres = genresList.length > 0 ? genresList.join(', ') : undefined
  const status = manga.attributes?.status
  const chapterCount = chapters?.length

  const relatedManga = trending?.filter((m: { id: string }) => m.id !== id).slice(0, 5) || []

  // Find Chapter 1 (or the first chapter numerically) for Start Reading button
  const firstChapter =
    chapters?.find((ch: any) => ch.attributes?.chapter === '1' || ch.chapter === '1') ||
    chapters?.[chapters.length - 1] ||
    chapters?.[0]
  const firstChapterId = firstChapter?.id

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <MangaHeader manga={manga} firstChapterId={firstChapterId} />

        <AdsterraNativeBanner />

        <div className="mt-8 p-6 bg-surface rounded-xl border border-border space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">{title} Manga</h2>
          
          {description && description !== 'No description available' && (
            <p className="text-text-secondary leading-relaxed">{description}</p>
          )}

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm border-t border-border pt-4 text-text-secondary">
            {author && (
              <div>
                <span className="font-semibold text-text-primary">Author: </span>
                {author}
              </div>
            )}
            {artist && (
              <div>
                <span className="font-semibold text-text-primary">Artist: </span>
                {artist}
              </div>
            )}
            {genres && (
              <div>
                <span className="font-semibold text-text-primary">Genres: </span>
                {genres}
              </div>
            )}
            {status && (
              <div>
                <span className="font-semibold text-text-primary">Status: </span>
                <span className="capitalize">{status}</span>
              </div>
            )}
            {typeof chapterCount === 'number' && chapterCount > 0 && (
              <div>
                <span className="font-semibold text-text-primary">Chapters: </span>
                {chapterCount}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">{title} Chapters</h2>
            {chaptersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <ChapterList chapters={chapters || []} mangaId={id} />
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
            <div className="space-y-3">
              {relatedManga.map((m: Manga) => (
                <MangaCard key={m.id} manga={m} className="flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
