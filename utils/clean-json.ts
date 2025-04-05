/**
 * Cleans a string that might contain markdown code blocks or other non-JSON elements
 * and extracts the JSON content.
 */
export function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = text.match(jsonBlockRegex)

  if (match && match[1]) {
    // Return the content inside the code block
    return match[1].trim()
  }

  // If no code block is found, try to find JSON-like content
  // Look for content between curly braces, including nested structures
  const jsonContentRegex = /(\{[\s\S]*\})/
  const contentMatch = text.match(jsonContentRegex)

  if (contentMatch && contentMatch[1]) {
    return contentMatch[1].trim()
  }

  // If all else fails, return the original text
  return text.trim()
}

/**
 * Safely parses a string as JSON, with fallback handling for common issues
 */
export function safeJsonParse(text: string, fallback: any = {}): any {
  try {
    const cleanedText = cleanJsonResponse(text)
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error("JSON parsing error:", error)
    console.error("Failed to parse:", text)
    return fallback
  }
}

