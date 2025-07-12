import { NextResponse } from "next/server"
import { testConnection } from "@/lib/database"

// GET - Test koneksi database
export async function GET() {
  try {
    const isConnected = await testConnection()

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Database connection successful! XAMPP MySQL is running.",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed. Please check if XAMPP MySQL is running.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection error. Make sure XAMPP is running and database is configured correctly.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
