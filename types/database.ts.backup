export interface Poll {
  id: string
  question: string
  created_by: string | null
  created_at: string
}

export interface Option {
  id: string
  poll_id: string
  text: string
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id: string | null
}

// Helper type for polls with options
export interface PollWithOptions extends Poll {
  options: Option[]
}

export interface VoteCount {
  option_id: string
  count: number
}
