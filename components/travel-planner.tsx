"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Loader2,
  Send,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Plane,
  Compass,
  Utensils,
  Accessibility,
  Hotel,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { safeJsonParse } from "@/utils/clean-json"

type Message = {
  role: "user" | "assistant"
  content: string
}

type TravelDetails = {
  destination?: string
  startLocation?: string
  budget?: string
  duration?: string
  purpose?: string
  preferences?: string[]
  dietaryPreferences?: string[]
  mobility?: string
  accommodation?: string
}

// We're using the default google instance which will use the GOOGLE_GENERATIVE_AI_API_KEY env var
const model = google("gemini-1.5-pro")

export function TravelPlanner() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI Travel Planner. Tell me about your travel plans, and I'll help you create a personalized itinerary. You can share details like your destination, budget, trip duration, and preferences.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [travelDetails, setTravelDetails] = useState<TravelDetails>({
    preferences: [],
  })
  const [showItinerary, setShowItinerary] = useState(false)
  const [itinerary, setItinerary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Extract travel details from the conversation
      const conversationHistory = [...messages, userMessage]
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const { text: extractedDetailsText } = await generateText({
        model,
        system: `You are an AI travel planner assistant. Your task is to extract travel details from the conversation.
        Extract the following information if present:
        - Destination
        - Starting location
        - Budget
        - Trip duration or travel dates
        - Purpose of the trip
        - Preferences (e.g., adventure, relaxation, culture, food)
        - Dietary preferences
        - Mobility concerns
        - Accommodation preferences
        
        Return ONLY a JSON object with these fields. If information is not available, leave the field empty or as an empty array.
        Do not include any explanations, markdown formatting, or code blocks. Just return the raw JSON object.`,
        prompt: `Extract travel details from this conversation:\n${conversationHistory}`,
      })

      // Safely parse the JSON response
      const parsedDetails = safeJsonParse(extractedDetailsText, {
        preferences: [],
        dietaryPreferences: [],
      })

      setTravelDetails((prev) => ({
        ...prev,
        ...parsedDetails,
      }))

      // Generate assistant response
      const { text: assistantResponse } = await generateText({
        model,
        system: `You are an AI travel planner assistant. Your goal is to help users create personalized travel itineraries.
        
        1. If the user hasn't provided enough information, ask clarifying questions about:
           - Destination & starting location
           - Budget
           - Trip duration or travel dates
           - Purpose of the trip
           - Preferences (adventure, relaxation, culture, food, etc.)
           - Dietary preferences
           - Mobility concerns
           - Accommodation preferences
        
        2. Once you have sufficient information, suggest activities and attractions based on their preferences.
        
        3. If the user asks for an itinerary, generate a detailed day-by-day plan.
        
        Keep your responses conversational, helpful, and focused on travel planning.`,
        prompt: conversationHistory,
      })

      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }])

      // Check if we should generate an itinerary
      if (
        input.toLowerCase().includes("itinerary") ||
        input.toLowerCase().includes("plan") ||
        input.toLowerCase().includes("schedule")
      ) {
        const { text: generatedItinerary } = await generateText({
          model,
          system: `You are an AI travel planner. Generate a detailed day-by-day itinerary based on the user's preferences.
          Include:
          - A logical grouping of activities for each day
          - Estimated timing for each activity
          - Recommended restaurants based on dietary preferences
          - Transportation suggestions between locations
          - Brief descriptions of each attraction
          
          Format the itinerary in a clear, organized manner with days as headings.`,
          prompt: `Generate a detailed travel itinerary for a trip with these details:
          Destination: ${travelDetails.destination || "Not specified"}
          Starting location: ${travelDetails.startLocation || "Not specified"}
          Budget: ${travelDetails.budget || "Not specified"}
          Duration: ${travelDetails.duration || "Not specified"}
          Purpose: ${travelDetails.purpose || "Not specified"}
          Preferences: ${travelDetails.preferences?.join(", ") || "Not specified"}
          Dietary preferences: ${travelDetails.dietaryPreferences?.join(", ") || "Not specified"}
          Mobility concerns: ${travelDetails.mobility || "Not specified"}
          Accommodation preferences: ${travelDetails.accommodation || "Not specified"}
          
          Conversation history:
          ${conversationHistory}`,
        })

        setItinerary(generatedItinerary)
        setShowItinerary(true)
      }
    } catch (error) {
      console.error("Error:", error)
      setError("An error occurred while processing your request. Please try again.")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="flex flex-col w-full md:w-1/2">
        <Card className="card-travel flex flex-col h-[600px] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-ocean to-sunset p-3 text-white font-medium">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Chat with AI Travel Planner</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 h-full overflow-y-auto p-4 bg-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm animate-in fade-in-0 slide-in-from-bottom-4",
                  message.role === "user"
                    ? "ml-auto bg-gradient-to-r from-ocean to-ocean-dark text-white"
                    : "bg-gray-100",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm bg-gray-100">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-ocean animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-ocean animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 rounded-full bg-ocean animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your travel plans..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="travel-input flex-1"
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="travel-button">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
          </div>
        </Card>
      </div>

      <div className="flex flex-col w-full md:w-1/2">
        <Card className="card-travel h-[600px] overflow-hidden">
          {showItinerary ? (
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-sunset to-coral p-3 text-white font-medium">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  <span>Your Travel Itinerary</span>
                </div>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line">{itinerary}</div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="travel-button bg-white hover:bg-white/90 text-sunset"
                  onClick={() => setShowItinerary(false)}
                >
                  Back to Details
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-forest to-forest-dark p-3 text-white font-medium">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  <span>Travel Details</span>
                </div>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-ocean-light/30 transition-all hover:bg-ocean-light/50">
                    <div className="travel-icon">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ocean-dark">Destination</p>
                      <p className="text-sm">{travelDetails.destination || "Not specified yet"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-ocean-light/30 transition-all hover:bg-ocean-light/50">
                    <div className="travel-icon">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ocean-dark">Starting Location</p>
                      <p className="text-sm">{travelDetails.startLocation || "Not specified yet"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-sunset-light/30 transition-all hover:bg-sunset-light/50">
                    <div className="travel-icon bg-sunset-light text-sunset">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sunset-dark">Budget</p>
                      <p className="text-sm">{travelDetails.budget || "Not specified yet"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-sunset-light/30 transition-all hover:bg-sunset-light/50">
                    <div className="travel-icon bg-sunset-light text-sunset">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-sunset-dark">Duration</p>
                      <p className="text-sm">{travelDetails.duration || "Not specified yet"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-coral-light/30 transition-all hover:bg-coral-light/50">
                    <div className="travel-icon bg-coral-light text-coral">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-coral-dark">Purpose</p>
                      <p className="text-sm">{travelDetails.purpose || "Not specified yet"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-coral-light/30 transition-all hover:bg-coral-light/50">
                    <div className="travel-icon bg-coral-light text-coral mt-0.5">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-coral-dark">Preferences</p>
                      <p className="text-sm">
                        {travelDetails.preferences && travelDetails.preferences.length > 0
                          ? travelDetails.preferences.join(", ")
                          : "Not specified yet"}
                      </p>
                    </div>
                  </div>

                  {travelDetails.dietaryPreferences && travelDetails.dietaryPreferences.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-forest-light/30 transition-all hover:bg-forest-light/50">
                      <div className="travel-icon bg-forest-light text-forest">
                        <Utensils className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-forest-dark">Dietary Preferences</p>
                        <p className="text-sm">{travelDetails.dietaryPreferences.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {travelDetails.mobility && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-forest-light/30 transition-all hover:bg-forest-light/50">
                      <div className="travel-icon bg-forest-light text-forest">
                        <Accessibility className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-forest-dark">Mobility Concerns</p>
                        <p className="text-sm">{travelDetails.mobility}</p>
                      </div>
                    </div>
                  )}

                  {travelDetails.accommodation && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-lavender-light/30 transition-all hover:bg-lavender-light/50">
                      <div className="travel-icon bg-lavender-light text-lavender">
                        <Hotel className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-lavender-dark">Accommodation</p>
                        <p className="text-sm">{travelDetails.accommodation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {Object.values(travelDetails).some((val) => val && (Array.isArray(val) ? val.length > 0 : true)) && (
                <div className="p-3 border-t border-gray-100">
                  <Button
                    className="travel-button w-full"
                    onClick={() => {
                      setShowItinerary(true)
                      if (!itinerary) {
                        setIsLoading(true)
                        const conversationHistory = messages
                          .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                          .join("\n")

                        generateText({
                          model,
                          system: `You are an AI travel planner. Generate a detailed day-by-day itinerary based on the user's preferences.
                          Include:
                          - A logical grouping of activities for each day
                          - Estimated timing for each activity
                          - Recommended restaurants based on dietary preferences
                          - Transportation suggestions between locations
                          - Brief descriptions of each attraction
                          
                          Format the itinerary in a clear, organized manner with days as headings.`,
                          prompt: `Generate a detailed travel itinerary for a trip with these details:
                          Destination: ${travelDetails.destination || "Not specified"}
                          Starting location: ${travelDetails.startLocation || "Not specified"}
                          Budget: ${travelDetails.budget || "Not specified"}
                          Duration: ${travelDetails.duration || "Not specified"}
                          Purpose: ${travelDetails.purpose || "Not specified"}
                          Preferences: ${travelDetails.preferences?.join(", ") || "Not specified"}
                          Dietary preferences: ${travelDetails.dietaryPreferences?.join(", ") || "Not specified"}
                          Mobility concerns: ${travelDetails.mobility || "Not specified"}
                          Accommodation preferences: ${travelDetails.accommodation || "Not specified"}
                          
                          Conversation history:
                          ${conversationHistory}`,
                        })
                          .then(({ text }) => {
                            setItinerary(text)
                            setIsLoading(false)
                          })
                          .catch((error) => {
                            console.error("Error generating itinerary:", error)
                            setIsLoading(false)
                          })
                      }
                    }}
                  >
                    <Plane className="h-5 w-5 mr-2" /> Generate Itinerary
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

