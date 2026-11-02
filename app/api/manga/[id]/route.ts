import { NextResponse } from 'next/server'

const MANGAPILL_WORKER_URL = 'https://mangapill-api.maichelessam2001.workers.dev'
const MANGADEX_BASE_URL = 'https://api.mangadex.org'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId)

    if (isUuid) {
      // MangaDex UUID fetch (only for explicit MangaDex UUIDs)
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

    // Extract numeric ID for MangaPill (e.g. "2/one-piece" -> "2", "/manga/2/one-piece" -> "2")
    const cleanPath = rawId.replace(/^\/?manga\//, '')
    const numericId = cleanPath.split('/')[0]

    // Fetch full manga details AND ALL chapters from Cloudflare Worker
    const res = await fetch(`${MANGAPILL_WORKER_URL}/manga/info?id=${encodeURIComponent(numericId)}`)
    if (res.ok) {
      const data = await res.json()
      
      const cleanTitle = data.pageTitle
        ? data.pageTitle.replace(/\s*Manga\s*-\s*Mangapill/i, '').replace(/\s*-\s*Mangapill/i, '').trim()
        : 'Manga'

      let chapters = (data.chapters || []).map((ch: any) => {
        const chapterMatch = (ch.title || '').match(/Chapter\s+([\d.]+)/i)
        const chapterNum = chapterMatch ? chapterMatch[1] : (ch.chapter || null)
        return {
          id: ch.id,
          chapter: chapterNum,
          title: ch.title,
          mangaId: numericId,
        }
      })

      // If Worker returned truncated list (e.g. 30 out of 1212 chapters), retrieve all available chapters
      if (data.chaptersFound > chapters.length) {
        try {
          const mpRes = await fetch(`https://mangapill.com/manga/${numericId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            redirect: 'follow',
          })
          if (mpRes.ok) {
            const html = await mpRes.text()
            const regex = /<a[^>]+href=["']\/chapters\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
            const fullChapters = []
            let m
            while ((m = regex.exec(html)) !== null) {
              const rawId = m[1]
              const text = m[2].replace(/<[^>]+>/g, '').trim()
              const chapterMatch = text.match(/Chapter\s+([\d.]+)/i)
              fullChapters.push({
                id: rawId,
                chapter: chapterMatch ? chapterMatch[1] : null,
                title: text,
                mangaId: numericId,
              })
            }
            if (fullChapters.length > chapters.length) {
              chapters = fullChapters
            }
          }
        } catch {
          // Gracefully fallback to Worker chapters
        }
      }

      const coverUrl = `https://cdn.readdetectiveconan.com/file/mangapill/i/${numericId}.jpeg`

      return NextResponse.json({
        id: numericId,
        title: cleanTitle,
        image: coverUrl,
        status: 'ongoing',
        description: '',
        genres: [],
        chapters,
      })
    }

    return NextResponse.json({ error: 'Manga not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
