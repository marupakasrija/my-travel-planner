import { NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

export async function GET() {
  try {
    // Explicitly use the environment variable
    const googleAI = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    // Try a simple API call to check if the key is working
    await generateText({
      model: googleAI("gemini-1.5-pro"),
      prompt: "Test",
      maxTokens: 5,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API key check failed:", error)
    return NextResponse.json({
      success: false,
      error: "Google Generative AI API key is missing or invalid",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

