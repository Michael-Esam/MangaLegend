'use client'

import { useEffect, useRef } from 'react'

export function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scriptUrl = 'https://pl30532562.effectivecpmnetwork.com/4b90e6cc25bbe83de9df529ca810bf38/invoke.js'

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
    <div className="w-full flex justify-center my-6 min-h-[100px] overflow-hidden">
      <div 
        ref={containerRef} 
        id="container-4b90e6cc25bbe83de9df529ca810bf38" 
        className="w-full max-w-[728px] mx-auto min-h-[90px] bg-surface/50 rounded-lg flex items-center justify-center border border-border/50 text-xs text-text-muted"
      >
        <span className="animate-pulse">Loading Advertisement...</span>
      </div>
    </div>
  )
}
