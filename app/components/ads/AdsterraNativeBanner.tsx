'use client'

import { useEffect, useRef } from 'react'

export function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scriptUrl = 'https://pl31373518.profitableratecpmnetwork.com/0233b945b942c46d3ac1cc61d1a7ea67/invoke.js'

    if (containerRef.current) {
      // Clear container first to prevent duplicate dynamic embeds
      containerRef.current.innerHTML = ''
      
      const script = document.createElement('script')
      script.src = scriptUrl
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      
      containerRef.current.appendChild(script)
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 min-h-[100px] overflow-hidden">
      <a 
        href="https://www.profitableratecpmnetwork.com/v85n5nkfby?key=13bf0eea5363479a5a34dce09be70f40" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full max-w-[728px] mx-auto block"
      >
        <div 
          ref={containerRef} 
          id="container-0233b945b942c46d3ac1cc61d1a7ea67" 
          className="w-full max-w-[728px] mx-auto min-h-[90px] bg-surface/50 rounded-lg flex items-center justify-center border border-border/50 text-xs text-text-muted transition-opacity hover:opacity-95"
        >
          <span className="animate-pulse">Loading Advertisement...</span>
        </div>
      </a>
    </div>
  )
}
