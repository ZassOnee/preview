import { type NextRequest, NextResponse } from "next/server"
import { incrementViews } from "@/lib/database"

// POST - Increment view count
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const scriptId = Number.parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json({ success: false, error: "Invalid script ID" }, { status: 400 })
    }

    const script = await incrementViews(scriptId)
    if (!script) {
      return NextResponse.json({ success: false, error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: script })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update view count" }, { status: 500 })
  }
}
