import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

export async function GET() {
  try {
    const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/popular`)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
