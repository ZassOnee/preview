"use client"

import { useState, useEffect } from "react"
import { BarChart3, Eye, Download, Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import type { AnalyticsSummary, CategoryAnalytics, Script, DailyStats } from "@/lib/database"

interface AnalyticsData {
  summary: AnalyticsSummary | null
  categoryAnalytics: CategoryAnalytics[]
  topScripts: Script[]
  dailyStats: DailyStats[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/analytics")
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to fetch analytics")
      }
    } catch (err) {
      setError("Failed to connect to server")
      console.error("Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Memuat analytics...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchAnalytics} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Statistik dan analisis data Script Gratis</p>
          </div>
          <Button onClick={fetchAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        {data?.summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scripts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.total_scripts.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.total_downloads.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.total_views.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.avg_rating.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Most Popular: {data.summary.most_popular_category}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.categoryAnalytics.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {category.category}
                      </Badge>
                      <div className="text-sm text-gray-600">
                        {category.total_scripts} scripts • Rating: {category.avg_rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{category.total_downloads.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">downloads</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Scripts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Scripts (by Popularity Score)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topScripts.map((script, index) => (
                  <div key={script.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{script.title}</div>
                      <div className="text-sm text-gray-600">
                        {script.downloads} downloads • {script.views} views
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{script.popularity_score?.toFixed(0)} pts</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Stats */}
        {data?.dailyStats && data.dailyStats.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Statistik 7 Hari Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {data.dailyStats.reverse().map((stat) => (
                  <div key={stat.id} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium">
                      {new Date(stat.date).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-lg font-bold text-blue-600 mt-1">{stat.total_downloads.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">downloads</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
