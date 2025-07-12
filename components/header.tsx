"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [siteLogo, setSiteLogo] = useState<string>("/placeholder.svg?height=40&width=40")
  const [siteName, setSiteName] = useState<string>("Script Gratis")

  // Fetch website settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const result = await response.json()
        if (result.success) {
          setSiteLogo(result.data.site_logo || "/placeholder.svg?height=40&width=40")
          setSiteName(result.data.site_name || "Script Gratis")
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {siteLogo && siteLogo !== "/placeholder.svg?height=40&width=40" ? (
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image
                    src={siteLogo || "/placeholder.svg"}
                    alt={siteName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Award className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Beranda
            </Link>
            <Link
              href="/scripts"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Script Gratis
            </Link>
            <Link
              href="/kontak"
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 bg-black/20 backdrop-blur-sm rounded-b-2xl">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white/90 hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/scripts"
                className="text-white/90 hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Script Gratis
              </Link>
              <Link
                href="/kontak"
                className="text-white/90 hover:text-white font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
