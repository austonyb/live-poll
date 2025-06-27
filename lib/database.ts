import { getSupabaseClient } from './supabase'
import type { Poll, Option, Vote, PollWithOptions, VoteCount } from '@/types/database'
import type { PollInsert, OptionInsert, VoteInsert } from '@/types/supabase'

export class DatabaseService {
  // Poll operations
  static async getAllPolls(): Promise<Poll[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getPollById(id: string): Promise<Poll | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  static async getPollWithOptions(pollId: string): Promise<PollWithOptions | null> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        options (*)
      `)
      .eq('id', pollId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data as PollWithOptions
  }

  static async createPoll(question: string, options: string[]): Promise<string> {
    try {
      // Create poll - created_by should be null for anonymous users since it references auth.users
      const pollInsert: PollInsert = {
        question,
        created_by: null, // null for anonymous users (no auth.users reference)
      }

      const supabase = getSupabaseClient()
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([pollInsert])
        .select()
        .single()

      if (pollError) {
        console.error('Poll creation error:', pollError)
        throw new Error(`Failed to create poll: ${pollError.message}`)
      }

      if (!poll) {
        throw new Error('Poll was not created - no data returned')
      }

      // Create options
      const optionInserts: OptionInsert[] = options.map((text) => ({
        poll_id: poll.id,
        text,
      }))

      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionInserts)

      if (optionsError) {
        console.error('Options creation error:', optionsError)
        throw new Error(`Failed to create options: ${optionsError.message}`)
      }

      return poll.id
    } catch (error) {
      console.error('Database service error:', error)
      throw error
    }
  }

  // Vote operations
  static async addVote(pollId: string, optionId: string, userId?: string): Promise<void> {
    // For anonymous users, we'll use null which should allow multiple votes per poll
    // since PostgreSQL UNIQUE constraints allow multiple NULL values
    const voteInsert: VoteInsert = {
      poll_id: pollId,
      option_id: optionId,
      user_id: userId || null, // null for anonymous users
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('votes')
      .insert([voteInsert])

    if (error) {
      console.error('Vote insertion error:', error)
      throw new Error(`Failed to record vote: ${error.message}`)
    }
  }

  static async getVoteCounts(pollId: string): Promise<VoteCount[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)

    if (error) throw error

    // Count votes by option_id
    const counts: { [key: string]: number } = {}
    data?.forEach((vote) => {
      counts[vote.option_id] = (counts[vote.option_id] || 0) + 1
    })

    return Object.entries(counts).map(([option_id, count]) => ({
      option_id,
      count,
    }))
  }

  // Option operations
  static async getOptionsByPollId(pollId: string): Promise<Option[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .eq('poll_id', pollId)
      .order('text')

    if (error) throw error
    return data || []
  }
}