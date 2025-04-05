"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, Star, MapPin, DollarSign, Tag, Plane } from "lucide-react"

type SearchResult = {
  title: string
  description: string
  rating: number
  priceRange: string
  type: string
}

export function SearchResults() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search request failed")
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError("Failed to fetch search results. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "attraction":
        return <MapPin className="h-4 w-4 text-ocean" />
      case "restaurant":
        return <Tag className="h-4 w-4 text-coral" />
      case "accommodation":
        return <DollarSign className="h-4 w-4 text-sunset" />
      default:
        return <MapPin className="h-4 w-4 text-ocean" />
    }
  }

  return (
    <div className="w-full">
      <Card className="card-travel mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for attractions, activities, or places..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="travel-input flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()} className="travel-button">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <Card
            key={index}
            className="card-travel overflow-hidden transition-all duration-300 hover:translate-y-[-5px]"
          >
            <CardHeader className="pb-2 bg-gradient-to-r from-ocean-light to-sunset-light p-4">
              <CardTitle className="text-lg flex items-start gap-2">
                <span className="travel-icon mt-0.5">{getTypeIcon(result.type)}</span>
                <span>{result.title}</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-sunset text-sunset" />
                  <span className="ml-1 font-medium">{result.rating}</span>
                </div>
                <span>•</span>
                <span className="text-sunset font-medium">{result.priceRange}</span>
                <span>•</span>
                <span className="capitalize">{result.type}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">{result.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-ocean" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Plane className="h-6 w-6 text-ocean-dark" />
            </div>
          </div>
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div className="text-center text-muted-foreground my-8 p-8 border-2 border-dashed border-ocean-light rounded-xl">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-ocean-light" />
          <p className="text-lg font-medium">No results found</p>
          <p>Try a different search term or destination</p>
        </div>
      )}
    </div>
  )
}

