import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const mangaId = searchParams.get('mangaId') || ''

    // Extract just the numeric IDs from mangadex-style IDs
    const chapterId = params.id.split('/')[0]
    const mangaIdParam = mangaId.split('/')[0]

    // Fetch chapter pages from Consumet API
    const res = await fetch(
      `${CONSUMET_BASE_URL}/manga/mangapill/read?chapterId=${chapterId}&mangaId=${mangaIdParam}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    const data = await res.json()

    // Mangapill returns array of { img, page } objects
    // Normalize to array of image URLs
    const pages = Array.isArray(data)
      ? data.map((p: { img: string }) => p.img)
      : []

    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
