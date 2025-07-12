import mysql from "mysql2/promise"

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", 
  database: "script_gratis",
  port: 3306,
}


export interface Script {
  id: number
  title: string
  category: "UI" | "SFX" | "Special"
  thumbnail: string
  download_url: string
  downloads: number
  views: number
  rating: number
  rating_count: number
  file_size_mb: number
  tags: string[]
  is_popular: boolean
  created_at: string
  updated_at: string
  popularity_score?: number
  download_performance?: string
  days_since_created?: number
}

// Interface untuk Analytics Summary
export interface AnalyticsSummary {
  id: number
  total_scripts: number
  total_downloads: number
  total_views: number
  avg_rating: number
  most_popular_category: string
  last_updated: string
}

// Interface untuk Category Analytics
export interface CategoryAnalytics {
  category: string
  total_scripts: number
  total_downloads: number
  total_views: number
  avg_rating: number
  avg_popularity_score: number
  max_downloads: number
  min_downloads: number
}

// Interface untuk Daily Stats
export interface DailyStats {
  id: number
  date: string
  new_scripts: number
  total_downloads: number
  total_views: number
  created_at: string
}

// Interface untuk Website Settings
export interface WebsiteSettings {
  id: number
  setting_key: string
  setting_value: string
  created_at: string
  updated_at: string
}

// Buat koneksi database
export async function createConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// Test koneksi database
export async function testConnection() {
  try {
    const connection = await createConnection()
    await connection.execute("SELECT 1")
    await connection.end()
    return true
  } catch (error) {
    console.error("Database test failed:", error)
    return false
  }
}

// Ambil semua scripts dengan analytics
export async function getAllScripts(): Promise<Script[]> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute(`
      SELECT 
        s.*,
        GetPopularityScore(s.downloads, s.views, s.rating) as popularity_score,
        CASE 
          WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) THEN 'High'
          WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) * 0.5 THEN 'Medium'
          ELSE 'Low'
        END as download_performance,
        DATEDIFF(CURRENT_DATE, DATE(s.created_at)) as days_since_created
      FROM scripts s 
      ORDER BY popularity_score DESC, created_at DESC
    `)

    const scripts = rows as any[]
    return scripts.map((script) => ({
      ...script,
      tags: script.tags ? JSON.parse(script.tags) : [],
    }))
  } finally {
    await connection.end()
  }
}

// Ambil script berdasarkan ID
export async function getScriptById(id: number): Promise<Script | null> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute(
      `
      SELECT 
        s.*,
        GetPopularityScore(s.downloads, s.views, s.rating) as popularity_score,
        CASE 
          WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) THEN 'High'
          WHEN s.downloads > (SELECT AVG(downloads) FROM scripts) * 0.5 THEN 'Medium'
          ELSE 'Low'
        END as download_performance,
        DATEDIFF(CURRENT_DATE, DATE(s.created_at)) as days_since_created
      FROM scripts s 
      WHERE s.id = ?
    `,
      [id],
    )

    const scripts = rows as any[]
    if (scripts.length === 0) return null

    const script = scripts[0]
    return {
      ...script,
      tags: script.tags ? JSON.parse(script.tags) : [],
    }
  } finally {
    await connection.end()
  }
}

// Tambah script baru
export async function addScript(scriptData: {
  title: string
  category: "UI" | "SFX" | "Special"
  thumbnail?: string
  download_url: string
  is_popular?: boolean
  file_size_mb?: number
  tags?: string[]
}): Promise<Script> {
  const connection = await createConnection()
  try {
    const [result] = await connection.execute(
      `INSERT INTO scripts 
       (title, category, thumbnail, download_url, is_popular, file_size_mb, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        scriptData.title,
        scriptData.category,
        scriptData.thumbnail || "/placeholder.svg?height=200&width=300",
        scriptData.download_url,
        scriptData.is_popular || false,
        scriptData.file_size_mb || 0,
        JSON.stringify(scriptData.tags || []),
      ],
    )

    const insertResult = result as mysql.ResultSetHeader
    const newScript = await getScriptById(insertResult.insertId)

    if (!newScript) {
      throw new Error("Failed to retrieve created script")
    }

    return newScript
  } finally {
    await connection.end()
  }
}

// Update script
export async function updateScript(
  id: number,
  updates: {
    title?: string
    category?: "UI" | "SFX" | "Special"
    thumbnail?: string
    download_url?: string
    is_popular?: boolean
    file_size_mb?: number
    tags?: string[]
  },
): Promise<Script | null> {
  const connection = await createConnection()
  try {
    const setClause = []
    const values = []

    if (updates.title !== undefined) {
      setClause.push("title = ?")
      values.push(updates.title)
    }
    if (updates.category !== undefined) {
      setClause.push("category = ?")
      values.push(updates.category)
    }
    if (updates.thumbnail !== undefined) {
      setClause.push("thumbnail = ?")
      values.push(updates.thumbnail)
    }
    if (updates.download_url !== undefined) {
      setClause.push("download_url = ?")
      values.push(updates.download_url)
    }
    if (updates.is_popular !== undefined) {
      setClause.push("is_popular = ?")
      values.push(updates.is_popular)
    }
    if (updates.file_size_mb !== undefined) {
      setClause.push("file_size_mb = ?")
      values.push(updates.file_size_mb)
    }
    if (updates.tags !== undefined) {
      setClause.push("tags = ?")
      values.push(JSON.stringify(updates.tags))
    }

    if (setClause.length === 0) {
      return await getScriptById(id)
    }

    values.push(id)

    await connection.execute(
      `UPDATE scripts SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
    )

    return await getScriptById(id)
  } finally {
    await connection.end()
  }
}

