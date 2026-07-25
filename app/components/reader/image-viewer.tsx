'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChapterPages } from '@/types/manga'

interface ImageViewerProps {
  pages: ChapterPages | null
  initialPage?: number
  onPageChange?: (page: number) => void
  readingMode: 'long-strip' | 'single'
}

export function ImageViewer({ pages, initialPage = 0, onPageChange, readingMode }: ImageViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  if (!pages || !pages.chapter?.data?.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-text-muted">
        <p>No pages available</p>
      </div>
    )
  }

  const { data, hash } = pages.chapter
  // MangaHook returns direct URLs, MangaDex uses hash-based URLs
  const imageBaseUrl = pages.baseUrl || ''
  const proxyUrl = (src: string) => `/api/image-proxy?url=${encodeURIComponent(src)}`

  if (readingMode === 'single') {
    return (
      <div className="flex flex-col items-center">
        <div className="relative max-h-screen">
          <Image
            src={proxyUrl(hash ? `${imageBaseUrl}/data/${hash}/${data[currentPage]}` : data[currentPage])}
            alt={`Page ${currentPage + 1}`}
            width={1200}
            height={1800}
            className="object-contain"
            priority={currentPage === 0}
            unoptimized
          />
        </div>
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
          <button
            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {currentPage + 1} / {data.length}
          </span>
          <button
            onClick={() => handlePageChange(Math.min(data.length - 1, currentPage + 1))}
            disabled={currentPage === data.length - 1}
            className="p-2 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {data.map((filename, index) => (
        <div key={index} className="relative w-full flex justify-center">
          <Image
            src={proxyUrl(hash ? `${imageBaseUrl}/data/${hash}/${filename}` : filename)}
            alt={`Page ${index + 1}`}
            width={1200}
            height={1800}
            className="object-contain"
            loading={index < 3 ? 'eager' : 'lazy'}
            priority={index === 0}
            unoptimized
          />
        </div>
      ))}
    </div>
  )
}
