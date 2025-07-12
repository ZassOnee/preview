"use client"

import { useEffect, useRef } from "react"

export default function ScrollAnimations() {
  const rafRef = useRef<number>()
  const ticking = useRef(false)

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          entry.target.classList.remove("animate-out")
        }
      })
    }, observerOptions)

    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll(".scroll-animate")
    animateElements.forEach((el) => {
      el.classList.add("animate-out")
      observer.observe(el)
    })

    // Check if modal is open to disable scroll effects
    const isModalOpen = () => {
      return (
        document.querySelector('[role="dialog"]') !== null ||
        document.querySelector(".modal-open") !== null ||
        document.body.style.overflow === "hidden"
      )
    }

    // Optimized scroll handler
    const handleScroll = () => {
      // Skip scroll effects if modal is open
      if (isModalOpen()) {
        ticking.current = false
        return
      }

      if (!ticking.current) {
        rafRef.current = requestAnimationFrame(() => {
          const scrolled = window.pageYOffset

          // Parallax elements - only if no modal is open
          const parallaxElements = document.querySelectorAll(".parallax-element")
          parallaxElements.forEach((element) => {
            const speed = Number.parseFloat(element.getAttribute("data-speed") || "0.5")
            const yPos = -(scrolled * speed)
            ;(element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`
          })

          // Floating elements - only if no modal is open
          const floatingElements = document.querySelectorAll(".float-on-scroll")
          floatingElements.forEach((element, index) => {
            const speed = 0.2 + index * 0.05
            const yPos = Math.sin(scrolled * 0.01 + index) * 10 + scrolled * speed * 0.1
            ;(element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`
          })

          // Header background blur effect
          const header = document.querySelector("header")
          if (header) {
            const opacity = Math.min(scrolled / 100, 0.95)
            const blur = Math.min(scrolled / 10, 20)
            header.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.1})`
            header.style.backdropFilter = `blur(${blur}px)`
          }

          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Throttled scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Listen for modal state changes
    const modalObserver = new MutationObserver(() => {
      // Cancel any pending animation frames when modal opens
      if (isModalOpen() && rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        ticking.current = false
      }
    })

    // Observe body for modal changes
    modalObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
      modalObserver.disconnect()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return null
}