// Hapus script
export async function deleteScript(id: number): Promise<boolean> {
  const connection = await createConnection()
  try {
    const [result] = await connection.execute("DELETE FROM scripts WHERE id = ?", [id])

    const deleteResult = result as mysql.ResultSetHeader
    return deleteResult.affectedRows > 0
  } finally {
    await connection.end()
  }
}

// Increment download count
export async function incrementDownloads(id: number): Promise<Script | null> {
  const connection = await createConnection()
  try {
    await connection.execute(
      "UPDATE scripts SET downloads = downloads + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
    )

    return await getScriptById(id)
  } finally {
    await connection.end()
  }
}

// Increment view count
export async function incrementViews(id: number): Promise<Script | null> {
  const connection = await createConnection()
  try {
    await connection.execute("UPDATE scripts SET views = views + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id])

    return await getScriptById(id)
  } finally {
    await connection.end()
  }
}

// Get analytics summary menggunakan fungsi agregat
export async function getAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute("SELECT * FROM analytics_summary ORDER BY last_updated DESC LIMIT 1")
    const summaries = rows as AnalyticsSummary[]
    return summaries.length > 0 ? summaries[0] : null
  } finally {
    await connection.end()
  }
}

// Get category analytics menggunakan GROUP BY dan fungsi agregat
export async function getCategoryAnalytics(): Promise<CategoryAnalytics[]> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute(`
      SELECT 
        category,
        COUNT(*) as total_scripts,
        SUM(downloads) as total_downloads,
        SUM(views) as total_views,
        ROUND(AVG(rating), 2) as avg_rating,
        ROUND(AVG(GetPopularityScore(downloads, views, rating)), 2) as avg_popularity_score,
        MAX(downloads) as max_downloads,
        MIN(downloads) as min_downloads
      FROM scripts 
      GROUP BY category
      ORDER BY total_downloads DESC
    `)
    return rows as CategoryAnalytics[]
  } finally {
    await connection.end()
  }
}

// Get top scripts menggunakan ORDER BY dan LIMIT
export async function getTopScripts(limit = 5): Promise<Script[]> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute(
      `
      SELECT 
        s.*,
        GetPopularityScore(s.downloads, s.views, s.rating) as popularity_score
      FROM scripts s 
      ORDER BY popularity_score DESC 
      LIMIT ?
    `,
      [limit],
    )

    const scripts = rows as any[]
    return scripts.map((script) => ({
      ...script,
      tags: script.tags ? JSON.parse(script.tags) : [],
    }))
  } finally {
    await connection.end()
  }
}

// Get daily stats
export async function getDailyStats(days = 7): Promise<DailyStats[]> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute(
      `
      SELECT * FROM daily_stats 
      ORDER BY date DESC 
      LIMIT ?
    `,
      [days],
    )
    return rows as DailyStats[]
  } finally {
    await connection.end()
  }
}

// Update analytics summary manual
export async function updateAnalyticsSummary(): Promise<void> {
  const connection = await createConnection()
  try {
    await connection.execute("CALL UpdateAnalyticsSummary()")
  } finally {
    await connection.end()
  }
}

// Website Settings Functions dengan error handling yang lebih baik
export async function getWebsiteSetting(key: string): Promise<string | null> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute("SELECT setting_value FROM website_settings WHERE setting_key = ?", [key])
    const settings = rows as WebsiteSettings[]
    return settings.length > 0 ? settings[0].setting_value : null
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error)
    return null
  } finally {
    await connection.end()
  }
}

export async function updateWebsiteSetting(key: string, value: string): Promise<boolean> {
  const connection = await createConnection()
  try {
    const [result] = await connection.execute(
      `INSERT INTO website_settings (setting_key, setting_value) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP`,
      [key, value, value],
    )
    const updateResult = result as mysql.ResultSetHeader
    return updateResult.affectedRows > 0
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error)
    return false
  } finally {
    await connection.end()
  }
}

export async function getAllWebsiteSettings(): Promise<Record<string, string>> {
  const connection = await createConnection()
  try {
    const [rows] = await connection.execute("SELECT setting_key, setting_value FROM website_settings")
    const settings = rows as WebsiteSettings[]
    const result: Record<string, string> = {}
    settings.forEach((setting) => {
      result[setting.setting_key] = setting.setting_value
    })
    return result
  } catch (error) {
    console.error("Error getting all settings:", error)
    return {}
  } finally {
    await connection.end()
  }
}
