import { NextResponse } from "next/server"
import { createConnection } from "@/lib/database"

// GET - Setup website settings table
export async function GET() {
  try {
    const connection = await createConnection()

    try {
      // Create table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS website_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_key VARCHAR(100) NOT NULL UNIQUE,
          setting_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      // Create index
      await connection.execute(`
        CREATE INDEX IF NOT EXISTS idx_website_settings_key ON website_settings(setting_key)
      `)

      // Insert default values
      await connection.execute(`
        INSERT INTO website_settings (setting_key, setting_value) VALUES 
        ('site_logo', '/placeholder.svg?height=40&width=40')
        ON DUPLICATE KEY UPDATE setting_value = setting_value
      `)

      await connection.execute(`
        INSERT INTO website_settings (setting_key, setting_value) VALUES 
        ('site_name', 'Script Gratis')
        ON DUPLICATE KEY UPDATE setting_value = setting_value
      `)

      // Insert default background setting
      await connection.execute(`
        INSERT INTO website_settings (setting_key, setting_value) VALUES 
        ('site_background', '')
        ON DUPLICATE KEY UPDATE setting_value = setting_value
      `)

      // Insert default background overlay opacity
      await connection.execute(`
        INSERT INTO website_settings (setting_key, setting_value) VALUES 
        ('background_overlay_opacity', '0.7')
        ON DUPLICATE KEY UPDATE setting_value = setting_value
      `)

      // Insert default parallax setting
      await connection.execute(`
        INSERT INTO website_settings (setting_key, setting_value) VALUES 
        ('enable_parallax', 'true')
        ON DUPLICATE KEY UPDATE setting_value = setting_value
      `)

      // Check if table was created successfully
      const [rows] = await connection.execute("SELECT * FROM website_settings")

      return NextResponse.json({
        success: true,
        message: "Website settings table created successfully!",
        data: rows,
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Setup Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup website settings table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
