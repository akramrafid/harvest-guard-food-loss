"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CropBatch {
  id: string
  cropType: string
  weight: number
  harvestDate: string
  division: string
  district: string
  storageType: string
  status: "active" | "completed" | "lost"
  createdAt: string
  riskLevel?: "low" | "medium" | "high"
  etcl?: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  language: "en" | "bn"
  badges: string[]
}

interface DataContextType {
  user: User | null
  setUser: (user: User | null) => void
  crops: CropBatch[]
  addCrop: (crop: Omit<CropBatch, "id" | "createdAt" | "status">) => void
  updateCrop: (id: string, updates: Partial<CropBatch>) => void
  deleteCrop: (id: string) => void
  exportCSV: () => void
  exportJSON: () => void
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { name: string; email: string; password: string; phone: string }) => Promise<boolean>
  logout: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [crops, setCrops] = useState<CropBatch[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem("harvestguard-user")
    const savedCrops = localStorage.getItem("harvestguard-crops")
    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedCrops) setCrops(JSON.parse(savedCrops))
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem("harvestguard-user", JSON.stringify(user))
    else localStorage.removeItem("harvestguard-user")
  }, [user])

  useEffect(() => {
    localStorage.setItem("harvestguard-crops", JSON.stringify(crops))
  }, [crops])

  const addCrop = (crop: Omit<CropBatch, "id" | "createdAt" | "status">) => {
    const newCrop: CropBatch = {
      ...crop,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "active",
    }
    setCrops((prev) => [...prev, newCrop])

    if (user && !user.badges.includes("firstHarvest")) {
      setUser({ ...user, badges: [...user.badges, "firstHarvest"] })
    }
  }

  const updateCrop = (id: string, updates: Partial<CropBatch>) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id))
  }

  const exportCSV = () => {
    const headers = [
      "ID",
      "Crop Type",
      "Weight (kg)",
      "Harvest Date",
      "Division",
      "District",
      "Storage Type",
      "Status",
      "Created At",
    ]
    const rows = crops.map((c) => [
      c.id,
      c.cropType,
      c.weight,
      c.harvestDate,
      c.division,
      c.district,
      c.storageType,
      c.status,
      c.createdAt,
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    downloadFile(csv, "harvestguard-crops.csv", "text/csv")
  }

  const exportJSON = () => {
    downloadFile(JSON.stringify(crops, null, 2), "harvestguard-crops.json", "application/json")
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const savedUsers = JSON.parse(localStorage.getItem("harvestguard-users") || "[]")
    const found = savedUsers.find(
      (u: { email: string; password: string }) => u.email === email && u.password === password,
    )
    if (found) {
      const { password: _, ...userData } = found
      setUser(userData)
      return true
    }
    return false
  }

  const register = async (data: { name: string; email: string; password: string; phone: string }): Promise<boolean> => {
    const savedUsers = JSON.parse(localStorage.getItem("harvestguard-users") || "[]")
    if (savedUsers.find((u: { email: string }) => u.email === data.email)) return false

    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      language: "en" as const,
      badges: [],
    }

    localStorage.setItem("harvestguard-users", JSON.stringify([...savedUsers, newUser]))
    const { password: _, ...userData } = newUser
    setUser(userData)
    return true
  }

  const logout = () => {
    setUser(null)
    setCrops([])
  }

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        crops,
        addCrop,
        updateCrop,
        deleteCrop,
        exportCSV,
        exportJSON,
        isLoggedIn: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error("useData must be used within DataProvider")
  return context
}
