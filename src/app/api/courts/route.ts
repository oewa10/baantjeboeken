import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseKey.length
})

export async function GET() {
  try {
    console.log('Starting courts fetch...')
    
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('courts')
      .select('count')
      .single()

    if (testError) {
      console.error('Test query error:', testError)
      return NextResponse.json(
        { error: `Database connection error: ${testError.message}` },
        { status: 500 }
      )
    }

    console.log('Test query successful:', testData)

    // Now fetch actual data
    const { data: courts, error } = await supabase
      .from('courts')
      .select('*')

    if (error) {
      console.error('Courts query error:', error)
      return NextResponse.json(
        { error: `Failed to fetch courts: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Courts fetched successfully:', courts)
    return NextResponse.json(courts || [])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unexpected error in courts API:', error)
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
