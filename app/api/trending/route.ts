import { NextResponse } from 'next/server'
import { fetchTrendingManga } from '@/lib/api'

export async function GET() {
  try {
    const trendingData = await fetchTrendingManga(10)
    
    if (trendingData && trendingData.length > 0) {
      return NextResponse.json(trendingData)
    }
    
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json([])
  }
}

