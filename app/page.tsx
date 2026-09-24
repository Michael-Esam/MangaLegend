import type { Metadata } from 'next'
import { HomeContent } from '@/components/home/home-content'
import { SITE_CONFIG } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'MangaLegends - Read Manga Online Free',
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

export default function HomePage() {
  return <HomeContent />
}
