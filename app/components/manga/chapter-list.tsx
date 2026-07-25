'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, SortAsc, SortDesc } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Chapter } from '@/types/manga'

interface ChapterListProps {
  chapters: Chapter[]
  mangaId: string
}

type SortOrder = 'asc' | 'desc'

export function ChapterList({ chapters, mangaId }: ChapterListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        No chapters available yet
      </div>
    )
  }

  // Sort chapters numerically
  const sortedChapters = [...chapters].sort((a, b) => {
    const aNum = parseFloat(String(a.attributes.chapter || a.id.split('-').pop() || '0'))
    const bNum = parseFloat(String(b.attributes.chapter || b.id.split('-').pop() || '0'))
    return sortOrder === 'desc' ? bNum - aNum : aNum - bNum
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-muted">{chapters.length} chapters</span>
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
          {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {sortedChapters.map((chapter) => {
        const chapterNum = chapter.attributes.chapter
        const chapterTitle = chapter.attributes.title

        return (
          <Link
            key={chapter.id}
            href={`/read/${chapter.id.split('/')[0]}?mangaId=${mangaId}`}
            className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border hover:border-accent/50 hover:bg-surface-elevated transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium group-hover:text-accent transition-colors",
                  chapterNum ? "text-text-primary" : "text-text-muted"
                )}>
                  {chapterNum ? `Chapter ${chapterNum}` : 'One Shot'}
                </span>
                {chapterTitle && (
                  <span className="text-sm text-text-muted truncate">{chapterTitle}</span>
                )}
              </div>
            </div>
            <ChevronRight size={16} className="text-text-muted group-hover:text-accent transition-colors flex-shrink-0" />
          </Link>
        )
      })}
    </div>
  )
}
