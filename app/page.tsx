import { TravelPlanner } from "@/components/travel-planner"
import { ApiKeyWarning } from "@/components/api-key-warning"
import { Globe, Compass, MapPin, Plane } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">AI Travel Planner</h1>
          <div className="flex justify-center gap-4 mb-6">
            <div className="animate-float">
              <Globe className="h-8 w-8 text-ocean" />
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <Compass className="h-8 w-8 text-sunset" />
            </div>
            <div className="animate-float" style={{ animationDelay: "2s" }}>
              <MapPin className="h-8 w-8 text-coral" />
            </div>
            <div className="animate-float" style={{ animationDelay: "3s" }}>
              <Plane className="h-8 w-8 text-forest" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chat with our AI to create your perfect travel itinerary. Tell us your preferences, and we'll plan your
            dream vacation!
          </p>
        </div>
        <ApiKeyWarning />
        <TravelPlanner />
      </div>
    </main>
  )
}

