'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Settings, X, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ReaderControlsProps {
  onPrevChapter?: () => void
  onNextChapter?: () => void
  hasPrevChapter: boolean
  hasNextChapter: boolean
  chapterTitle?: string
  mangaTitle?: string
}

export function ReaderControls({ onPrevChapter, onNextChapter, hasPrevChapter, hasNextChapter, chapterTitle, mangaTitle }: ReaderControlsProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [readingMode, setReadingMode] = useState<'long-strip' | 'single'>('long-strip')
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const hideControls = () => setShowControls(false)
    const showControls = () => setShowControls(true)

    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(hideControls, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
    )}>
      <div className="bg-gradient-to-b from-background via-background/95 to-transparent pb-12">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ChevronLeft size={20} />
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm truncate">{mangaTitle || 'Manga'}</h1>
              {chapterTitle && <p className="text-xs text-text-muted truncate">{chapterTitle}</p>}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={18} />
          </Button>
        </div>

        {showSettings && (
          <div className="absolute top-16 right-4 bg-surface border border-border rounded-lg p-4 shadow-xl min-w-[200px]">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-2">Reading Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={readingMode === 'long-strip' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setReadingMode('long-strip')}
                    className="flex-1"
                  >
                    Long Strip
                  </Button>
                  <Button
                    variant={readingMode === 'single' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setReadingMode('single')}
                    className="flex-1"
                  >
                    Single Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        'fixed bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-16 pb-4 transition-all duration-300',
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={onPrevChapter}
            disabled={!hasPrevChapter}
          >
            <ChevronLeft size={18} className="mr-2" />
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={onNextChapter}
            disabled={!hasNextChapter}
          >
            Next
            <ChevronRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
