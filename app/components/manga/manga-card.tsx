'use client'

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

export function MangaCard({ manga, className, showLatestChapter, latestChapter, latestUpdated }: MangaCardProps) {
  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
  const rawCoverUrl = coverRelation?.attributes?.fileName
    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName, 'small')
    : '/placeholder-cover.png'
  const coverUrl = rawCoverUrl.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrl)}` : rawCoverUrl

  const title = getTitle(manga)
  const tags = manga.attributes.tags.slice(0, 3)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card href={`/manga/${manga.id.split('/')[0]}`} className={cn('group', className)}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
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
  const rawCoverUrlH = coverRelation?.attributes?.fileName
    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName, 'small')
    : '/placeholder-cover.png'
  const coverUrl = rawCoverUrlH.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrlH)}` : rawCoverUrlH

  const title = getTitle(manga)

  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <Link href={`/manga/${manga.id.split('/')[0]}`} className={cn('flex gap-4 p-3 bg-surface rounded-xl border border-border hover:border-accent/50 transition-colors', className)}>
        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={coverUrl} alt={title} fill className="object-cover" sizes="64px" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <p className="text-xs text-text-muted mt-1 capitalize">{manga.attributes.status}</p>
        </div>
      </Link>
    </motion.div>
  )
}
