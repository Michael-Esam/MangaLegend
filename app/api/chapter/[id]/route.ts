import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'
const MANGADEX_BASE_URL = 'https://api.mangadex.org'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const mangaId = searchParams.get('mangaId') || ''

    const chapterId = params.id.split('/')[0]
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chapterId)

    if (isUuid) {
      // Fetch chapter pages from MangaDex @at-home server
      const res = await fetch(`${MANGADEX_BASE_URL}/at-home/server/${chapterId}`)
      if (res.ok) {
        const data = await res.json()
        const baseUrl = data.baseUrl
        const hash = data.chapter?.hash
        const pageFiles = data.chapter?.data || []

        if (baseUrl && hash && pageFiles.length > 0) {
          const pages = pageFiles.map((file: string) => `${baseUrl}/data/${hash}/${file}`)
          return NextResponse.json(pages)
        }
      }
    }

    // Fallback to Consumet API for numeric chapter IDs
    const mangaIdParam = mangaId.split('/')[0]
    const res = await fetch(
      `${CONSUMET_BASE_URL}/manga/mangapill/read?chapterId=${chapterId}&mangaId=${mangaIdParam}`
    )

    if (res.ok) {
      const data = await res.json()
      const pages = Array.isArray(data)
        ? data.map((p: { img: string }) => p.img)
        : []

      return NextResponse.json(pages)
    }

    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
