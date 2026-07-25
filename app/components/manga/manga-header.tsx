'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Heart, Share2, Bookmark, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTitle, getDescription } from '@/lib/utils'
import { buildCoverUrl } from '@/lib/api'
import type { Manga, AuthorAttributes } from '@/types/manga'

interface MangaHeaderProps {
  manga: Manga
  firstChapterId?: string
}

export function MangaHeader({ manga, firstChapterId }: MangaHeaderProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
  const authorRelation = manga.relationships.find(r => r.type === 'author')
  const artistRelation = manga.relationships.find(r => r.type === 'artist')

  const rawCoverUrl = coverRelation?.attributes?.fileName
    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName)
    : '/placeholder-cover.png'
  const coverUrl = rawCoverUrl.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrl)}` : rawCoverUrl

  const title = getTitle(manga)
  const description = getDescription(manga)
  const author = (authorRelation?.attributes as AuthorAttributes | undefined)?.name || 'Unknown'
  const artist = (artistRelation?.attributes as AuthorAttributes | undefined)?.name
  const tags = manga.attributes.tags.filter(t => t.attributes.group === 'genre' || t.attributes.group === 'theme')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorited(favorites.includes(manga.id))
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
      setIsBookmarked(bookmarks.includes(manga.id))
    }
  }, [manga.id])

  const handleStartReading = () => {
    if (firstChapterId) {
      router.push(`/read/${firstChapterId}?mangaId=${manga.id}`)
    }
  }

  const handleToggleFavorite = () => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      let newFavorites
      if (isFavorited) {
        newFavorites = favorites.filter((id: string) => id !== manga.id)
      } else {
        newFavorites = [...favorites, manga.id]
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      setIsFavorited(!isFavorited)
    }
  }

  const handleToggleBookmark = () => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
      let newBookmarks
      if (isBookmarked) {
        newBookmarks = bookmarks.filter((id: string) => id !== manga.id)
      } else {
        newBookmarks = [...bookmarks, manga.id]
      }
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      setIsBookmarked(!isBookmarked)
    }
  }

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/manga/${manga.id.split('/')[0]}`
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Fallback
        prompt('Copy this link:', url)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
      <div className="mx-auto md:mx-0 w-48 md:w-full">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-border">
          <Image src={coverUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 192px, 200px" priority unoptimized />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
            <span>by {author}</span>
            {artist && author !== artist && (
              <span>artist: {artist}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">
            <Star size={12} className="mr-1" />
            {manga.attributes.rating?.toFixed(1) || 'N/A'}
          </Badge>
          <Badge variant="default" className="capitalize">
            {manga.attributes.status}
          </Badge>
          {manga.attributes.year && (
            <Badge variant="default">{manga.attributes.year}</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="default">
              {Object.values(tag.attributes.name)[0]}
            </Badge>
          ))}
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-text-secondary leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={handleStartReading} disabled={!firstChapterId}>
            Start Reading
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleToggleFavorite}
          >
            <Heart size={18} className={`mr-2 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleBookmark}
          >
            <Bookmark size={18} className={`mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="ghost" size="lg" onClick={handleShare}>
            {copied ? <Check size={18} className="mr-2 text-success" /> : <Share2 size={18} className="mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  )
}
