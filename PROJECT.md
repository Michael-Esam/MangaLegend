# MangaDex Reader - Project Documentation

## Overview

**MangaDex Reader** is a Next.js 14 manga reading web application. It integrates with multiple manga APIs (MangaDex, Consumet, Jikan/MyAnimeList, MangaHook) to browse, search, and read manga.

**Goal**: Build a fully functional manga site where users can browse, search, and read manga using the Consumet API as the primary data source. All users should be able to read manga without authentication (guest access).

---

## Project Status

**Current State**: Core functionality implemented.
- Home page with trending manga displays data
- Search page works with Consumet API
- Manga detail pages show information
- Chapter reader implemented (API route created)
- Search API route created
- Guest access for all users

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.0 | React framework with App Router |
| React | 18.3.0 | UI library |
| TypeScript | 5.0.0 | Type safety |
| TanStack Query | 5.0.0 | Server state management |
| Clerk | 6.0.0 | Authentication |
| Framer Motion | 11.0.0 | Animations |
| Lucide React | 0.400.0 | Icons |
| Tailwind CSS | 3.4.0 | Styling |
| Zod | latest | Schema validation |

---

## Directory Structure

```
D:/test/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (server-side proxies)
│   │   ├── chapter/[id]/         # GET chapter pages
│   │   ├── manga/[id]/          # GET manga details
│   │   ├── search/              # GET search results
│   │   └── trending/route.ts    # GET trending manga
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   ├── manga/                # MangaCard, ChapterList, MangaHeader, SearchBar
│   │   ├── reader/               # ImageViewer, ReaderControls
│   │   └── ui/                   # Badge, Button, Card, Input, Skeleton
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── providers.tsx             # React Query / Clerk providers
│   ├── library/page.tsx          # User library (auth required)
│   ├── manga/[id]/page.tsx       # Manga detail page
│   ├── read/[chapterId]/page.tsx # Chapter reader page
│   └── search/page.tsx           # Search/browse page
├── lib/
│   ├── api.ts                    # MangaDex API utilities
│   ├── consumet.ts               # Consumet API wrapper
│   ├── jikan.ts                  # Jikan (MyAnimeList) API wrapper
│   ├── mangahook.ts              # MangaHook API wrapper
│   ├── hooks/useManga.ts         # React Query hooks
│   └── utils.ts                  # Utility functions
├── types/
│   └── manga.ts                  # TypeScript interfaces
├── public/                       # Static assets
├── .claude/                      # Claude Code settings
└── node_modules/                 # Dependencies
```

---

## Configuration Files

