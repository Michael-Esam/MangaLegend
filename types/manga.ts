export interface Manga {
  id: string
  type: 'manga'
  attributes: MangaAttributes
  relationships: Relationship[]
}

export interface MangaAttributes {
  title: Record<string, string>
  altTitles: Record<string, string>[]
  description: Record<string, string>
  status: 'ongoing' | 'completed' | ' hiatus' | 'cancelled'
  year: number | null
  rating?: number
  contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic'
  tags: Tag[]
  originalLanguage: string
  lastChapter: string | null
  lastVolume: string | null
  chapterNumbersReset: boolean
  linkedChapters: string[]
  createdAt: string
  updatedAt: string
  state: 'published' | 'draft' | 'rejected'
}

export interface Tag {
  id: string
  type: 'tag'
  attributes: TagAttributes
}

export interface TagAttributes {
  name: Record<string, string>
  description: Record<string, string>
  group: 'genre' | 'theme' | 'format'
  version: number
}

export interface Relationship {
  id: string
  type: 'author' | 'artist' | 'cover_art' | 'manga' | 'chapter' | 'scanlation_group'
  attributes?: AuthorAttributes | CoverAttributes | ScanlationGroupAttributes
}

export interface ScanlationGroupAttributes {
  name: string
  slug: string
  bio: string
  locked: boolean
  createdAt: string
  updatedAt: string
  version: number
  fileName?: string
}

export interface AuthorAttributes {
  name: string
  image: string | null
  biography: Record<string, string>
  createdAt: string
  updatedAt: string
  fileName?: string
}

export interface CoverAttributes {
  description: string
  genreAnd: string[]
  locale: string
  createdAt: string
  updatedAt: string
  version: number
  fileName?: string
  mimeType?: string
  width?: number
  height?: number
}

export interface Cover {
  id: string
  attributes: CoverAttributes & {
    fileName: string
    mimeType: string
    width: number
    height: number
  }
}

export interface Chapter {
  id: string
  type: 'chapter'
  attributes: ChapterAttributes
  relationships: Relationship[]
}

export interface ChapterAttributes {
  volume: string | null
  chapter: string | null
  title: string | null
  translatedLanguage: string
  translatedLanguageName?: string
  originalLanguage: string
  external: string | null
  publishAt: string
  readableAt: string
  createdAt: string
  updatedAt: string
  pages: number
  version: number
}

export interface ChapterPages {
  result: 'ok' | 'error'
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
  manga?: {
    id: string
    title: string
  }
}

export interface Author {
  id: string
  type: 'author'
  attributes: AuthorAttributes
}

export interface SearchResponse<T> {
  result: 'ok' | 'error'
  response: string
  data: T[]
  limit: number
  offset: number
  total: number
}

export interface SingleResponse<T> {
  result: 'ok' | 'error'
  response: string
  data: T
}

export interface ReadingProgress {
  mangaId: string
  chapterId: string
  page: number
  timestamp: number
}
