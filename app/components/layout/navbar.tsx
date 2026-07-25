'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Browse' },
  { href: '/library', label: 'Library' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold tracking-tight">Manga Legends</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent',
                  pathname === link.href ? 'text-accent' : 'text-text-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.effectivecpmnetwork.com/qja5szirup?key=476454f523be7777fe64674306aa450b"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-colors text-amber-500 hover:text-amber-400"
            >
              Support Us
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <Search size={18} />
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="ghost" size="sm">
                <User size={18} />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link href="/search" className="block py-2">
              <Input placeholder="Search manga..." icon={<Search size={18} />} />
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block py-2 text-base font-medium',
                  pathname === link.href ? 'text-accent' : 'text-text-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.effectivecpmnetwork.com/qja5szirup?key=476454f523be7777fe64674306aa450b"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-amber-500 hover:text-amber-400"
            >
              Support Us
            </a>
          </div>
        </div>
      )}

    </nav>
  )
}
