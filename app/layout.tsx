import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import BackgroundManager from "@/components/background-manager"
import ScrollAnimations from "@/components/scroll-animations"
import PerformanceMonitor from "@/components/performance-monitor"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Script Gratis - Download Script Gratis",
  description: "Platform untuk download script gratis tanpa login dan pembayaran",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-inter min-h-screen`}>
        <Header />
        <main className="pt-20">{children}</main>
        <BackgroundManager />
        <ScrollAnimations />
        <PerformanceMonitor />
      </body>
    </html>
  )
}
