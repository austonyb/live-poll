// Supabase Database Schema - Updated to match actual schema
export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          question: string
          created_by: string | null  // UUID reference to auth.users
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          created_by?: string | null  // UUID reference to auth.users
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          created_by?: string | null
          created_at?: string
        }
      }
      options: {
        Row: {
          id: string
          poll_id: string
          text: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null  // UUID reference to auth.users
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null  // UUID reference to auth.users
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
        }
      }
    }
  }
}

// Type aliases for Supabase operations
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type OptionInsert = Database['public']['Tables']['options']['Insert']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']