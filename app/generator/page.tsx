import { ItineraryGenerator } from "@/components/itinerary-generator"
import { ApiKeyWarning } from "@/components/api-key-warning"
import { Calendar, Plane, Route, Map } from "lucide-react"

export default function GeneratorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Itinerary Generator</h1>
          <div className="flex justify-center gap-4 mb-6">
            <div className="animate-float">
              <Calendar className="h-8 w-8 text-coral" />
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <Plane className="h-8 w-8 text-ocean" />
            </div>
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <Route className="h-8 w-8 text-forest" />
            </div>
            <div className="animate-float" style={{ animationDelay: "3s" }}>
              <Map className="h-8 w-8 text-sunset" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill out the form to generate a personalized travel itinerary
          </p>
        </div>
        <ApiKeyWarning />
        <ItineraryGenerator />
      </div>
    </main>
  )
}

