'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ImageViewer } from '@/components/reader/image-viewer'
import { ReaderControls } from '@/components/reader/reader-controls'
import { useChapterPages, useMangaChapters, useReadingProgress } from '@/lib/hooks/useManga'
import { Skeleton } from '@/components/ui/skeleton'

interface ChapterPageProps {
  params: { chapterId: string }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { chapterId } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const mangaId = searchParams.get('mangaId') || ''
  const [readingMode, setReadingMode] = useState<'long-strip' | 'single'>('long-strip')
  const [currentPage, setCurrentPage] = useState(0)

  const { data: pages, isLoading } = useChapterPages(chapterId, mangaId || undefined)
  const { data: chapters } = useMangaChapters(mangaId)

  const { saveProgress } = useReadingProgress(mangaId)

  useEffect(() => {
    if (currentPage > 0 && chapterId) {
      saveProgress(chapterId, currentPage)
    }
  }, [currentPage, chapterId, saveProgress])

  const currentIndex = useMemo(() => {
    if (!chapters) return -1
    const cleanCurrentId = chapterId.split('/')[0]
    return chapters.findIndex(c => c.id.split('/')[0] === cleanCurrentId)
  }, [chapters, chapterId])

  // Chapters are sorted newest first (descending order, e.g. ch 28, ch 27, ch 26...)
  const nextChapter = currentIndex > 0 && chapters ? chapters[currentIndex - 1] : null
  const prevChapter = currentIndex >= 0 && chapters && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const handlePrevChapter = () => {
    if (prevChapter) {
      const cleanChId = prevChapter.id.split('/')[0]
      router.push(`/read/${cleanChId}?mangaId=${mangaId}`)
    }
  }

  const handleNextChapter = () => {
    if (nextChapter) {
      const cleanChId = nextChapter.id.split('/')[0]
      router.push(`/read/${cleanChId}?mangaId=${mangaId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-64 h-8 mb-4" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    )
  }

  if (!pages || !pages.chapter?.data?.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-2">Chapter not found or no pages available</p>
          <button onClick={() => router.back()} className="text-accent hover:underline">
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ReaderControls
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        hasPrevChapter={!!prevChapter}
        hasNextChapter={!!nextChapter}
      />

      <div className={readingMode === 'single' ? 'pt-16' : ''}>
        <ImageViewer
          pages={pages}
          initialPage={currentPage}
          onPageChange={setCurrentPage}
          readingMode={readingMode}
        />
      </div>
    </div>
  )
}
