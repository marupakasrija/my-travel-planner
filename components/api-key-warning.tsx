"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ApiKeyWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [errorMessage, setErrorMessage] = useState("The Google Generative AI API key is missing or invalid.")

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Make a simple test request to check if the API key is working
      fetch("/api/check-api-key")
        .then((response) => response.json())
        .then((data) => {
          setShowWarning(!data.success)
          if (!data.success && data.message) {
            setErrorMessage(`API Error: ${data.message}`)
          }
        })
        .catch((error) => {
          setShowWarning(true)
          setErrorMessage(`Connection error: ${error.message}`)
        })
    }
  }, [])

  if (!showWarning) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>API Key Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )
}

