import type { Poll, Option, Vote, PollWithOptions } from "@/types/database"

// Demo polls data
export const demoPolls: Poll[] = [
  {
    id: "1",
    question: "What is your favorite programming language?",
    created_by: "demo-user",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Which deployment platform do you prefer?",
    created_by: "demo-user",
    created_at: new Date().toISOString(),
  },
]

export const demoOptions: Option[] = [
  { id: "1", poll_id: "1", text: "TypeScript" },
  { id: "2", poll_id: "1", text: "Python" },
  { id: "3", poll_id: "1", text: "Go" },
  { id: "4", poll_id: "1", text: "Rust" },
  { id: "5", poll_id: "2", text: "Vercel" },
  { id: "6", poll_id: "2", text: "Netlify" },
  { id: "7", poll_id: "2", text: "AWS" },
]

// Demo votes - simulating real votes
export const demoVotes: Vote[] = [
  { id: "1", poll_id: "1", option_id: "1", user_id: "user1" },
  { id: "2", poll_id: "1", option_id: "1", user_id: "user2" },
  { id: "3", poll_id: "1", option_id: "2", user_id: "user3" },
  { id: "4", poll_id: "1", option_id: "3", user_id: "user4" },
  { id: "5", poll_id: "1", option_id: "1", user_id: "user5" },
  { id: "6", poll_id: "2", option_id: "5", user_id: "user6" },
  { id: "7", poll_id: "2", option_id: "5", user_id: "user7" },
  { id: "8", poll_id: "2", option_id: "6", user_id: "user8" },
]

// Helper functions for demo data
export const getPollWithOptions = (pollId: string): PollWithOptions | null => {
  const poll = demoPolls.find((p) => p.id === pollId)
  if (!poll) return null

  const options = demoOptions.filter((o) => o.poll_id === pollId)
  return { ...poll, options }
}

export const addVote = (pollId: string, optionId: string): void => {
  const newVote: Vote = {
    id: Date.now().toString(),
    poll_id: pollId,
    option_id: optionId,
    user_id: `user-${Date.now()}`,
  }
  demoVotes.push(newVote)
}

export const getVoteCounts = (pollId: string) => {
  const votes = demoVotes.filter((v) => v.poll_id === pollId)
  const counts: { [key: string]: number } = {}

  votes.forEach((vote) => {
    counts[vote.option_id] = (counts[vote.option_id] || 0) + 1
  })

  return Object.entries(counts).map(([option_id, count]) => ({
    option_id,
    count,
  }))
}

export const addPoll = (question: string, options: string[]): string => {
  const pollId = Date.now().toString()

  // Add poll
  demoPolls.push({
    id: pollId,
    question,
    created_by: "demo-user",
    created_at: new Date().toISOString(),
  })

  // Add options
  options.forEach((text, index) => {
    demoOptions.push({
      id: `${pollId}-${index}`,
      poll_id: pollId,
      text,
    })
  })

  return pollId
}
