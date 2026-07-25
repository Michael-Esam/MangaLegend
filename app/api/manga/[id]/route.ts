import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract just the numeric ID from mangadex-style ID (e.g., "2009/it-s-not-my-fault" -> "2009")
    const id = params.id.split('/')[0]
    const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/info?id=${id}`)
    if (!res.ok) {
      return NextResponse.json({ error: 'Manga not found' }, { status: 404 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
