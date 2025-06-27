"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { addPoll } from "@/lib/demo-data"

export default function CreatePoll() {
  const [question, setQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>(["", ""])
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const router = useRouter()

  const createPoll = async (): Promise<void> => {
    if (!question.trim() || options.some((opt) => !opt.trim())) return

    setIsCreating(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const filteredOptions = options.filter((opt) => opt.trim())
      const pollId = addPoll(question.trim(), filteredOptions)

      router.push(`/poll/${pollId}`)
    } catch (error) {
      console.error("Error creating poll:", error)
      alert("Failed to create poll")
    } finally {
      setIsCreating(false)
    }
  }

  const updateOption = (index: number, value: string): void => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = (): void => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number): void => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const canCreatePoll = question.trim() && options.filter((opt) => opt.trim()).length >= 2

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Create a Poll</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's your question?"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="ml-2 px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button onClick={addOption} className="text-blue-500 text-sm hover:text-blue-700 mt-2">
              + Add another option
            </button>
          </div>

          <button
            onClick={createPoll}
            disabled={isCreating || !canCreatePoll}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Creating..." : "Create Poll"}
          </button>

          <div className="mt-4 text-center">
            <button onClick={() => router.push("/")} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
