"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Download, Eye, Star, RefreshCw, ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Script } from "@/lib/data"

const categories = ["Semua", "UI", "SFX", "Special"]

export default function ScriptsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (scriptId: number) => {
    setImageErrors((prev) => new Set(prev).add(scriptId))
  }

  const isValidImageUrl = (url: string) => {
    if (!url) return false
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const hasImageExtension = imageExtensions.some((ext) => url.toLowerCase().includes(ext))
    const allowedDomains = [
      "imgur.com",
      "github.com",
      "raw.githubusercontent.com",
      "unsplash.com",
      "pexels.com",
      "pixabay.com",
      "cloudinary.com",
      "amazonaws.com",
    ]
    const isFromAllowedDomain = allowedDomains.some((domain) => url.includes(domain))
    const blockedDomains = ["pinterest.com", "facebook.com", "instagram.com", "twitter.com", "tiktok.com"]
    const isFromBlockedDomain = blockedDomains.some((domain) => url.includes(domain))
    return (hasImageExtension || isFromAllowedDomain) && !isFromBlockedDomain
  }

  const fetchScripts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/scripts")
      const result = await response.json()

      if (result.success) {
        setScripts(result.data)
        setImageErrors(new Set())
      } else {
        setError(result.error || "Failed to fetch scripts")
      }
    } catch (err) {
      setError("Failed to connect to server")
      console.error("Error fetching scripts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScripts()
  }, [])

  const handleDownload = async (script: Script) => {
    try {
      await fetch(`/api/scripts/${script.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "increment_downloads" }),
      })
      fetchScripts()
      window.open(script.downloadUrl, "_blank")
    } catch (err) {
      console.error("Error updating download count:", err)
      window.open(script.downloadUrl, "_blank")
    }
  }

  const filteredScripts = useMemo(() => {
    let filtered = scripts
    if (activeCategory !== "Semua") {
      filtered = filtered.filter((script) => script.category === activeCategory)
    }
    if (searchQuery) {
      filtered = filtered.filter((script) => script.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    return filtered
  }, [scripts, activeCategory, searchQuery])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white/80">Memuat script...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center modern-card">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchScripts} className="btn-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Page Title */}
      <div className="text-center mb-12 scroll-animate">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-float parallax-element" data-speed="0.3">
          Download Script Gratis
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Koleksi lengkap script gratis untuk berbagai kebutuhan development Anda
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 scroll-animate">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`transition-all duration-300 rounded-xl font-medium ${
              activeCategory === category
                ? "btn-primary"
                : "glass-card text-white border-white/20 hover:bg-white/10 hover:scale-105"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 scroll-animate">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Cari Script Gratis..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value || "")}
            className="pl-12 py-4 text-lg glass-card border-white/20 text-gray-900 placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Script Cards */}
      {filteredScripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script, index) => (
            <div
              key={script.id}
              className="modern-card group scroll-animate float-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                {!imageErrors.has(script.id) && isValidImageUrl(script.thumbnail) ? (
                  <Image
                    src={script.thumbnail || "/placeholder.svg"}
                    alt={script.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => handleImageError(script.id)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-700 font-medium">{script.category}</p>
                      <p className="text-xs text-gray-500 mt-1">Script Preview</p>
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                    GRATIS
                  </Badge>
                </div>
                {script.isPopular && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-0 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Populer
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {script.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {script.downloads.toLocaleString()}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{script.title}</h3>

                <Button className="w-full btn-primary" onClick={() => handleDownload(script)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Sekarang
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="modern-card max-w-md mx-auto">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada script untuk kategori ini</h3>
            <p className="text-gray-500">Coba ubah filter kategori atau kata kunci pencarian Anda</p>
          </div>
        </div>
      )}
    </div>
  )
}
