'use client'

import { AuthForm } from '@/components/auth/AuthForm'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:px-20">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-3xl font-bold">Welcome to BaantjeBoeken</h1>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <AuthForm />
        </div>
      </main>
    </div>
  )
}
