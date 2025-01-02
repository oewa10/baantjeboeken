import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'BaantjeBoeken',
  description: 'Book your favorite padel court',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-neutral-50 font-sans antialiased",
        fontSans.variable,
        fontDisplay.variable
      )}>
        <header className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-display font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              BaantjeBoeken
            </a>
            <nav className="flex items-center gap-6">
              <a href="/courts" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Courts
              </a>
              <a href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Login
              </a>
            </nav>
          </div>
        </header>
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-display font-semibold text-lg mb-4">BaantjeBoeken</h3>
                <p className="text-sm text-neutral-600">
                  Book your favorite padel court with ease.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/courts" className="text-sm text-neutral-600 hover:text-neutral-900">
                      Find Courts
                    </a>
                  </li>
                  <li>
                    <a href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
                      Login
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-sm text-neutral-600">
                  Questions? Get in touch with us at<br />
                  <a href="mailto:info@baantjeboeken.nl" className="text-primary-600 hover:text-primary-700">
                    info@baantjeboeken.nl
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-neutral-600">
              {new Date().getFullYear()} BaantjeBoeken. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
