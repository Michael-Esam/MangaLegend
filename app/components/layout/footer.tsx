import Link from 'next/link'
import { BookOpen, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted">
            <BookOpen size={20} />
            <span className="text-sm">Consumet Manga Reader</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <Link href="/search" className="hover:text-text-primary transition-colors">Browse</Link>
            <a
              href="https://github.com/begalinsaf/consumet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              Consumet API
            </a>
          </nav>

          <div className="flex items-center gap-4 text-text-muted">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-text-muted">
          <p>
            Powered by{' '}
            <a href="https://github.com/begalinsaf/consumet" className="text-accent hover:underline">
              Consumet API
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
