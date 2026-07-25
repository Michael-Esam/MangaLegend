import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

// Famous manga with their known Mangapill IDs — fallback image generated from ID
const POPULAR_MANGA = [
  { id: '2',    title: 'One Piece' },
  { id: '6',    title: 'Fullmetal Alchemist' },
  { id: '3',    title: 'Monster' },
  { id: '16',   title: 'Naruto' },
  { id: '11',   title: 'Bleach' },
  { id: '1',    title: 'Berserk' },
  { id: '6681', title: 'Jujutsu Kaisen' },
  { id: '7',    title: 'Dragon Ball' },
  { id: '6658', title: 'Chainsaw Man' },
  { id: '6662', title: 'Demon Slayer' },
  { id: '6670', title: 'My Hero Academia' },
  { id: '2009', title: 'Detective Conan' },
]

export async function GET() {
  try {
    // Fetch all manga info in parallel
    const results = await Promise.allSettled(
      POPULAR_MANGA.map(async ({ id, title }) => {
        const res = await fetch(
          `${CONSUMET_BASE_URL}/manga/mangapill/info?id=${id}`,
          { next: { revalidate: 3600 } }
        )
        if (!res.ok) {
          // Return a minimal record using known data so the card still renders
          return {
            id,
            title,
            image: `https://cdn.readdetectiveconan.com/file/mangapill/i/${id}.jpeg`,
            status: 'ongoing',
            genres: [],
            description: '',
            releaseDate: '',
            chapters: [],
          }
        }
        const data = await res.json()
        // Ensure image has a reliable fallback
        return {
          ...data,
          id: data.id || id,
          title: data.title || title,
          image: data.image || `https://cdn.readdetectiveconan.com/file/mangapill/i/${id}.jpeg`,
        }
      })
    )

    const manga = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map(r => r.value)

    return NextResponse.json({ results: manga })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
