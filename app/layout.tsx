import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

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
      </body>
    </html>
  )
}
