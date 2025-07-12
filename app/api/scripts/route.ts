import { type NextRequest, NextResponse } from "next/server"
import { getAllScripts, addScript, testConnection } from "@/lib/database"

// GET - Ambil semua scripts
export async function GET() {
  try {
    // Test koneksi database
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: "Database connection failed. Make sure XAMPP MySQL is running." },
        { status: 500 },
      )
    }

    const scripts = await getAllScripts()
    return NextResponse.json({ success: true, data: scripts })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch scripts. Check database connection." },
      { status: 500 },
    )
  }
}

// POST - Tambah script baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, thumbnail, downloadUrl, isPopular } = body

    // Validasi input
    if (!title || !category || !downloadUrl) {
      return NextResponse.json(
        { success: false, error: "Title, category, and downloadUrl are required" },
        { status: 400 },
      )
    }

    // Validasi category
    if (!["UI", "SFX", "Special"].includes(category)) {
      return NextResponse.json({ success: false, error: "Category must be UI, SFX, or Special" }, { status: 400 })
    }

    const newScript = await addScript({
      title: title.trim(),
      category,
      thumbnail: thumbnail?.trim(),
      download_url: downloadUrl.trim(),
      is_popular: Boolean(isPopular),
    })

    return NextResponse.json({ success: true, data: newScript }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create script. Check database connection." },
      { status: 500 },
    )
  }
}
