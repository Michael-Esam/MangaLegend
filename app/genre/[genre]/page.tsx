import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { MangaCard } from '@/components/manga/manga-card'
import { fetchManga } from '@/lib/api'
import { getGenreBySlug, getSupportedGenres } from '@/lib/genres'
import type { Manga } from '@/types/manga'

interface GenrePageProps {
  params: {
    genre: string
  }
}

export async function generateStaticParams() {
  const genres = await getSupportedGenres()
  return genres.map((g) => ({
    genre: g.slug,
  }))
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const genreInfo = await getGenreBySlug(params.genre)

  if (!genreInfo) {
    return {
      title: 'Genre Not Found | MangaLegends',
    }
  }

  const genreName = genreInfo.name
  const lowerName = genreName.toLowerCase()
  const title = `${genreName} Manga`
  const description = `Read ${lowerName} manga online for free on MangaLegends. Browse ${lowerName} manga and discover available chapters.`
  const canonicalUrl = `https://mangalegends.de5.net/genre/${genreInfo.slug}`

  return {
    title: {
      absolute: `${genreName} Manga | MangaLegends`,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'MangaLegends',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function GenrePage({ params }: GenrePageProps) {
  const genreInfo = await getGenreBySlug(params.genre)

  if (!genreInfo) {
    notFound()
  }

  const genreName = genreInfo.name
  const lowerName = genreName.toLowerCase()
  const mangaList = await fetchManga({ includedTags: [genreInfo.id], limit: 24 })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{genreName} Manga</h1>
          <p className="text-text-secondary leading-relaxed max-w-3xl">
            Browse {lowerName} manga on MangaLegends. Discover available {lowerName} series and read their chapters online.
          </p>
        </div>

        {mangaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {mangaList.map((manga: Manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            No {lowerName} manga found at this time.
          </div>
        )}
      </main>
    </div>
  )
}
