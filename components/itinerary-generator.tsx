"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
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
} from "lucide-react"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Create a model instance that will use the GOOGLE_GENERATIVE_AI_API_KEY env var
const model = google("gemini-1.5-pro")

export function ItineraryGenerator() {
  const [formData, setFormData] = useState({
    destination: "",
    startLocation: "",
    budget: "",
    duration: "",
    purpose: "",
    preferences: "",
    dietaryPreferences: "",
    mobility: "",
    accommodation: "",
  })

  const [itinerary, setItinerary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
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
        Destination: ${formData.destination}
        Starting location: ${formData.startLocation}
        Budget: ${formData.budget}
        Duration: ${formData.duration}
        Purpose: ${formData.purpose}
        Preferences: ${formData.preferences}
        Dietary preferences: ${formData.dietaryPreferences}
        Mobility concerns: ${formData.mobility}
        Accommodation preferences: ${formData.accommodation}`,
      })

      setItinerary(generatedItinerary)
    } catch (err) {
      console.error("Error generating itinerary:", err)
      setError("Failed to generate itinerary. Please check your API configuration.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-travel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-ocean to-forest p-4 text-white">
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Travel Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-ocean-dark font-medium">
                Destination
              </Label>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-ocean" />
                <Input
                  id="destination"
                  name="destination"
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="travel-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startLocation" className="text-ocean-dark font-medium">
                Starting Location
              </Label>
              <div className="flex items-center">
                <Plane className="w-4 h-4 mr-2 text-ocean" />
                <Input
                  id="startLocation"
                  name="startLocation"
                  placeholder="Where are you starting from?"
                  value={formData.startLocation}
                  onChange={handleChange}
                  className="travel-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sunset-dark font-medium">
                Budget
              </Label>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-sunset" />
                <Input
                  id="budget"
                  name="budget"
                  placeholder="What's your budget? (e.g., $1000, budget-friendly)"
                  value={formData.budget}
                  onChange={handleChange}
                  className="travel-input border-sunset-light focus:border-sunset focus:ring-sunset"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sunset-dark font-medium">
                Duration
              </Label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-sunset" />
                <Input
                  id="duration"
                  name="duration"
                  placeholder="How long is your trip? (e.g., 5 days, June 1-5)"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="travel-input border-sunset-light focus:border-sunset focus:ring-sunset"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-coral-dark font-medium">
                Purpose
              </Label>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-coral" />
                <Input
                  id="purpose"
                  name="purpose"
                  placeholder="Purpose of your trip (e.g., vacation, business)"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="travel-input border-coral-light focus:border-coral focus:ring-coral"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences" className="text-coral-dark font-medium">
                Preferences
              </Label>
              <div className="flex items-start">
                <Heart className="w-4 h-4 mr-2 mt-2 text-coral" />
                <Textarea
                  id="preferences"
                  name="preferences"
                  placeholder="What do you enjoy? (e.g., adventure, culture, food, relaxation)"
                  value={formData.preferences}
                  onChange={handleChange}
                  className="travel-input border-coral-light focus:border-coral focus:ring-coral"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryPreferences" className="text-forest-dark font-medium">
                Dietary Preferences
              </Label>
              <div className="flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-forest" />
                <Input
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  placeholder="Any dietary preferences? (e.g., vegetarian, gluten-free)"
                  value={formData.dietaryPreferences}
                  onChange={handleChange}
                  className="travel-input border-forest-light focus:border-forest focus:ring-forest"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobility" className="text-forest-dark font-medium">
                Mobility Concerns
              </Label>
              <div className="flex items-center">
                <Accessibility className="w-4 h-4 mr-2 text-forest" />
                <Input
                  id="mobility"
                  name="mobility"
                  placeholder="Any mobility concerns? (e.g., wheelchair access)"
                  value={formData.mobility}
                  onChange={handleChange}
                  className="travel-input border-forest-light focus:border-forest focus:ring-forest"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodation" className="text-lavender-dark font-medium">
                Accommodation Preferences
              </Label>
              <div className="flex items-center">
                <Hotel className="w-4 h-4 mr-2 text-lavender" />
                <Input
                  id="accommodation"
                  name="accommodation"
                  placeholder="Accommodation preferences (e.g., luxury, budget)"
                  value={formData.accommodation}
                  onChange={handleChange}
                  className="travel-input border-lavender-light focus:border-lavender focus:ring-lavender"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="travel-button w-full mt-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Itinerary
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="card-travel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sunset to-coral p-4 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-4 border-t-ocean border-r-sunset border-b-coral border-l-forest animate-spin"></div>
                <Plane className="h-8 w-8 text-ocean absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-muted-foreground">Crafting your perfect travel itinerary...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-8 text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-red-500" />
              </div>
              {error}
            </div>
          ) : itinerary ? (
            <div className="prose prose-sm max-w-none p-6 overflow-y-auto max-h-[600px]">
              <div className="whitespace-pre-line">{itinerary}</div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-20">
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-ocean-light to-sunset-light rounded-full animate-pulse-light"></div>
                <Calendar className="h-12 w-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-ocean" />
              </div>
              <p className="text-lg font-medium mb-2">Your adventure awaits!</p>
              <p>Fill out the form and generate your personalized travel itinerary</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

