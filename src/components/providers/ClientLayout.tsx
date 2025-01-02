'use client'

import { GoogleMapsProvider } from './GoogleMapsProvider'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleMapsProvider>
      {children}
    </GoogleMapsProvider>
  )
}
