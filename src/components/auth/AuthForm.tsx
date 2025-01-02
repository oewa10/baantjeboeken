'use client'

import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AuthForm() {
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState<string>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    try {
      setOrigin(window.location.origin)
    } catch (error) {
      console.error('Error getting window origin:', error)
      setError('Failed to initialize authentication')
    }
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/courts')
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        {error}
      </div>
    )
  }

  if (!origin) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={['google', 'github']}
        redirectTo={`${origin}/auth/callback`}
        onError={(error) => {
          console.error('Auth error:', error)
          setError(error.message)
        }}
      />
    </div>
  )
}
