import type { Metadata } from 'next'
import { SearchContent } from '@/components/search/search-content'
import { SITE_CONFIG, generateBreadcrumbJsonLd } from '@/lib/seo'

interface SearchPageProps {
  searchParams?: {
    q?: string
    title?: string
    status?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const hasFilter = !!(searchParams?.q || searchParams?.title || searchParams?.status)
  const canonicalUrl = `${SITE_CONFIG.url}/search`
  const pageTitle = hasFilter ? 'Search Manga Results' : 'Search Manga Online'
  const metaDescription = 'Search and filter popular manga titles, ongoing series, and completed works on MangaLegends.'

  return {
    title: pageTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !hasFilter,
      follow: true,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${pageTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
    },
  }
}

export default async function SearchPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SearchContent />
    </>
  )
}
