# MangaHook Reader

A high-performance manga reading website built with Next.js 14, Tailwind CSS, and MangaHook API.

## Features

- **Hero Section**: Featured trending manga with high-quality cover images
- **Advanced Search**: Real-time suggestions with genre and status filters
- **Manga Details**: Synopsis, ratings, author info, and clean chapter list
- **Reader Modes**: Long Strip (vertical scroll) and Single Page modes
- **Progress Tracking**: Saves reading progress in LocalStorage (guest) or cloud (logged in)
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Dark Mode**: Modern dark aesthetic for comfortable reading

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **API**: MangaHook API
- **Auth**: Clerk (optional - guest access allowed)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## MangaHook Image URLs

MangaHook provides image URLs directly:

```typescript
// Cover images
const coverUrl = `https://mangadex.org/images/covers/${mangaId}/${coverId}/${filename}`

// Chapter pages
const pageUrl = `https://mangadex.org/data/${chapterHash}/${filename}`

// Small cover variant
const smallCover = `https://mangadex.org/images/covers/${mangaId}/${coverId}/${filename}?w=128`
```

## Project Structure

```
/app
  /layout.tsx          # Root layout with providers
  /page.tsx            # Home page
  /search/page.tsx      # Search/browse page
  /manga/[id]/page.tsx # Manga detail page
  /read/[id]/page.tsx  # Chapter reader
  /library/page.tsx    # User library (auth required)
/components
  /ui                  # Button, Badge, Card, Input, Skeleton
  /layout              # Navbar, Footer
  /manga               # MangaCard, ChapterList, SearchBar
  /reader              # ImageViewer, ReaderControls
/lib
  /api.ts              # MangaHook API utilities
  /hooks               # React Query hooks
  /utils.ts            # Helper functions
/types
  /manga.ts            # TypeScript types
```

## Environment Variables

```env
NEXT_PUBLIC_MANGAHOOK_API_URL=https://mangahook-api.vercel.app
```

## License

MIT
