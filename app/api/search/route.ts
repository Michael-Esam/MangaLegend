import { NextResponse } from 'next/server'

const MANGAPILL_WORKER_URL = 'https://mangapill-api.maichelessam2001.workers.dev'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const res = await fetch(
      `${MANGAPILL_WORKER_URL}/manga/search?query=${encodeURIComponent(query)}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    const data = await res.json()
    const rawResults = Array.isArray(data) ? data : (data.results || [])

    const results = rawResults.slice(0, limit).map((item: any) => {
      const cleanPath = (item.id || '').replace(/^\/?manga\//, '')
      const numericId = cleanPath.split('/')[0]

      return {
        id: cleanPath || item.id,
        title: item.title,
        image: numericId ? `https://cdn.readdetectiveconan.com/file/mangapill/i/${numericId}.jpeg` : '',
        status: 'ongoing',
      }
    })

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
