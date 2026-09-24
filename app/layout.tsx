import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Providers } from './providers'
import Script from 'next/script'
import { SITE_CONFIG, generateWebSiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'MangaLegends - Read Manga Online Free',
    template: '%s | MangaLegends',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'manga',
    'read manga online',
    'free manga',
    'manga reader',
    'manga chapters',
    'popular manga',
    'trending manga',
    'MangaLegends',
  ],
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'MangaLegends - Read Manga Online Free',
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'MangaLegends - Read Manga Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MangaLegends - Read Manga Online Free',
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-default.png`],
  },
  verification: {
    google: SITE_CONFIG.googleVerification,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteJsonLd = generateWebSiteJsonLd()

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-background text-text-primary antialiased">
        <Providers>{children}</Providers>
        <Script
          src="https://pl31373517.profitableratecpmnetwork.com/75/ee/af/75eeaf17e3fa086c19fc09f5d5a61caf.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://pl31373519.profitableratecpmnetwork.com/00/1e/1c/001e1cc6699a20e1f590afaebcb60183.js"
          strategy="lazyOnload"
        />
      </body>
      <Analytics />
    </html>
  )
}
