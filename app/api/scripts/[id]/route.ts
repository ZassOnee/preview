import { type NextRequest, NextResponse } from "next/server"
import { getScriptById, updateScript, deleteScript, incrementDownloads } from "@/lib/database"

// GET - Ambil script berdasarkan ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const scriptId = Number.parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json({ success: false, error: "Invalid script ID" }, { status: 400 })
    }

    const script = await getScriptById(scriptId)
    if (!script) {
      return NextResponse.json({ success: false, error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: script })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch script" }, { status: 500 })
  }
}

// PUT - Update script
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const scriptId = Number.parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json({ success: false, error: "Invalid script ID" }, { status: 400 })
    }

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

    const updatedScript = await updateScript(scriptId, {
      title: title.trim(),
      category,
      thumbnail: thumbnail?.trim(),
      download_url: downloadUrl.trim(),
      is_popular: Boolean(isPopular),
    })

    if (!updatedScript) {
      return NextResponse.json({ success: false, error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedScript })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update script" }, { status: 500 })
  }
}

// DELETE - Hapus script
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const scriptId = Number.parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json({ success: false, error: "Invalid script ID" }, { status: 400 })
    }

    const deleted = await deleteScript(scriptId)
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Script not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Script deleted successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete script" }, { status: 500 })
  }
}

// PATCH - Increment download count
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const scriptId = Number.parseInt(id)

    if (isNaN(scriptId)) {
      return NextResponse.json({ success: false, error: "Invalid script ID" }, { status: 400 })
    }

    const body = await request.json()
    const { action } = body

    if (action === "increment_downloads") {
      const script = await incrementDownloads(scriptId)
      if (!script) {
        return NextResponse.json({ success: false, error: "Script not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: script })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update script" }, { status: 500 })
  }
}
