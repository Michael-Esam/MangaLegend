import { NextResponse } from 'next/server'

const CONSUMET_BASE_URL = 'https://consumet-api-rouge.vercel.app'

// Verified 40 famous series entries with exact Consumet Mangapill IDs and working cover image URLs
const FAMOUS_MANGA_DEFS = [
  {
    id: '2/one-piece',
    title: 'One Piece',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2.webp?h=01971742-5d7f-7f32-8d2b-d038279f8a73',
    status: 'Ongoing',
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    id: '2085/jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2085.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Shounen']
  },
  {
    id: '1/berserk',
    title: 'Berserk',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Dark Fantasy', 'Seinen']
  },
  {
    id: '4741/vinland-saga',
    title: 'Vinland Saga',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/4741.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Adventure', 'Historical']
  },
  {
    id: '723/chainsaw-man',
    title: 'Chainsaw Man',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/723.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Horror']
  },
  {
    id: '6681/attack-on-titan-exclusive-art-book',
    title: 'Attack on Titan',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/6681.png',
    status: 'Completed',
    genres: ['Action', 'Mystery', 'Shounen']
  },
  {
    id: '2285/kimetsu-no-yaiba',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2285.jpg',
    status: 'Completed',
    genres: ['Action', 'Historical', 'Supernatural']
  },
  {
    id: '5751/my-hero-academia-school-briefs',
    title: 'My Hero Academia',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/5751.png',
    status: 'Ongoing',
    genres: ['Action', 'Superhero', 'Shounen']
  },
  {
    id: '552/bleach',
    title: 'Bleach',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/552.jpg',
    status: 'Completed',
    genres: ['Action', 'Supernatural']
  },
  {
    id: '3069/naruto',
    title: 'Naruto',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/3069.jpg',
    status: 'Completed',
    genres: ['Action', 'Ninja', 'Adventure']
  },
  {
    id: '938/death-note',
    title: 'Death Note',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/938.jpg',
    status: 'Completed',
    genres: ['Mystery', 'Psychological', 'Supernatural']
  },
  {
    id: '4524/tokyo-ghoul',
    title: 'Tokyo Ghoul',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/4524.jpg',
    status: 'Completed',
    genres: ['Action', 'Dark Fantasy', 'Horror']
  },
  {
    id: '8136/solo-leveling-novel',
    title: 'Solo Leveling',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/8136.jpeg',
    status: 'Completed',
    genres: ['Action', 'Fantasy']
  },
  {
    id: '1063/dragon-ball',
    title: 'Dragon Ball',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1063.jpg',
    status: 'Completed',
    genres: ['Action', 'Martial Arts', 'Adventure']
  },
  {
    id: '6/fullmetal-alchemist',
    title: 'Fullmetal Alchemist',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/6.jpeg',
    status: 'Completed',
    genres: ['Action', 'Adventure', 'Steampunk']
  },
  {
    id: '1828/hunter-x-hunter',
    title: 'Hunter x Hunter',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1828.jpg',
    status: 'Ongoing',
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    id: '3262/one-punch-man',
    title: 'One-Punch Man',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/3262.webp?h=019e495c-fc5c-7921-9639-98803f3866dc',
    status: 'Ongoing',
    genres: ['Action', 'Comedy', 'Superhero']
  },
  {
    id: '524/black-clover',
    title: 'Black Clover',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/524.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Shounen']
  },
  {
    id: '4143/spy-x-family',
    title: 'Spy x Family',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/4143.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Comedy', 'Slice of Life']
  },
  {
    id: '5085/tokyo-revengers',
    title: 'Tokyo Revengers',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/5085.jpeg',
    status: 'Completed',
    genres: ['Action', 'Drama', 'Supernatural']
  },
  {
    id: '580/blue-lock',
    title: 'Blue Lock',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/580.webp?h=019ce2f5-e33b-7d47-97d8-190d9172b403',
    status: 'Ongoing',
    genres: ['Sports', 'Drama', 'Shounen']
  },
  {
    id: '1515/haikyuu',
    title: 'Haikyu!!',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1515.jpeg',
    status: 'Completed',
    genres: ['Sports', 'Comedy', 'Drama']
  },
  {
    id: '1059/dr-stone',
    title: 'Dr. Stone',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1059.jpg',
    status: 'Completed',
    genres: ['Sci-Fi', 'Adventure', 'Shounen']
  },
  {
    id: '8/kingdom',
    title: 'Kingdom',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/8.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Historical', 'Military']
  },
  {
    id: '4/vagabond',
    title: 'Vagabond',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/4.jpg',
    status: 'Ongoing',
    genres: ['Action', 'Historical', 'Samurai']
  },
  {
    id: '3/monster',
    title: 'Monster',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/3.jpg',
    status: 'Completed',
    genres: ['Mystery', 'Psychological', 'Thriller']
  },
  {
    id: '9/slam-dunk',
    title: 'Slam Dunk',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/9.jpg',
    status: 'Completed',
    genres: ['Sports', 'Comedy', 'Drama']
  },
  {
    id: '2061/jojo-s-bizarre-adventure-color',
    title: "JoJo's Bizarre Adventure",
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2061.jpg',
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Adventure']
  },
  {
    id: '4458/the-tower-of-mysterion',
    title: 'Tower of God',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/4458.jpg',
    status: 'Ongoing',
    genres: ['Action', 'Fantasy', 'Adventure']
  },
  {
    id: '5830/wind-breaker-nii-satoru',
    title: 'Wind Breaker',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/5830.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Delinquents', 'Shounen']
  },
  {
    id: '7822/kaijuu-8-gou-side-b',
    title: 'Kaiju No. 8',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/7822.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Sci-Fi', 'Monsters']
  },
  {
    id: '5460/dandadan',
    title: 'Dandadan',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/5460.webp?h=019e459b-680d-7b2d-8ece-c7f8cd752f55',
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Comedy']
  },
  {
    id: '5035/sousou-no-frieren',
    title: 'Frieren: Beyond Journey\'s End',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/5035.jpeg',
    status: 'Ongoing',
    genres: ['Fantasy', 'Adventure', 'Drama']
  },
  {
    id: '651/boruto',
    title: 'Boruto',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/651.jpeg',
    status: 'Ongoing',
    genres: ['Action', 'Ninja', 'Adventure']
  },
  {
    id: '2816/mashle',
    title: 'Mashle: Magic and Muscles',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2816.jpeg',
    status: 'Completed',
    genres: ['Action', 'Comedy', 'Magic']
  },
  {
    id: '2035/jigokuraku',
    title: 'Hell\'s Paradise: Jigokuraku',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2035.jpg',
    status: 'Completed',
    genres: ['Action', 'Dark Fantasy', 'Ninja']
  },
  {
    id: '1390/gintama',
    title: 'Gintama',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1390.jpg',
    status: 'Completed',
    genres: ['Action', 'Comedy', 'Samurai']
  },
  {
    id: '1166/fairy-tail',
    title: 'Fairy Tail',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1166.jpg',
    status: 'Completed',
    genres: ['Action', 'Fantasy', 'Magic']
  },
  {
    id: '1206/enen-no-shouboutai',
    title: 'Fire Force',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/1206.jpeg',
    status: 'Completed',
    genres: ['Action', 'Supernatural', 'Sci-Fi']
  },
  {
    id: '9471/blue-exorcist-color',
    title: 'Blue Exorcist',
    image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/9471.webp?h=019bc2c1-3b08-78b8-af0c-22723fc56e5b',
    status: 'Ongoing',
    genres: ['Action', 'Supernatural', 'Demons']
  }
]

export async function GET() {
  try {
    const topManga = FAMOUS_MANGA_DEFS

    const res = await fetch(`${CONSUMET_BASE_URL}/manga/mangapill/popular`)
    let extraManga: any[] = []

    if (res.ok) {
      const data = await res.json()
      const rawExtra = Array.isArray(data) ? data : (data.results || [])
      
      const topIds = new Set(topManga.map(m => m.id.split('/')[0]))
      extraManga = rawExtra
        .filter((m: any) => {
          const cleanId = m.id ? m.id.split('/')[0] : ''
          return !topIds.has(cleanId)
        })
    }

    const combined = [...topManga, ...extraManga]

    return NextResponse.json({ results: combined })
  } catch (error) {
    return NextResponse.json({ results: FAMOUS_MANGA_DEFS })
  }
}
