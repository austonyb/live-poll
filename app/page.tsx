import Link from "next/link"
import { demoPolls } from "@/lib/demo-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Polling App</h1>
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
            <h2 className="text-2xl font-bold mb-4">Demo Polls</h2>
            <div className="space-y-4">
              {demoPolls.map((poll) => (
                <Link
                  key={poll.id}
                  href={`/poll/${poll.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{poll.question}</h3>
                  <p className="text-sm text-gray-500 mt-1">Created {new Date(poll.created_at).toLocaleDateString()}</p>
                </Link>
              ))}
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
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Easy deployment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
