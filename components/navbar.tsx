"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Search, Calendar, Plane } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-ocean-light py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-ocean to-sunset rounded-full p-2">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">AI Travel Planner</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className={cn("flex items-center gap-1 rounded-full", pathname === "/" && "bg-ocean hover:bg-ocean-dark")}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Chat</span>
            </Button>
          </Link>

          <Link href="/search">
            <Button
              variant={pathname === "/search" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1 rounded-full",
                pathname === "/search" && "bg-sunset hover:bg-sunset-dark",
              )}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </Link>

          <Link href="/generator">
            <Button
              variant={pathname === "/generator" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-1 rounded-full",
                pathname === "/generator" && "bg-coral hover:bg-coral-dark",
              )}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Generator</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

