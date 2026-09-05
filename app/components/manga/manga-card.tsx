'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, getTitle, formatRelativeTime } from '@/lib/utils'
import { buildCoverUrl } from '@/lib/api'
import type { Manga } from '@/types/manga'

interface MangaCardProps {
  manga: Manga
  className?: string
  showLatestChapter?: boolean
  latestChapter?: string
  latestUpdated?: string
}

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%231a1a2e" /><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="%23a0a0b0" text-anchor="middle" dominant-baseline="middle">No Cover</text></svg>'

export function MangaCard({ manga, className, showLatestChapter, latestChapter, latestUpdated }: MangaCardProps) {
  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
  const builtUrl = coverRelation?.attributes?.fileName
    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName, 'small')
    : ''
  const rawCoverUrl = builtUrl || FALLBACK_IMAGE
  const initialCoverUrl = rawCoverUrl.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrl)}` : rawCoverUrl

  const [imgSrc, setImgSrc] = useState(initialCoverUrl)

  const title = getTitle(manga)
  const tags = manga.attributes.tags.slice(0, 3)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card href={`/manga/${manga.id.split('/')[0]}`} className={cn('group', className)}>
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-hover flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
            onError={() => {
              if (imgSrc.includes('/api/image-proxy')) {
                // Try fetching directly if proxy failed
                setImgSrc(rawCoverUrl)
              } else if (imgSrc !== FALLBACK_IMAGE) {
                setImgSrc(FALLBACK_IMAGE)
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 text-text-primary group-hover:text-accent transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="default" className="text-xs">
                {Object.values(tag.attributes.name)[0]}
              </Badge>
            ))}
          </div>
          {showLatestChapter && latestChapter && (
            <p className="text-xs text-text-muted mt-2">
              Ch. {latestChapter} · {latestUpdated ? formatRelativeTime(latestUpdated) : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MangaCardHorizontal({ manga, className }: { manga: Manga; className?: string }) {
  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
  const builtUrlH = coverRelation?.attributes?.fileName
    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName, 'small')
    : ''
  const rawCoverUrlH = builtUrlH || FALLBACK_IMAGE
  const initialCoverUrl = rawCoverUrlH.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrlH)}` : rawCoverUrlH

  const [imgSrc, setImgSrc] = useState(initialCoverUrl)
  const title = getTitle(manga)

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <Link href={`/manga/${manga.id.split('/')[0]}`} className={cn('flex gap-4 p-3 bg-surface rounded-xl border border-border hover:border-accent/50 transition-colors', className)}>
        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-hover flex items-center justify-center">
          <Image 
            src={imgSrc} 
            alt={title} 
            fill 
            className="object-cover" 
            sizes="64px" 
            unoptimized 
            onError={() => {
              if (imgSrc.includes('/api/image-proxy')) {
                setImgSrc(rawCoverUrlH)
              } else if (imgSrc !== FALLBACK_IMAGE) {
                setImgSrc(FALLBACK_IMAGE)
              }
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <p className="text-xs text-text-muted mt-1 capitalize">{manga.attributes.status}</p>
        </div>
      </Link>
    </motion.div>
  )
}
