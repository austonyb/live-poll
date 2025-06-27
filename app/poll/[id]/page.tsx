"use client"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { DatabaseService } from "@/lib/database"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"
import type { PollWithOptions, VoteCount } from "@/types/database"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface PollPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PollPage({ params }: PollPageProps) {
  const [poll, setPoll] = useState<PollWithOptions | null>(null)
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([])
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [isVoting, setIsVoting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Unwrap params using React.use()
  const { id } = use(params)

  useEffect(() => {
    loadPoll()
    loadVoteCounts()
  }, [id])

  // Set up real-time subscription for votes on this specific poll
  useSupabaseRealtime({
    table: 'votes',
    event: '*',
    filter: `poll_id=eq.${id}`,
    onUpdate: (payload) => {
      console.log('Real-time vote update:', payload)
      loadVoteCounts()
    }
  })

  const loadPoll = async (): Promise<void> => {
    try {
      const pollData = await DatabaseService.getPollWithOptions(id)
      setPoll(pollData)
    } catch (err) {
      console.error('Error loading poll:', err)
      setError('Failed to load poll')
    } finally {
      setIsLoading(false)
    }
  }

  const loadVoteCounts = async (): Promise<void> => {
    try {
      const counts = await DatabaseService.getVoteCounts(id)
      setVoteCounts(counts)
    } catch (err) {
      console.error('Error loading vote counts:', err)
    }
  }

  const vote = async (optionId: string): Promise<void> => {
    if (hasVoted || isVoting) return

    setIsVoting(true)

    try {
      await DatabaseService.addVote(id, optionId)
      setHasVoted(true)
      // Vote counts will be updated automatically via real-time subscription
    } catch (error) {
      console.error("Error voting:", error)
      setError("Failed to record vote. Please try again.")
    } finally {
      setIsVoting(false)
    }
  }

  const getVoteCount = (optionId: string): number => {
    const voteCount = voteCounts.find((vc) => vc.option_id === optionId)
    return voteCount ? voteCount.count : 0
  }

  const getTotalVotes = (): number => {
    return voteCounts.reduce((total, vc) => total + vc.count, 0)
  }

  const getVotePercentage = (optionId: string): number => {
    const total = getTotalVotes()
    if (total === 0) return 0
    return Math.round((getVoteCount(optionId) / total) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll...</p>
        </div>
      </div>
    )
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Poll</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
          <p className="text-gray-600 mb-6">The poll you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.question}</h1>
            <p className="text-gray-600">{hasVoted ? "Thank you for voting!" : "Click an option to vote"}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-8">
            {poll.options.map((option) => {
              const voteCount = getVoteCount(option.id)
              const percentage = getVotePercentage(option.id)

              return (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => vote(option.id)}
                    disabled={hasVoted || isVoting}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{option.text}</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {voteCount} votes ({percentage}%)
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-center border-t pt-6">
            <div className="text-lg font-medium text-gray-900 mb-2">Total votes: {getTotalVotes()}</div>
            {hasVoted && <div className="text-green-600 font-medium mb-4">✓ Your vote has been recorded!</div>}
            {isVoting && <div className="text-blue-600 font-medium mb-4">Recording your vote...</div>}
            <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}