"use client"

import { useEffect } from "react"

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor performance and optimize animations
    const checkPerformance = () => {
      // Check if device supports hardware acceleration
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      const hasWebGL = !!gl

      // Check if device prefers reduced motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // Check if device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Disable heavy animations on low-performance devices
      if (!hasWebGL || prefersReducedMotion || isMobile) {
        document.documentElement.style.setProperty("--animation-duration", "0.1s")

        // Disable parallax on mobile/low-performance devices
        const parallaxElements = document.querySelectorAll(".parallax-element")
        parallaxElements.forEach((el) => {
          ;(el as HTMLElement).style.transform = "none"
          el.classList.add("no-parallax")
        })

        // Disable floating animations
        const floatingElements = document.querySelectorAll(".float-on-scroll")
        floatingElements.forEach((el) => {
          ;(el as HTMLElement).style.transform = "none"
          el.classList.add("no-float")
        })
      }

      // Monitor FPS and adjust animations accordingly
      let lastTime = performance.now()
      let frameCount = 0
      let fps = 60

      const measureFPS = () => {
        frameCount++
        const currentTime = performance.now()

        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
          frameCount = 0
          lastTime = currentTime

          // If FPS is too low, reduce animation complexity
          if (fps < 30) {
            document.body.classList.add("low-performance")
          } else {
            document.body.classList.remove("low-performance")
          }
        }

        requestAnimationFrame(measureFPS)
      }

      measureFPS()
    }

    // Run performance check after page load
    if (document.readyState === "complete") {
      checkPerformance()
    } else {
      window.addEventListener("load", checkPerformance)
    }

    return () => {
      window.removeEventListener("load", checkPerformance)
    }
  }, [])

  return null
}
