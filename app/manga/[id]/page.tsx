'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { MangaHeader } from '@/components/manga/manga-header'
import { ChapterList } from '@/components/manga/chapter-list'
import { MangaCard } from '@/components/manga/manga-card'
import { MangaCardSkeleton } from '@/components/ui/skeleton'
import { useManga, useMangaChapters, useTrendingManga } from '@/lib/hooks/useManga'
import { Skeleton } from '@/components/ui/skeleton'
import type { Manga } from '@/types/manga'

interface MangaPageProps {
  params: { id: string }
}

export default function MangaPage({ params }: MangaPageProps) {
  const { id } = params
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

  const relatedManga = trending?.filter((m: { id: string }) => m.id !== id).slice(0, 5) || []
  const firstChapterId = chapters?.[0]?.id

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <MangaHeader manga={manga} firstChapterId={firstChapterId} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Chapters</h2>
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
