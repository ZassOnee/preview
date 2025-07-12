// Global data store - dalam production bisa diganti dengan database
export interface Script {
  id: number
  title: string
  category: string
  thumbnail: string
  downloads: number
  isPopular: boolean
  downloadUrl: string
  createdAt: string
}

// Initial data
const scriptsData: Script[] = [
  {
    id: 1,
    title: "Modern Login Form UI",
    category: "UI",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 1250,
    isPopular: true,
    downloadUrl: "https://example.com/script1.zip",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Button Click Sound Effect",
    category: "SFX",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 890,
    isPopular: false,
    downloadUrl: "https://example.com/script2.zip",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Particle Animation System",
    category: "Special",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 2100,
    isPopular: true,
    downloadUrl: "https://example.com/script3.zip",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Dashboard Template",
    category: "UI",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 1680,
    isPopular: true,
    downloadUrl: "https://example.com/script4.zip",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Notification Sound Pack",
    category: "SFX",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 750,
    isPopular: false,
    downloadUrl: "https://example.com/script5.zip",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Loading Spinner Collection",
    category: "Special",
    thumbnail: "/placeholder.svg?height=200&width=300",
    downloads: 1420,
    isPopular: false,
    downloadUrl: "https://example.com/script6.zip",
    createdAt: new Date().toISOString(),
  },
]

// Data access functions
export const getAllScripts = (): Script[] => {
  return [...scriptsData]
}

export const getScriptById = (id: number): Script | undefined => {
  return scriptsData.find((script) => script.id === id)
}

export const addScript = (scriptData: Omit<Script, "id" | "createdAt" | "downloads">): Script => {
  const newScript: Script = {
    ...scriptData,
    id: Date.now(),
    downloads: 0,
    createdAt: new Date().toISOString(),
  }
  scriptsData.push(newScript)
  return newScript
}

export const updateScript = (id: number, updates: Partial<Script>): Script | null => {
  const index = scriptsData.findIndex((script) => script.id === id)
  if (index === -1) return null

  scriptsData[index] = { ...scriptsData[index], ...updates }
  return scriptsData[index]
}

export const deleteScript = (id: number): boolean => {
  const index = scriptsData.findIndex((script) => script.id === id)
  if (index === -1) return false

  scriptsData.splice(index, 1)
  return true
}

export const incrementDownloads = (id: number): void => {
  const script = scriptsData.find((s) => s.id === id)
  if (script) {
    script.downloads += 1
  }
}
