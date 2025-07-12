import { type NextRequest, NextResponse } from "next/server"
import { getAllWebsiteSettings, updateWebsiteSetting, testConnection } from "@/lib/database"

// GET - Ambil semua settings
export async function GET() {
  try {
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: "Database connection failed. Make sure XAMPP MySQL is running." },
        { status: 500 },
      )
    }

    const settings = await getAllWebsiteSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Settings API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

// POST - Update setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Key and value are required" }, { status: 400 })
    }

    const updated = await updateWebsiteSetting(key, value)
    if (!updated) {
      return NextResponse.json({ success: false, error: "Failed to update setting" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Setting updated successfully" })
  } catch (error) {
    console.error("Settings API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update setting" }, { status: 500 })
  }
}
