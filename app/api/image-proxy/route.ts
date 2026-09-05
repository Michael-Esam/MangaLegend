import { NextResponse } from 'next/server'

const SVG_FALLBACK = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="#1a1a2e" /><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#a0a0b0" text-anchor="middle" dominant-baseline="middle">No Cover</text></svg>`

function getFallbackResponse() {
  return new NextResponse(SVG_FALLBACK, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return getFallbackResponse()
  }

  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return getFallbackResponse()
    }

    const origin = new URL(url).origin
    let referer = 'https://mangapill.com/'
    if (origin.includes('mangadex')) {
      referer = 'https://mangadex.org/'
    }

    let res = await fetch(url, {
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (res.status === 403) {
      res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })
    }

    if (!res.ok) {
      return getFallbackResponse()
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return getFallbackResponse()
  }
}

