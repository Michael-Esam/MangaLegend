'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { SearchBar } from '@/components/manga/search-bar'
import { MangaCard } from '@/components/manga/manga-card'
import { MangaCardSkeleton } from '@/components/ui/skeleton'
import { useMangaSearch } from '@/lib/hooks/useManga'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Manga } from '@/types/manga'

const STATUS_OPTIONS = ['ongoing', 'completed', 'hiatus', 'cancelled']

export function SearchContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: manga, isLoading } = useMangaSearch({
    title: searchQuery,
    status: selectedStatus.length > 0 ? selectedStatus : undefined,
    limit: 20,
  })

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <SearchBar className="relative" />
          </div>

          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </Button>

          <div className={cn('flex flex-wrap gap-2', !showFilters && 'hidden md:flex')}>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-full border transition-all',
                  selectedStatus.includes(status)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface border-border text-text-secondary hover:border-text-muted'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selectedStatus.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-text-muted">Filters:</span>
            {selectedStatus.map((status) => (
              <Badge key={status} variant="accent" className="gap-1">
                {status}
                <X size={12} className="cursor-pointer" onClick={() => toggleStatus(status)} />
              </Badge>
            ))}
            <button
              onClick={() => setSelectedStatus([])}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        ) : manga && manga.length > 0 ? (
          <>
            <p className="text-sm text-text-muted mb-4">{manga.length} results</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {manga.map((m: Manga) => (
                <MangaCard key={m.id} manga={m} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No manga found</p>
            <p className="text-text-muted text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
