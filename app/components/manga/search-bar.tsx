'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSearchSuggestions } from '@/lib/hooks/useManga'
import { getTitle } from '@/lib/utils'
import { buildCoverUrl } from '@/lib/api'
import type { Manga } from '@/types/manga'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { data: suggestions } = useSearchSuggestions(debouncedQuery)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className={className}>
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onClear={handleClear}
        placeholder="Search manga by title..."
        icon={<Search size={18} />}
        className="w-full"
      />

      <AnimatePresence>
        {showSuggestions && query.length >= 2 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {suggestions && suggestions.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                {suggestions.map((manga: Manga) => {
                  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
                  const rawCoverUrl = coverRelation?.attributes?.fileName
                    ? buildCoverUrl(manga.id, coverRelation.id, coverRelation.attributes.fileName, 'small')
                    : '/placeholder-cover.png'
                  const coverUrl = rawCoverUrl.startsWith('http')
                    ? `/api/image-proxy?url=${encodeURIComponent(rawCoverUrl)}`
                    : rawCoverUrl
                  return (
                    <Link
                      key={manga.id}
                      href={`/manga/${manga.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 p-3 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="relative w-10 h-14 rounded bg-surface-elevated flex-shrink-0 overflow-hidden">
                        <Image src={coverUrl} alt="" fill className="object-cover" sizes="40px" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{getTitle(manga)}</p>
                        <p className="text-xs text-text-muted capitalize">{manga.attributes.status}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-text-muted text-sm">
                No results found
              </div>
            )}
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-2 p-3 border-t border-border hover:bg-surface-elevated transition-colors text-sm text-accent"
            >
              <Search size={16} />
              See all results for &quot;{query}&quot;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
