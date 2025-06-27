import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function to get the Supabase client
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// For compatibility, export a client that will be created on first use
export const supabase = (() => {
  try {
    return getSupabaseClient()
  } catch {
    // Return a mock client during build time when env vars might not be available
    return null as any
  }
})()