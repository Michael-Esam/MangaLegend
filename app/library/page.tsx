import type { Metadata } from 'next'
import { LibraryContent } from '@/components/library/library-content'
import { SITE_CONFIG } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'My Library | MangaLegends',
  description: 'Your saved favorite manga and reading bookmarks on MangaLegends.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/library`,
  },
}

export default function LibraryPage() {
  return <LibraryContent />
}