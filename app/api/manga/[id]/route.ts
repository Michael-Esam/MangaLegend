import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'
const MANGADEX_BASE_URL = 'https://api.mangadex.org'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId)

    if (isUuid) {
      // MangaDex UUID fetch
      const [mangaRes, feedRes] = await Promise.all([
        fetch(`${MANGADEX_BASE_URL}/manga/${rawId}?includes[]=cover_art&includes[]=author&includes[]=artist`),
        fetch(`${MANGADEX_BASE_URL}/manga/${rawId}/feed?limit=96&translatedLanguage[]=en&order[chapter]=desc`)
      ])

      if (mangaRes.ok) {
        const mangaData = await mangaRes.json()
        const feedData = feedRes.ok ? await feedRes.json() : { data: [] }
        const rawManga = mangaData.data
        const rawFeed = feedData.data || []

        const chapters = rawFeed.map((ch: any) => ({
          id: ch.id,
          chapter: ch.attributes?.chapter || '1',
          title: ch.attributes?.title ? `Ch. ${ch.attributes.chapter || ''} - ${ch.attributes.title}` : `Chapter ${ch.attributes?.chapter || ''}`,
          mangaId: rawId,
        }))

        const coverFile = rawManga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName
        const coverUrl = coverFile ? `https://uploads.mangadex.org/covers/${rawId}/${coverFile}` : ''

        return NextResponse.json({
          id: rawManga.id,
          title: rawManga.attributes?.title?.en || Object.values(rawManga.attributes?.title || {})[0] || 'Manga',
          image: coverUrl,
          status: rawManga.attributes?.status || 'ongoing',
          description: rawManga.attributes?.description?.en || '',
          genres: (rawManga.attributes?.tags || []).map((t: any) => t.attributes?.name?.en).filter(Boolean),
          chapters,
          type: 'manga',
          attributes: rawManga.attributes,
          relationships: rawManga.relationships,
        })
      }
    }

    // Extract numeric ID for Consumet (e.g. "2/one-piece" -> "2")
    const id = rawId.split('/')[0]

    // Fetch full manga details AND ALL chapters from Consumet (Mangapill)
    const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/info?id=${id}`)
    if (res.ok) {
      const data = await res.json()
      
      // Fix: Consumet info endpoint omits 'image' property. Resolve real cover image URL!
      if (!data.image) {
        if (data.title) {
          try {
            const searchRes = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/${encodeURIComponent(data.title)}`)
            if (searchRes.ok) {
              const searchData = await searchRes.json()
              const list = Array.isArray(searchData) ? searchData : (searchData.results || [])
              const match = list.find((m: any) => m.id === data.id || m.id?.startsWith(id + '/')) || list[0]
              if (match?.image) {
                data.image = match.image
              }
            }
          } catch {
            // Ignore search error
          }
        }
        if (!data.image) {
          data.image = `https://cdn.readdetectiveconan.com/file/mangapill/i/${id}.jpeg`
        }
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Manga not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
