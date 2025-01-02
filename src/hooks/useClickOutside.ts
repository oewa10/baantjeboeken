import { useEffect, useRef } from 'react'

export function useClickOutside(
  handler: () => void, 
  listenCapturing: boolean = true
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick, listenCapturing)
    
    return () => document.removeEventListener('mousedown', handleClick, listenCapturing)
  }, [handler, listenCapturing])

  return ref
}
