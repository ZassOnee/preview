import { NextResponse } from "next/server"
import {
  getAnalyticsSummary,
  getCategoryAnalytics,
  getTopScripts,
  getDailyStats,
  updateAnalyticsSummary,
} from "@/lib/database"

// GET - Ambil semua data analytics
export async function GET() {
  try {
    // Update analytics summary terlebih dahulu
    await updateAnalyticsSummary()

    const [summary, categoryAnalytics, topScripts, dailyStats] = await Promise.all([
      getAnalyticsSummary(),
      getCategoryAnalytics(),
      getTopScripts(5),
      getDailyStats(7),
    ])

    return NextResponse.json({
      success: true,
      data: {
        summary,
        categoryAnalytics,
        topScripts,
        dailyStats,
      },
    })
  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
