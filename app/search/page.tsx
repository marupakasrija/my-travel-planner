import { SearchResults } from "@/components/search-results"
import { ApiKeyWarning } from "@/components/api-key-warning"
import { Search, Compass, Globe } from "lucide-react"

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Travel Search</h1>
          <div className="flex justify-center gap-4 mb-6">
            <div className="animate-float">
              <Search className="h-8 w-8 text-sunset" />
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <Globe className="h-8 w-8 text-ocean" />
            </div>
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <Compass className="h-8 w-8 text-coral" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search for attractions, activities, and places for your travel itinerary
          </p>
        </div>
        <ApiKeyWarning />
        <SearchResults />
      </div>
    </main>
  )
}

