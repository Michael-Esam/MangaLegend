import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') || '20'

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const res = await fetch(
      `${CONSUMET_BASE_URL}/manga/mangapill/${encodeURIComponent(query)}?limit=${limit}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
