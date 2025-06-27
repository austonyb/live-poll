"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { DatabaseService } from "@/lib/database"
import type { Poll } from "@/types/database"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPolls()
  }, [])

  const loadPolls = async () => {
    try {
      setIsLoading(true)
      const allPolls = await DatabaseService.getAllPolls()
      setPolls(allPolls)
    } catch (err) {
      console.error('Error loading polls:', err)
      setError('Failed to load polls')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Polling App for the team</h1>
          <p className="text-xl text-gray-600 mb-8">Create polls and see results update in real-time</p>
          <Link
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Poll
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Polls</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading polls...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">{error}</p>
                  <button 
                    onClick={loadPolls}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Try again
                  </button>
                </div>
              ) : polls.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-2">No polls yet!</p>
                  <Link
                    href="/create"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Create the first poll
                  </Link>
                </div>
              ) : (
                polls.map((poll) => (
                  <Link
                    key={poll.id}
                    href={`/poll/${poll.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{poll.question}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {new Date(poll.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Real-time vote updates</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Supabase database integration</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>TypeScript for type safety</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Responsive design</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Visual progress bars</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}