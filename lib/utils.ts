export function cn(...classes: unknown[]): string {
  return classes.flatMap(c => {
    if (typeof c === 'string') return c
    if (typeof c === 'number' && c !== 0) return String(c)
    if (c && typeof c === 'object') return Object.entries(c).filter(([, v]) => v && typeof v === 'boolean').map(([k]) => k)
    return []
  }).filter(Boolean).join(' ')
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(dateString)
}

export function getTitle(manga: { attributes: { title: Record<string, string> } }): string {
  return manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown Title'
}

export function getDescription(manga: { attributes: { description: Record<string, string> } }): string {
  return manga.attributes.description.en || Object.values(manga.attributes.description)[0] || 'No description available'
}

export function getMangaCover(manga: { relationships: { id: string; type: string; attributes?: { fileName: string } }[] }): string | null {
  const coverRelation = manga.relationships.find(r => r.type === 'cover_art')
  if (coverRelation?.attributes?.fileName) {
    return coverRelation.attributes.fileName
  }
  return null
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
