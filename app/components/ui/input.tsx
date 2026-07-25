'use client'

import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, onClear, className, value, ...props }, ref) => {
  const showClear = value && String(value).length > 0

  return (
    <div className={cn('relative flex items-center', className)}>
      {icon && (
        <span className="absolute left-3 text-text-muted">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-surface border border-border rounded-lg py-2.5',
          'text-text-primary placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'transition-all duration-200',
          icon && 'pl-10 pr-10',
          !icon && 'px-4',
          showClear && 'pr-10'
        )}
        value={value}
        {...props}
      />
      {showClear && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
})

Input.displayName = 'Input'
