"use client"

import { useEffect, useState } from "react"

interface BackgroundSettings {
  site_background: string
  background_overlay_opacity: string
  enable_parallax: string
}

export default function BackgroundManager() {
  const [settings, setSettings] = useState<BackgroundSettings>({
    site_background: "",
    background_overlay_opacity: "0.7",
    enable_parallax: "true",
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const result = await response.json()
        if (result.success) {
          setSettings({
            site_background: result.data.site_background || "",
            background_overlay_opacity: result.data.background_overlay_opacity || "0.7",
            enable_parallax: result.data.enable_parallax || "true",
          })
        }
      } catch (error) {
        console.error("Failed to fetch background settings:", error)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchSettings()
  }, [])

  // Function to analyze image brightness
  const analyzeImageBrightness = (imageUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            resolve(false) // Default to light if can't analyze
            return
          }

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          let totalBrightness = 0
          let pixelCount = 0

          // Sample every 10th pixel for performance
          for (let i = 0; i < data.length; i += 40) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            // Calculate perceived brightness using luminance formula
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b
            totalBrightness += brightness
            pixelCount++
          }

          const averageBrightness = totalBrightness / pixelCount
          const isDark = averageBrightness < 128 // Threshold for dark/light
          resolve(isDark)
        } catch (error) {
          console.error("Error analyzing image brightness:", error)
          resolve(false) // Default to light if error
        }
      }

      img.onerror = () => {
        resolve(false) // Default to light if image fails to load
      }

      img.src = imageUrl
    })
  }

  // Apply dynamic theme based on background
  const applyDynamicTheme = (isDark: boolean, hasCustomBackground: boolean, overlayOpacity: number) => {
    const root = document.documentElement

    if (hasCustomBackground) {
      // Calculate effective darkness considering overlay
      const effectiveDarkness = isDark || overlayOpacity > 0.5

      if (effectiveDarkness) {
        // Dark background - use light text
        root.style.setProperty("--dynamic-text-primary", "rgba(255, 255, 255, 0.95)")
        root.style.setProperty("--dynamic-text-secondary", "rgba(255, 255, 255, 0.8)")
        root.style.setProperty("--dynamic-text-muted", "rgba(255, 255, 255, 0.6)")
        root.style.setProperty("--dynamic-border", "rgba(255, 255, 255, 0.2)")
        root.style.setProperty("--dynamic-card-bg", "rgba(255, 255, 255, 0.1)")
        root.style.setProperty("--dynamic-card-border", "rgba(255, 255, 255, 0.15)")
        root.style.setProperty("--dynamic-input-bg", "rgba(255, 255, 255, 0.1)")
        root.style.setProperty("--dynamic-input-border", "rgba(255, 255, 255, 0.3)")
        root.style.setProperty("--dynamic-button-secondary", "rgba(255, 255, 255, 0.15)")
        root.style.setProperty("--dynamic-shadow", "rgba(0, 0, 0, 0.3)")
      } else {
        // Light background - use dark text
        root.style.setProperty("--dynamic-text-primary", "rgba(0, 0, 0, 0.9)")
        root.style.setProperty("--dynamic-text-secondary", "rgba(0, 0, 0, 0.7)")
        root.style.setProperty("--dynamic-text-muted", "rgba(0, 0, 0, 0.5)")
        root.style.setProperty("--dynamic-border", "rgba(0, 0, 0, 0.15)")
        root.style.setProperty("--dynamic-card-bg", "rgba(255, 255, 255, 0.8)")
        root.style.setProperty("--dynamic-card-border", "rgba(0, 0, 0, 0.1)")
        root.style.setProperty("--dynamic-input-bg", "rgba(255, 255, 255, 0.9)")
        root.style.setProperty("--dynamic-input-border", "rgba(0, 0, 0, 0.2)")
        root.style.setProperty("--dynamic-button-secondary", "rgba(0, 0, 0, 0.1)")
        root.style.setProperty("--dynamic-shadow", "rgba(0, 0, 0, 0.1)")
      }

      document.body.classList.add("has-custom-background")
      document.body.classList.toggle("dark-background", effectiveDarkness)
    } else {
      // Default gradient - use original white text
      root.style.setProperty("--dynamic-text-primary", "rgba(255, 255, 255, 0.95)")
      root.style.setProperty("--dynamic-text-secondary", "rgba(255, 255, 255, 0.8)")
      root.style.setProperty("--dynamic-text-muted", "rgba(255, 255, 255, 0.6)")
      root.style.setProperty("--dynamic-border", "rgba(255, 255, 255, 0.2)")
      root.style.setProperty("--dynamic-card-bg", "rgba(255, 255, 255, 0.8)")
      root.style.setProperty("--dynamic-card-border", "rgba(255, 255, 255, 0.2)")
      root.style.setProperty("--dynamic-input-bg", "rgba(255, 255, 255, 0.9)")
      root.style.setProperty("--dynamic-input-border", "rgba(255, 255, 255, 0.3)")
      root.style.setProperty("--dynamic-button-secondary", "rgba(255, 255, 255, 0.15)")
      root.style.setProperty("--dynamic-shadow", "rgba(0, 0, 0, 0.1)")

      document.body.classList.remove("has-custom-background", "dark-background")
    }
  }

  useEffect(() => {
    if (!isLoaded) return

    const updateBackground = async () => {
      const body = document.body
      const hasCustomBackground = settings.site_background && settings.site_background.trim() !== ""

      // Limit overlay opacity to prevent complete blackout (max 85%)
      const overlayOpacity = Math.min(Number.parseFloat(settings.background_overlay_opacity), 0.85)

      // Remove existing background overlay
      const existingOverlay = document.querySelector(".background-overlay")
      if (existingOverlay) {
        existingOverlay.remove()
      }

      if (hasCustomBackground) {
        // Analyze background image brightness
        const isDark = await analyzeImageBrightness(settings.site_background)
        setIsDarkBackground(isDark)

        // Set custom background
        body.style.background = `url(${settings.site_background})`
        body.style.backgroundSize = "cover"
        body.style.backgroundPosition = "center center"
        body.style.backgroundRepeat = "no-repeat"
        body.style.backgroundAttachment = settings.enable_parallax === "true" ? "fixed" : "scroll"

        // Create and add overlay with limited opacity
        const overlay = document.createElement("div")
        overlay.className = "background-overlay fixed inset-0 pointer-events-none z-0 transition-all duration-500"
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity})`
        document.body.appendChild(overlay)

        // Apply dynamic theme
        applyDynamicTheme(isDark, true, overlayOpacity)
      } else {
        // Reset to default gradient background
        body.style.background = `linear-gradient(
          135deg,
          hsl(340, 82%, 52%) 0%,
          hsl(350, 85%, 60%) 25%,
          hsl(45, 93%, 58%) 50%,
          hsl(40, 90%, 65%) 75%,
          hsl(340, 75%, 55%) 100%
        )`
        body.style.backgroundAttachment = "fixed"
        body.style.backgroundSize = "auto"
        body.style.backgroundPosition = "initial"
        body.style.backgroundRepeat = "initial"

        // Apply default theme
        applyDynamicTheme(false, false, 0)
      }
    }

    updateBackground()
  }, [settings, isLoaded])

  return null
}
