'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { MangaCard } from '@/components/manga/manga-card'
import { useManga, useMangaSearch } from '@/lib/hooks/useManga'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Heart, Bookmark } from 'lucide-react'

export default function LibraryPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'favorites' | 'bookmarks'>('favorites')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'))
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') || '[]'))
    }
  }, [])

  const renderMangaList = (ids: string[]) => {
    if (ids.length === 0) {
      const emptyMessage = activeTab === 'favorites' ? 'No favorites yet' : 'No bookmarks yet'
      const emptyHint = activeTab === 'favorites'
        ? 'Click the heart button on any manga to add it here.'
        : 'Click the bookmark button on any manga to save it here.'

      return (
        <div className="text-center py-20">
          {activeTab === 'favorites' ? (
            <Heart size={48} className="mx-auto text-text-muted mb-4" />
          ) : (
            <Bookmark size={48} className="mx-auto text-text-muted mb-4" />
          )}
          <h2 className="text-xl font-semibold mb-2">{emptyMessage}</h2>
          <p className="text-text-muted">{emptyHint}</p>
          <Link href="/search" className="inline-block mt-4 text-accent hover:underline">
            Browse Manga
          </Link>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {ids.map((id) => (
          <MangaCardWrapper key={id} mangaId={id} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">My Library</h1>

        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Heart size={16} className="inline mr-2" />
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bookmark size={16} className="inline mr-2" />
            Bookmarks ({bookmarks.length})
          </button>
        </div>

        {renderMangaList(activeTab === 'favorites' ? favorites : bookmarks)}
      </main>
    </div>
  )
}

function MangaCardWrapper({ mangaId }: { mangaId: string }) {
  const { data: manga, isLoading } = useManga(mangaId)

  if (isLoading || !manga) {
    return <Skeleton className="aspect-[3/4]" />
  }

  return <MangaCard manga={manga} />
}