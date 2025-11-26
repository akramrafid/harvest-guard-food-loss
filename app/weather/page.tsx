"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Thermometer, AlertTriangle, Sun, CloudRain, Wind, Loader2, Zap } from "lucide-react"

const divisions = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]

interface WeatherDay {
  date: string
  temp: number
  maxTemp: number
  minTemp: number
  humidity: number
  rainProb: number
  condition: "sunny" | "cloudy" | "rainy"
  description: string
  windSpeed: number
  uvIndex: number
  iconUrl: string | null
  thunderstormProb: number
  cloudCover: number
}

export default function WeatherPage() {
  const { t, language } = useLanguage()
  const { isLoggedIn, crops } = useData()
  const router = useRouter()
  const [selectedDivision, setSelectedDivision] = useState(divisions[0])
  const [weather, setWeather] = useState<WeatherDay[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"google" | "mock">("mock")
  const [riskAssessments, setRiskAssessments] = useState<{ batchId: string; risk: string; etcl: number }[]>([])

  useEffect(() => {
    if (!isLoggedIn) router.push("/login")
  }, [isLoggedIn, router])

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      try {
        const response = await fetch(`/api/weather?division=${encodeURIComponent(selectedDivision)}`)
        const data = await response.json()
        setWeather(data.forecast)
        setDataSource(data.source)
      } catch (error) {
        console.log("[v0] Weather fetch error:", error)
        // Fallback to empty array, will show loading state
        setWeather([])
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [selectedDivision])

  useEffect(() => {
    if (weather.length > 0 && crops.length > 0) {
      const assessments = crops
        .filter((c) => c.status === "active")
        .map((crop) => {
          const avgHumidity = weather.reduce((sum, d) => sum + d.humidity, 0) / weather.length
          const avgTemp = weather.reduce((sum, d) => sum + d.temp, 0) / weather.length
          const maxRain = Math.max(...weather.map((d) => d.rainProb))

          let risk = "low"
          let etcl = 168

          if (avgHumidity > 80 && avgTemp > 32) {
            risk = "high"
            etcl = 72
          } else if (avgHumidity > 70 || maxRain > 70) {
            risk = "medium"
            etcl = 120
          }

          if (crop.storageType === "openField") {
            etcl = Math.floor(etcl * 0.5)
            if (risk === "low") risk = "medium"
          }

          return { batchId: crop.id, risk, etcl }
        })
      setRiskAssessments(assessments)
    }
  }, [weather, crops])

  const hasRainWarning = weather.some((d) => d.rainProb > 60)
  const hasHeatWarning = weather.some((d) => d.temp > 35)

  if (!isLoggedIn) return null

  const getWeatherIcon = (day: WeatherDay) => {
    if (day.iconUrl) {
      return (
        <img
          src={day.iconUrl || "/placeholder.svg"}
          alt={day.description}
          className="h-10 w-10"
          crossOrigin="anonymous"
        />
      )
    }
    switch (day.condition) {
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-muted-foreground" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("weather.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {dataSource === "google"
                ? language === "bn"
                  ? "লাইভ আবহাওয়া তথ্য (Google)"
                  : "Live weather data (Google)"
                : language === "bn"
                  ? "অনুমানিত আবহাওয়া তথ্য"
                  : "Simulated weather data"}
            </p>
          </div>
          <Select value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(hasRainWarning || hasHeatWarning || weather.some((d) => d.thunderstormProb > 50)) && (
          <div className="mb-8 space-y-3">
            {weather.some((d) => d.thunderstormProb > 50) && (
              <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-purple-500" />
                <p className="font-medium text-foreground">
                  {language === "bn" ? "বজ্রপাতের সম্ভাবনা - নিরাপদে থাকুন!" : "Thunderstorm possible - Stay safe!"}
                </p>
              </div>
            )}
            {hasRainWarning && (
              <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <CloudRain className="h-6 w-6 text-blue-500" />
                <p className="font-medium text-foreground">{t("weather.rainWarning")}</p>
              </div>
            )}
            {hasHeatWarning && (
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-500" />
                <p className="font-medium text-foreground">{t("weather.heatWarning")}</p>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              {language === "bn" ? "আবহাওয়া লোড হচ্ছে..." : "Loading weather..."}
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {weather.map((day, index) => (
                <Card key={index} className={index === 0 ? "border-primary" : ""}>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">{day.date}</p>
                    <div className="flex justify-center mb-3">{getWeatherIcon(day)}</div>
                    <p className="text-xs text-muted-foreground mb-1">{day.description}</p>
                    <p className="text-2xl font-bold text-foreground">{day.temp}°C</p>
                    <p className="text-xs text-muted-foreground">
                      {day.minTemp}° / {day.maxTemp}°
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Droplets className="h-4 w-4" />
                      {day.humidity}%
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Wind className="h-3 w-3" />
                      {day.windSpeed} km/h
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Cloud className="h-3 w-3" />
                      {day.cloudCover}%
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <Badge variant={day.rainProb > 60 ? "destructive" : day.rainProb > 30 ? "secondary" : "outline"}>
                        {day.rainProb}% {language === "bn" ? "বৃষ্টি" : "Rain"}
                      </Badge>
                      {day.thunderstormProb > 20 && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {day.thunderstormProb}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {riskAssessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {t("risk.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAssessments.map((assessment) => {
                      const crop = crops.find((c) => c.id === assessment.batchId)
                      if (!crop) return null

                      return (
                        <div
                          key={assessment.batchId}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {t(`crop.${crop.cropType}`)} - {crop.weight}kg
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {crop.division} • {t(`crop.${crop.storageType}`)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                assessment.risk === "high"
                                  ? "destructive"
                                  : assessment.risk === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {t(`risk.${assessment.risk}`)}
                            </Badge>
                            <div className="text-sm">
                              <span className="text-muted-foreground">{t("risk.etcl")}: </span>
                              <span className="font-medium text-foreground">
                                {assessment.etcl} {t("risk.hours")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </main>
  )
}
