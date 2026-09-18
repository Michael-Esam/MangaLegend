import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { Providers } from './providers'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Manga Legends',
  description: 'Read manga online with Manga Legends',
  verification: {
    google: 'zGP3Ct0SKInYtQcJWy5VeBhhoEiK7SYwZaEBVIyra_Y',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased">
        <Providers>
          {children}
        </Providers>
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
