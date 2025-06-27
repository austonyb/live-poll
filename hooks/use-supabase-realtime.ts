"use client"
import { useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

interface UseSupabaseRealtimeProps {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  onUpdate: (payload: any) => void
  enabled?: boolean
}

export function useSupabaseRealtime({
  table,
  event = '*',
  filter,
  onUpdate,
  enabled = true
}: UseSupabaseRealtimeProps) {
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled) return

    try {
      const supabase = getSupabaseClient()
      
      let subscriptionConfig: any = {
        event,
        schema: 'public',
        table
      }
      
      if (filter) {
        subscriptionConfig.filter = filter
      }
      
      const channelName = filter ? `${table}_${filter}` : table
      
      const subscription = supabase
        .channel(channelName)
        .on('postgres_changes', subscriptionConfig, onUpdate)
        .subscribe()

      subscriptionRef.current = subscription

      console.log(`Real-time subscription active for ${table}${filter ? ` with filter: ${filter}` : ''}`)
    } catch (err) {
      console.error('Error setting up real-time subscription:', err)
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
        console.log(`Real-time subscription cleaned up for ${table}`)
      }
    }
  }, [table, event, filter, onUpdate, enabled])

  return {
    subscription: subscriptionRef.current
  }
}