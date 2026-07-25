'use client'

import { useTrendingManga, usePopularManga } from '@/lib/hooks/useManga'
import { Navbar } from '@/components/layout/navbar'
import { SearchBar } from '@/components/manga/search-bar'
import { MangaCard } from '@/components/manga/manga-card'
import { MangaCardSkeleton } from '@/components/ui/skeleton'
import { TrendingUp, Sparkles } from 'lucide-react'
import type { Manga } from '@/types/manga'
import { AdsterraNativeBanner } from '@/components/ads/AdsterraNativeBanner'

export default function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useTrendingManga(12)
  const { data: popular, isLoading: popularLoading } = usePopularManga()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Read Manga <span className="text-accent">Online</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            Discover and read your favorite manga with a beautiful, modern experience.
          </p>
          <div className="max-w-xl mx-auto relative">
            <SearchBar />
          </div>
        </section>

        {/* Trending Now */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <MangaCardSkeleton key={i} />
              ))}
            </div>
          ) : trending && trending.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {trending.map((manga: Manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <p>Unable to load trending manga.</p>
            </div>
          )}
        </section>

        {/* Ad Banner */}
        <AdsterraNativeBanner />

        {/* Popular Series */}
        <section className="mb-12 cursor-pointer">

          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Popular Series</h2>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <MangaCardSkeleton key={i} />
              ))}
            </div>
          ) : popular && popular.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {popular.map((manga: Manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <p>Unable to load popular series.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