### package.json
```json
{
  "name": "mangadex-reader",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### next.config.js
- Remote image patterns for: MangaDex, mangapill, mangakakalot, gmanga, webdcg, toongodd, comick
- Image optimization disabled (`unoptimized: true`)

### tsconfig.json
- Path alias: `@/*` -> `./app/*` or `./*`

### tailwind.config.ts
- Dark theme with custom colors (background, foreground, accent)
- Custom animations: fade-in, slide-up, scale-in

---

## Pages / Routes

| Route | File | Description | Status |
|-------|------|-------------|--------|
| `/` | `app/page.tsx` | Home with trending manga, hero section, search | Working |
| `/search` | `app/search/page.tsx` | Search with filters | Working |
| `/manga/[id]` | `app/manga/[id]/page.tsx` | Manga details, chapters | Working |
| `/read/[chapterId]` | `app/read/[chapterId]/page.tsx` | Chapter reader | Working |
| `/library` | `app/library/page.tsx` | User library (auth-gated) | Partial |

---

## API Routes

### /api/trending
- **File**: `app/api/trending/route.ts`
- **Method**: GET
- **Source**: Consumet API (`mangapill` provider)
- **Response**: Trending manga list

### /api/manga/[id]
- **File**: `app/api/manga/[id]/route.ts`
- **Method**: GET
- **Source**: Consumet API (`mangapill` provider)
- **Response**: Manga details with chapters

### /api/chapter/[id]
- **File**: `app/api/chapter/[id]/route.ts`
- **Method**: GET
- **Query Params**: `mangaId` (optional)
- **Source**: Consumet API
- **Response**: Chapter pages (array of image URLs)

### /api/search
- **File**: `app/api/search/route.ts`
- **Method**: GET
- **Query Params**: `q` (search query), `limit` (optional, default 20)
- **Source**: Consumet API (`mangapill` provider)
- **Response**: Search results

---

## API Integrations

### Consumet API (PRIMARY - Used for data)
- **Base URL**: `https://consumet-api-rouge.vercel.app`
- **Provider**: `mangapill`
- **Endpoints used**:
  - `/manga/trending` - Trending manga
  - `/manga/popular` - Popular manga
  - `/manga/info/{id}` - Manga details
  - `/manga/read/{chapterId}` - Chapter pages
- **File**: `lib/consumet.ts`

### MangaDex API (Fallback / Covers)
- **Base URL**: `https://api.mangadex.org`
- **File**: `lib/api.ts`
- **Usage**: Covers, alternative data

### Jikan API (MyAnimeList)
- **Base URL**: `https://api.jikan.moe/v4`
- **File**: `lib/jikan.ts`
- **Usage**: Alternative manga data source

### MangaHook API
- **Base URL**: `https://mangahook-api.vercel.app`
- **File**: `lib/mangahook.ts`
- **Usage**: Alternative manga data source

---

## Components

### UI Components (`components/ui/`)
| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| Badge | `badge.tsx` | variant, children | Status/rating tags |
| Button | `button.tsx` | variant, size, children | Reusable button |
| Card | `card.tsx` | children, className | Container |
| Input | `input.tsx` | icon, placeholder, onChange | Search input |
| Skeleton | `skeleton.tsx` | className | Loading placeholders |

### Layout Components (`components/layout/`)
| Component | File | Purpose |
|-----------|------|---------|
| Navbar | `navbar.tsx` | Sticky nav with links, mobile menu, search |
| Footer | `footer.tsx` | Footer links |

### Manga Components (`components/manga/`)
| Component | File | Purpose |
|-----------|------|---------|
| MangaCard | `manga-card.tsx` | Cover card with hover animation |
| ChapterList | `chapter-list.tsx` | Chapter listing |
| MangaHeader | `manga-header.tsx` | Manga info header |
| SearchBar | `search-bar.tsx` | Search input component |

### Reader Components (`components/reader/`)
| Component | File | Purpose |
|-----------|------|---------|
| ImageViewer | `image-viewer.tsx` | Chapter page display |
| ReaderControls | `reader-controls.tsx` | Navigation, mode toggle |

---

## TypeScript Types (`types/manga.ts`)

```typescript
interface Manga {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  status?: string;
  releaseDate?: string;
  authors?: string[];
  genres?: string[];
  chapters?: Chapter[];
  lastChapter?: number;
}

interface Chapter {
  id: string;
  title: string;
  mangaId: string;
  number: number;
  releaseDate?: string;
}

interface ChapterPages {
  pages: string[];
}

interface Tag {
  id: string;
  name: string;
}
```

---

## React Query Hooks (`lib/hooks/useManga.ts`)

| Hook | Parameters | Returns | Purpose |
|------|------------|---------|---------|
| `useTrendingManga` | type (manga/doujin), page | Manga[] | Fetch trending |
| `useMangaSearch` | query, page | Manga[] | Search manga |
| `useManga` | id | Manga | Manga details |
| `useMangaChapters` | mangaId | Chapter[] | Fetch chapters |
| `useChapterPages` | chapterId | ChapterPages | Chapter images |
| `useTags` | - | Tag[] | Fetch all tags |
| `useSearchSuggestions` | query | string[] | Autocomplete |
| `useReadingProgress` | mangaId | number | Get/set progress |

---

## Utility Functions (`lib/utils.ts`)

| Function | Purpose |
|----------|---------|
| `cn()` | Merge classnames |
| `formatDate()` | Format date string |
| `formatRelativeTime()` | Relative time (e.g., "2 days ago") |
| `getTitle()` | Extract title from manga object |
| `getDescription()` | Extract description |
| `getMangaCover()` | Get cover URL |
| `slugify()` | Convert to URL-safe slug |
| `truncate()` | Truncate text with ellipsis |

---

## Known Issues / TODO

### Fixed
- [x] `app/api/chapter/[id]/route.ts` - Chapter pages API route (created 2026-04-23)
- [x] `app/api/search/route.ts` - Search API route (created 2026-04-23)

### Functionality Gaps
- [ ] Library page is auth-gated but has no actual favorites functionality
- [ ] Reading progress could use cloud sync (future enhancement)

---

## Development Notes

1. **API Proxy Pattern**: All API calls go through `/api/*` routes to avoid CORS issues with browser
2. **Guest Access**: Users can browse and read without authentication
3. **Authentication (Clerk)**: Optional - for future favorites/library sync
4. **Dark Mode**: Default theme, colors defined in tailwind.config.ts
5. **No Database**: All data comes from external APIs (no local storage of manga data)

---

## Common Tasks

### Add a new API route
1. Create file in `app/api/[resource]/route.ts`
2. Use `lib/consumet.ts` or similar to fetch data
3. Return JSON response

### Add a new page
1. Create file in `app/[route]/page.tsx`
2. Use React Query hooks from `lib/hooks/useManga.ts`
3. Add to navigation in `Navbar`

### Add a new component
1. Create in appropriate `components/` subfolder
2. Use UI components from `components/ui/` for base elements
3. Use Tailwind for styling

---

## Deployment

- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev**: `npm run dev`
- Default port: 3000

---

*Last updated: 2026-04-23*
*Document maintained by: Claude Code*

---

## Change Log

### 2026-04-23
- Created `app/api/chapter/[id]/route.ts` - Chapter pages API route
- Created `app/api/search/route.ts` - Search API route
- Updated PROJECT.md documentation
- Dev server started at http://localhost:3000
