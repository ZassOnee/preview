"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Lock,
  LogOut,
  RefreshCw,
  AlertTriangle,
  ImageIcon,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { Script } from "@/lib/data"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingScript, setEditingScript] = useState<Script | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    thumbnail: "",
    downloadUrl: "",
    isPopular: false,
  })

  // Website Settings State
  const [websiteSettings, setWebsiteSettings] = useState({
    site_logo: "",
    site_name: "",
    site_background: "",
    background_overlay_opacity: "0.7",
    enable_parallax: "true",
  })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  // Disable scroll effects when modal is open
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      document.body.classList.add("modal-open")
      document.body.style.overflow = "hidden"

      // Disable all scroll animations
      const parallaxElements = document.querySelectorAll(".parallax-element")
      parallaxElements.forEach((el) => {
        ;(el as HTMLElement).style.transform = "none"
      })

      const floatingElements = document.querySelectorAll(".float-on-scroll")
      floatingElements.forEach((el) => {
        ;(el as HTMLElement).style.transform = "none"
      })
    } else {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
    }

    return () => {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
    }
  }, [isAddModalOpen, isEditModalOpen])

  // Check if image URL is valid
  const isValidImageUrl = (url: string) => {
    if (!url) return true // Empty is OK

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const hasImageExtension = imageExtensions.some((ext) => url.toLowerCase().includes(ext))

    const allowedDomains = [
      "imgur.com",
      "github.com",
      "raw.githubusercontent.com",
      "unsplash.com",
      "pexels.com",
      "pixabay.com",
      "cloudinary.com",
      "amazonaws.com",
    ]

    const isFromAllowedDomain = allowedDomains.some((domain) => url.includes(domain))

    const blockedDomains = ["pinterest.com", "facebook.com", "instagram.com", "twitter.com", "tiktok.com"]

    const isFromBlockedDomain = blockedDomains.some((domain) => url.includes(domain))

    return (hasImageExtension || isFromAllowedDomain) && !isFromBlockedDomain
  }

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch scripts and settings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchScripts()
      fetchWebsiteSettings()
    }
  }, [isAuthenticated])

  // Setup website settings table
  const setupSettingsTable = async () => {
    try {
      setSettingsLoading(true)
      setSettingsError(null)
      const response = await fetch("/api/setup-settings")
      const result = await response.json()

      if (result.success) {
        alert("Tabel website settings berhasil dibuat!")
        fetchWebsiteSettings() // Refresh settings after setup
      } else {
        setSettingsError(result.error || "Failed to setup settings table")
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      setSettingsError("Failed to connect to server")
      alert("Gagal setup tabel settings")
      console.error("Error setting up settings table:", err)
    } finally {
      setSettingsLoading(false)
    }
  }

  // Fetch scripts from API
  const fetchScripts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/scripts")
      const result = await response.json()

      if (result.success) {
        setScripts(result.data)
      } else {
        setError(result.error || "Failed to fetch scripts")
      }
    } catch (err) {
      setError("Failed to connect to server")
      console.error("Error fetching scripts:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch website settings
  const fetchWebsiteSettings = async () => {
    try {
      setSettingsLoading(true)
      setSettingsError(null)
      const response = await fetch("/api/settings")
      const result = await response.json()

      if (result.success) {
        setWebsiteSettings({
          site_logo: result.data.site_logo || "",
          site_name: result.data.site_name || "Script Gratis",
          site_background: result.data.site_background || "",
          background_overlay_opacity: result.data.background_overlay_opacity || "0.7",
          enable_parallax: result.data.enable_parallax || "true",
        })
      } else {
        // If table doesn't exist, show setup option
        if (result.error?.includes("doesn't exist")) {
          setSettingsError("Tabel website settings belum ada. Klik 'Setup Database' untuk membuat tabel.")
        } else {
          setSettingsError(result.error || "Failed to fetch settings")
        }
      }
    } catch (err) {
      setSettingsError("Failed to connect to server")
      console.error("Error fetching settings:", err)
    } finally {
      setSettingsLoading(false)
    }
  }

  // Update website setting
  const updateWebsiteSetting = async (key: string, value: string) => {
    try {
      setSettingsLoading(true)
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })

      const result = await response.json()
      if (result.success) {
        setWebsiteSettings((prev) => ({ ...prev, [key]: value }))
        alert("Pengaturan berhasil disimpan!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert("Gagal menyimpan pengaturan")
      console.error("Error updating setting:", err)
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "mlbbull2710") {
      setIsAuthenticated(true)
      setLoginError("")
      localStorage.setItem("adminAuthenticated", "true")
      setPassword("")
    } else {
      setLoginError("Password salah. Silakan coba lagi.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    setLoginError("")
    setScripts([])
    localStorage.removeItem("adminAuthenticated")
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      thumbnail: "",
      downloadUrl: "",
      isPopular: false,
    })
  }

  const handleAdd = async () => {
    if (!formData.title.trim() || !formData.category || !formData.downloadUrl.trim()) {
      alert("Mohon lengkapi semua field yang wajib diisi!")
      return
    }

    if (formData.thumbnail && !isValidImageUrl(formData.thumbnail)) {
      alert("URL thumbnail tidak valid! Gunakan direct image link atau layanan hosting yang didukung.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        resetForm()
        setIsAddModalOpen(false)
        fetchScripts() // Refresh the list
        alert("Script berhasil ditambahkan!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert("Gagal menambahkan script. Silakan coba lagi.")
      console.error("Error adding script:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (script: Script) => {
    setEditingScript(script)
    setFormData({
      title: script.title || "",
      category: script.category || "",
      thumbnail: script.thumbnail || "",
      downloadUrl: script.download_url || "",
      isPopular: script.is_popular || false,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingScript || !formData.title.trim() || !formData.category || !formData.downloadUrl.trim()) {
      alert("Mohon lengkapi semua field yang wajib diisi!")
      return
    }

    if (formData.thumbnail && !isValidImageUrl(formData.thumbnail)) {
      alert("URL thumbnail tidak valid! Gunakan direct image link atau layanan hosting yang didukung.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/scripts/${editingScript.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setEditingScript(null)
        resetForm()
        setIsEditModalOpen(false)
        fetchScripts() // Refresh the list
        alert("Script berhasil diperbarui!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert("Gagal memperbarui script. Silakan coba lagi.")
      console.error("Error updating script:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scripts/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        fetchScripts() // Refresh the list
        alert("Script berhasil dihapus!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert("Gagal menghapus script. Silakan coba lagi.")
      console.error("Error deleting script:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingScript(null)
    resetForm()
    setIsEditModalOpen(false)
  }

  const handleCancelAdd = () => {
    resetForm()
    setIsAddModalOpen(false)
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="modern-card w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-primary to-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dynamic-primary mb-2">Admin Login</h1>
            <p className="text-dynamic-secondary">Masukkan password untuk mengakses panel admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-dynamic-primary">
                Password Admin
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="mt-1"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <Button type="submit" className="w-full btn-primary">
              Masuk ke Admin Panel
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dynamic-muted">Hanya administrator yang dapat mengakses halaman ini</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Page Header with Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-dynamic-primary mb-2">Admin Panel</h1>
          <p className="text-dynamic-secondary">Kelola script dan pengaturan website</p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Button
            onClick={fetchScripts}
            variant="outline"
            size="sm"
            disabled={loading}
            className="glass-card border-dynamic text-dynamic-primary hover:bg-dynamic-card bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="glass-card border-red-300/50 text-red-100 hover:bg-red-500/20 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scripts" className="space-y-6">
        <TabsList className="glass-card border-dynamic">
          <TabsTrigger value="scripts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Kelola Script
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Pengaturan Website
          </TabsTrigger>
        </TabsList>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-dynamic-primary">Kelola Script Gratis</h2>
            <Button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Script
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">Error: {error}</div>
          )}

          {/* Scripts Table */}
          <div className="modern-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dynamic-card border-b border-dynamic">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-dynamic-primary">Script</th>
                    <th className="text-left py-4 px-6 font-semibold text-dynamic-primary">Kategori</th>
                    <th className="text-left py-4 px-6 font-semibold text-dynamic-primary">Downloads</th>
                    <th className="text-left py-4 px-6 font-semibold text-dynamic-primary">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-dynamic-primary">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dynamic">
                  {scripts.map((script) => (
                    <tr key={script.id} className="hover:bg-dynamic-card transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Image
                              src={script.thumbnail || "/placeholder.svg"}
                              alt={script.title}
                              width={60}
                              height={40}
                              className="rounded-lg object-cover"
                              unoptimized
                            />
                            {script.thumbnail && !isValidImageUrl(script.thumbnail) && (
                              <div className="absolute -top-1 -right-1">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-dynamic-primary">{script.title}</div>
                            {script.thumbnail && !isValidImageUrl(script.thumbnail) && (
                              <div className="text-xs text-yellow-600">⚠️ URL gambar tidak valid</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                          {script.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-dynamic-secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          {script.downloads.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {script.isPopular && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Populer
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(script)} disabled={loading}>
                            <Edit className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                disabled={loading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Script</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus script "{script.title}"? Tindakan ini tidak dapat
                                  dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(script.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {!loading && scripts.length === 0 && (
            <div className="text-center py-16">
              <div className="modern-card max-w-md mx-auto">
                <Plus className="w-16 h-16 mx-auto text-dynamic-muted mb-4" />
                <h3 className="text-xl font-semibold text-dynamic-secondary mb-2">Belum ada script</h3>
                <p className="text-dynamic-muted mb-4">Mulai dengan menambahkan script pertama Anda</p>
                <Button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Script
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold text-dynamic-primary mb-6">Pengaturan Website</h2>

          {/* Settings Error Display */}
          {settingsError && (
            <div className="modern-card bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Setup Database Diperlukan</h3>
                  <p className="text-yellow-700 text-sm">{settingsError}</p>
                </div>
              </div>
              <Button onClick={setupSettingsTable} disabled={settingsLoading} className="btn-primary">
                <Database className="w-4 h-4 mr-2" />
                {settingsLoading ? "Setting up..." : "Setup Database"}
              </Button>
            </div>
          )}

          <div className="grid gap-6">
            {/* Logo Settings */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-dynamic-primary">
                  <ImageIcon className="w-5 h-5" />
                  Logo Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-dynamic-card flex items-center justify-center border-2 border-dynamic">
                      {websiteSettings.site_logo ? (
                        <Image
                          src={websiteSettings.site_logo || "/placeholder.svg"}
                          alt="Site Logo"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-dynamic-muted" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor="site_logo" className="text-dynamic-primary">
                        URL Logo
                      </Label>
                      <Input
                        id="site_logo"
                        value={websiteSettings.site_logo}
                        onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, site_logo: e.target.value }))}
                        placeholder="https://imgur.com/logo.png"
                        className="mt-1"
                        disabled={!!settingsError}
                      />
                      <p className="text-xs text-dynamic-muted mt-1">
                        Gunakan direct image link dari Imgur, GitHub, atau Unsplash
                      </p>
                    </div>
                    <Button
                      onClick={() => updateWebsiteSetting("site_logo", websiteSettings.site_logo)}
                      disabled={settingsLoading || !!settingsError}
                      className="btn-primary"
                    >
                      {settingsLoading ? "Menyimpan..." : "Simpan Logo"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Site Name Settings */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-dynamic-primary">Nama Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site_name" className="text-dynamic-primary">
                    Nama Website
                  </Label>
                  <Input
                    id="site_name"
                    value={websiteSettings.site_name}
                    onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                    placeholder="Script Gratis"
                    className="mt-1"
                    disabled={!!settingsError}
                  />
                </div>
                <Button
                  onClick={() => updateWebsiteSetting("site_name", websiteSettings.site_name)}
                  disabled={settingsLoading || !!settingsError}
                  className="btn-primary"
                >
                  {settingsLoading ? "Menyimpan..." : "Simpan Nama"}
                </Button>
              </CardContent>
            </Card>

            {/* Background Settings */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-dynamic-primary">
                  <ImageIcon className="w-5 h-5" />
                  Background Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Background Image */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site_background" className="text-dynamic-primary">
                      URL Background Image
                    </Label>
                    <Input
                      id="site_background"
                      value={websiteSettings.site_background}
                      onChange={(e) => setWebsiteSettings((prev) => ({ ...prev, site_background: e.target.value }))}
                      placeholder="https://imgur.com/background.jpg"
                      className="mt-1"
                      disabled={!!settingsError}
                    />
                    <p className="text-xs text-dynamic-muted mt-1">
                      Kosongkan untuk menggunakan gradient default. Gunakan gambar beresolusi tinggi untuk hasil
                      terbaik.
                    </p>
                  </div>

                  {/* Background Preview */}
                  {websiteSettings.site_background && (
                    <div className="relative">
                      <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-dynamic relative">
                        <Image
                          src={websiteSettings.site_background || "/placeholder.svg"}
                          alt="Background Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div
                          className="absolute inset-0 bg-black transition-opacity"
                          style={{
                            opacity: Math.min(Number.parseFloat(websiteSettings.background_overlay_opacity), 0.85),
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded">
                            Preview Background
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => updateWebsiteSetting("site_background", websiteSettings.site_background)}
                    disabled={settingsLoading || !!settingsError}
                    className="btn-primary"
                  >
                    {settingsLoading ? "Menyimpan..." : "Simpan Background"}
                  </Button>
                </div>

                {/* Overlay Opacity */}
                <div className="space-y-4 border-t border-dynamic pt-4">
                  <div>
                    <Label htmlFor="background_overlay_opacity" className="text-dynamic-primary">
                      Opacity Overlay (
                      {Math.round(Math.min(Number.parseFloat(websiteSettings.background_overlay_opacity), 0.85) * 100)}%
                      - Max 85%)
                    </Label>
                    <input
                      type="range"
                      id="background_overlay_opacity"
                      min="0"
                      max="0.85"
                      step="0.05"
                      value={Math.min(Number.parseFloat(websiteSettings.background_overlay_opacity), 0.85)}
                      onChange={(e) =>
                        setWebsiteSettings((prev) => ({ ...prev, background_overlay_opacity: e.target.value }))
                      }
                      className="w-full mt-2 accent-primary"
                      disabled={!!settingsError}
                    />
                    <p className="text-xs text-dynamic-muted mt-1">
                      Mengatur transparansi overlay gelap di atas background image. Maksimal 85% untuk mencegah layar
                      hitam total.
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      updateWebsiteSetting(
                        "background_overlay_opacity",
                        Math.min(Number.parseFloat(websiteSettings.background_overlay_opacity), 0.85).toString(),
                      )
                    }
                    disabled={settingsLoading || !!settingsError}
                    className="btn-primary"
                  >
                    {settingsLoading ? "Menyimpan..." : "Simpan Opacity"}
                  </Button>
                </div>

                {/* Parallax Effect */}
                <div className="space-y-4 border-t border-dynamic pt-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="enable_parallax"
                      checked={websiteSettings.enable_parallax === "true"}
                      onCheckedChange={(checked) =>
                        setWebsiteSettings((prev) => ({ ...prev, enable_parallax: checked ? "true" : "false" }))
                      }
                      disabled={!!settingsError}
                    />
                    <div>
                      <Label htmlFor="enable_parallax" className="font-medium text-dynamic-primary">
                        Enable Parallax Effect
                      </Label>
                      <p className="text-xs text-dynamic-muted">
                        Efek parallax membuat background bergerak lebih lambat saat scroll untuk efek visual yang
                        menarik.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => updateWebsiteSetting("enable_parallax", websiteSettings.enable_parallax)}
                    disabled={settingsLoading || !!settingsError}
                    className="btn-primary"
                  >
                    {settingsLoading ? "Menyimpan..." : "Simpan Parallax"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Script Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md modern-card fixed-modal">
          <DialogHeader>
            <DialogTitle className="text-dynamic-primary">Tambah Script Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label htmlFor="title" className="text-dynamic-primary">
                Judul Script *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul script"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-dynamic-primary">
                Kategori *
              </Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UI">UI</SelectItem>
                  <SelectItem value="SFX">SFX</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="thumbnail" className="text-dynamic-primary">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://imgur.com/image.jpg"
                className="mt-1"
              />
              {formData.thumbnail && !isValidImageUrl(formData.thumbnail) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  ⚠️ URL ini mungkin tidak akan menampilkan gambar. Gunakan direct image link.
                </div>
              )}
              <div className="mt-2 text-xs text-dynamic-muted">
                Gunakan direct image link dari Imgur, GitHub, atau Unsplash
              </div>
            </div>

            <div>
              <Label htmlFor="downloadUrl" className="text-dynamic-primary">
                Download URL *
              </Label>
              <Input
                id="downloadUrl"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                placeholder="https://example.com/script.zip"
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="popular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
              />
              <Label htmlFor="popular" className="text-dynamic-primary">
                Tandai sebagai "Populer"
              </Label>
            </div>

            <div className="flex gap-2 pt-4 sticky bottom-0 bg-white border-t border-dynamic mt-6 pt-4">
              <Button onClick={handleAdd} className="flex-1 btn-primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelAdd}
                className="flex-1 bg-transparent border-dynamic text-dynamic-primary"
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Script Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md modern-card fixed-modal">
          <DialogHeader>
            <DialogTitle className="text-dynamic-primary">Edit Script</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <Label htmlFor="edit-title" className="text-dynamic-primary">
                Judul Script *
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-category" className="text-dynamic-primary">
                Kategori *
              </Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UI">UI</SelectItem>
                  <SelectItem value="SFX">SFX</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-thumbnail" className="text-dynamic-primary">
                Thumbnail URL
              </Label>
              <Input
                id="edit-thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://imgur.com/image.jpg"
                className="mt-1"
              />
              {formData.thumbnail && !isValidImageUrl(formData.thumbnail) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  ⚠️ URL ini mungkin tidak akan menampilkan gambar. Gunakan direct image link.
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="edit-downloadUrl" className="text-dynamic-primary">
                Download URL *
              </Label>
              <Input
                id="edit-downloadUrl"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-popular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked as boolean })}
              />
              <Label htmlFor="edit-popular" className="text-dynamic-primary">
                Tandai sebagai "Populer"
              </Label>
            </div>

            <div className="flex gap-2 pt-4 sticky bottom-0 bg-white border-t border-dynamic mt-6 pt-4">
              <Button onClick={handleUpdate} className="flex-1 btn-primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1 bg-transparent border-dynamic text-dynamic-primary"
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
