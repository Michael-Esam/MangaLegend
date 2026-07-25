import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
  hover?: boolean
}

export function Card({ children, className, href, hover = true }: CardProps) {
  const baseClass = 'bg-surface rounded-xl border border-border overflow-hidden'
  const hoverClass = hover && href
    ? 'transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 hover:scale-[1.02] cursor-pointer'
    : ''

  if (href) {
    return (
      <Link href={href} className={cn(baseClass, hoverClass, className)}>
        {children}
      </Link>
    )
  }

  return <div className={cn(baseClass, className)}>{children}</div>
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-4 pb-4', className)}>{children}</div>
}
