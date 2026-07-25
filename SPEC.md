# MangaHook Reader - Technical Specification

## Project Overview
- **Name**: MangaHook Reader
- **Type**: Manga reading web application
- **Core Functionality**: Browse, search, and read manga with MangaHook API integration
- **Target Users**: Manga enthusiasts who want a fast, ad-free reading experience

## Technical Stack

### Frontend
- Next.js 14+ (App Router)
- Tailwind CSS 3.4+
- TypeScript 5+
- Framer Motion (animations)
- Lucide React (icons)
- next/image (image optimization)

### State Management
- TanStack Query (React Query) for API fetching/caching

### API
- MangaHook API (https://mangahook-api.vercel.app)

### Authentication
- Clerk (optional - Guest access allowed)
- Guest users: Search + Read (progress saved to LocalStorage)
- Logged-in users: Favorites + Library + Cloud sync

## Design System

### Color Palette (Dark Mode)
```
--background: #0a0a0f
--surface: #12121a
--surface-elevated: #1a1a24
--border: #2a2a3a
--text-primary: #f5f5f7
--text-secondary: #a0a0b0
--text-muted: #606070
--accent: #6366f1 (Indigo)
--accent-hover: #818cf8
--success: #22c55e
--warning: #f59e0b
--error: #ef4444
```

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, tracking-tight
- Body: Regular, 16px base

### Spacing
- Base unit: 4px
- Container max-width: 1400px
- Section padding: 24px mobile, 48px desktop

## Layout Structure

### Page Hierarchy
1. **Home Page** (`/`)
   - Hero: Featured/Trending manga carousel
   - Trending Section: Horizontal scroll cards
   - New Chapters: Latest updates grid
   - Genres Section: Genre cards

2. **Search Page** (`/search`)
   - Search bar with real-time suggestions
   - Filters: Genres, Status, Tags, Year
   - Results grid with pagination

3. **Manga Detail Page** (`/manga/[id]`)
   - Cover image + meta info sidebar
   - Synopsis, rating, author info
   - Chapter list with sorting
   - Related manga suggestions

4. **Chapter Reader** (`/read/[chapterId]`)
   - Clean, distraction-free UI
   - Mode toggle: Long Strip (vertical) / Single Page
   - Progress tracking
   - Chapter navigation (prev/next)
   - Settings: Reading direction, zoom

5. **Library Page** (`/library`) - Auth required
   - User's favorites/reading list
   - Reading progress indicators

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Features & Interactions

### Home Page
- Skeleton loaders during data fetch
- Infinite scroll for chapter updates
- Hover animations on cards (scale + shadow)
- Pull-to-refresh on mobile

### Search
- Debounced search input (300ms)
- Filter chips with active states
- Real-time suggestions dropdown
- Clear all filters button

### Manga Detail
- Sticky chapter list on desktop
- Chapter read progress indicators
- Share button with copy link
- Bookmark to library (auth required)

### Reader
- Keyboard navigation: Arrow keys, Space
- Touch gestures: Swipe, pinch-to-zoom
- Double-tap to zoom
- Auto-save reading progress
- Image lazy loading with blur placeholder
- Chapter end screen with "Next Chapter" option

## Component Inventory

### Navigation
- **Navbar**: Logo, Search trigger, Auth buttons, Mobile menu
- **MobileMenu**: Slide-in drawer with links
- **Footer**: Simple links, copyright

### Cards
- **MangaCard**: Cover, title, rating badge
  - States: Default, Hover (scale 1.02, shadow-lg)
- **ChapterCard**: Chapter number, date, read indicator
- **GenreCard**: Icon, label, color accent

### Forms
- **SearchInput**: Icon, input, clear button, suggestions
- **FilterDropdown**: Multi-select with checkboxes
- **RangeSlider**: Year range filter

### Reader Components
- **ReaderControls**: Mode toggle, settings, navigation
- **ImageViewer**: Optimized image display with lazy loading
- **ChapterNav**: Previous/Next buttons

### Feedback
- **Skeleton**: Animated placeholder
- **Toast**: Success/Error notifications
- **Badge**: Rating, NEW, UPDATED tags

## API Integration

### MangaDex Endpoints
```
GET /manga - List manga with filters
GET /manga/{id} - Manga details
GET /manga/{id}/feed - Chapter list
GET /chapter/{id} - Chapter details + pages
GET /cover/{id} - Cover image
GET /tag - Genre/tag list
GET /manga/{id}/aggregate - Chapter aggregates
```

### Image URL Construction
MangaDex requires base URL construction:
```
{baseUrl}/data/{coverId}/{filename}
{baseUrl}/data-s/{coverId}/{filename} (small)
{baseUrl}/data/{chapterId}/{filename} (chapter pages)
```

### Caching Strategy
- TanStack Query: staleTime 5min for lists, 10min for details
- LocalStorage: reading progress, preferences
- Image caching via next/image

## Performance Optimizations

1. **Images**: next/image with priority for above-fold
2. **Code Splitting**: Dynamic imports for reader
3. **Prefetching**: next/link prefetch for hover
4. **Bundle Size**: Route-based splitting
5. **Caching**: React Query caching + SWR pattern

## File Structure
```
/app
  /layout.tsx
  /page.tsx
  /search/page.tsx
  /manga/[id]/page.tsx
  /read/[chapterId]/page.tsx
  /library/page.tsx
/components
  /ui (Button, Card, Badge, etc.)
  /layout (Navbar, Footer, MobileMenu)
  /manga (MangaCard, ChapterList, etc.)
  /reader (ReaderControls, ImageViewer)
/lib
  /api.ts (MangaHook API utilities)
  /hooks (useManga, useChapter, etc.)
  /utils.ts
/types
  /manga.ts
```
