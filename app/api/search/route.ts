import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { safeJsonParse } from "@/utils/clean-json"

// Create a model instance that will use the GOOGLE_GENERATIVE_AI_API_KEY env var
const model = google("gemini-1.5-pro")

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Simulate a web search by generating relevant information
    const { text: searchResultsText } = await generateText({
      model,
      system: `You are a travel information search tool. Generate realistic, accurate, and up-to-date information about travel destinations, attractions, and activities.
      
      Return ONLY a JSON array of objects, where each object represents a search result with these properties:
      - title: The name of the attraction, activity, or place
      - description: A brief description
      - rating: A rating out of 5 (e.g., 4.5)
      - priceRange: A price range category (e.g., "$", "$$", "$$$")
      - type: The type of result (e.g., "attraction", "restaurant", "accommodation")
      
      Provide 5-7 relevant results for the query.
      Do not include any explanations, markdown formatting, or code blocks. Just return the raw JSON array.`,
      prompt: `Search for travel information about: ${query}`,
    })

    // Safely parse the JSON response
    const searchResults = safeJsonParse(searchResultsText, [])

    return NextResponse.json({ results: searchResults })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Failed to process search request. Please check your API configuration." },
      { status: 500 },
    )
  }
}

