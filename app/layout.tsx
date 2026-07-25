import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Manga Legends',
  description: 'Read manga online with Manga Legends',
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
          src="https://pl30532559.effectivecpmnetwork.com/39/6d/0a/396d0a2f34b89d5afb5a1afc0b6cd60f.js" 
          strategy="lazyOnload" 
        />
        <Script 
          src="https://pl30532560.effectivecpmnetwork.com/06/62/a5/0662a53ff7dc0f39617df90a3b54ae2f.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  )
}

