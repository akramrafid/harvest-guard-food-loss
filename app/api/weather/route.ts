import { type NextRequest, NextResponse } from "next/server"

// Bangladesh division coordinates
const divisionCoordinates: Record<string, { lat: number; lng: number }> = {
  Dhaka: { lat: 23.8103, lng: 90.4125 },
  Chittagong: { lat: 22.3569, lng: 91.7832 },
  Rajshahi: { lat: 24.3745, lng: 88.6042 },
  Khulna: { lat: 22.8456, lng: 89.5403 },
  Barisal: { lat: 22.701, lng: 90.3535 },
  Sylhet: { lat: 24.8949, lng: 91.8687 },
  Rangpur: { lat: 25.7439, lng: 89.2752 },
  Mymensingh: { lat: 24.7471, lng: 90.4203 },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const division = searchParams.get("division") || "Dhaka"

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    // Return mock data if no API key is configured
    return NextResponse.json({
      source: "mock",
      forecast: generateMockWeather(),
    })
  }

  const coords = divisionCoordinates[division] || divisionCoordinates.Dhaka

  try {
    const response = await fetch(
      `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${coords.lat}&location.longitude=${coords.lng}&days=5`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )

    if (!response.ok) {
      console.log("[v0] Google Weather API error:", response.status)
      return NextResponse.json({
        source: "mock",
        forecast: generateMockWeather(),
      })
    }

    const data = await response.json()

    // Transform Google Weather API response to our format
    const forecast = data.forecastDays.map((day: any) => {
      const maxTemp = day.maxTemperature?.degrees || 30
      const minTemp = day.minTemperature?.degrees || 25
      const humidity = day.daytimeForecast?.relativeHumidity || 70
      const rainProb = day.daytimeForecast?.precipitation?.probability?.percent || 0
      const condition = day.daytimeForecast?.weatherCondition?.type || "CLEAR"

      const date = new Date(day.interval.startTime)

      return {
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        temp: Math.round((maxTemp + minTemp) / 2),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
        humidity,
        rainProb,
        condition: mapCondition(condition),
        description: day.daytimeForecast?.weatherCondition?.description?.text || "Clear",
        windSpeed: day.daytimeForecast?.wind?.speed?.value || 0,
        uvIndex: day.daytimeForecast?.uvIndex || 0,
        iconUrl: day.daytimeForecast?.weatherCondition?.iconBaseUri
          ? `${day.daytimeForecast.weatherCondition.iconBaseUri}.svg`
          : null,
        thunderstormProb: day.daytimeForecast?.thunderstormProbability || 0,
        cloudCover: day.daytimeForecast?.cloudCover || 0,
      }
    })

    return NextResponse.json({
      source: "google",
      forecast,
    })
  } catch (error) {
    console.log("[v0] Weather API fetch error:", error)
    return NextResponse.json({
      source: "mock",
      forecast: generateMockWeather(),
    })
  }
}

function mapCondition(googleCondition: string): "sunny" | "cloudy" | "rainy" {
  const rainyConditions = [
    "RAIN",
    "LIGHT_RAIN",
    "HEAVY_RAIN",
    "SCATTERED_SHOWERS",
    "SHOWERS",
    "THUNDERSTORM",
    "DRIZZLE",
  ]
  const cloudyConditions = ["CLOUDY", "PARTLY_CLOUDY", "MOSTLY_CLOUDY", "OVERCAST", "FOG", "HAZE"]

  if (rainyConditions.some((c) => googleCondition.includes(c))) return "rainy"
  if (cloudyConditions.some((c) => googleCondition.includes(c))) return "cloudy"
  return "sunny"
}

function generateMockWeather() {
  const days = []
  const today = new Date()

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const rainProb = Math.floor(Math.random() * 100)
    const maxTemp = Math.floor(28 + Math.random() * 10)
    const minTemp = maxTemp - Math.floor(Math.random() * 5) - 3

    days.push({
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      temp: Math.floor((maxTemp + minTemp) / 2),
      maxTemp,
      minTemp,
      humidity: Math.floor(60 + Math.random() * 30),
      rainProb,
      condition: rainProb > 60 ? "rainy" : rainProb > 30 ? "cloudy" : "sunny",
      description: rainProb > 60 ? "Rain expected" : rainProb > 30 ? "Partly cloudy" : "Clear skies",
      windSpeed: Math.floor(5 + Math.random() * 15),
      uvIndex: Math.floor(3 + Math.random() * 7),
      iconUrl: null,
      thunderstormProb: Math.floor(Math.random() * 100),
      cloudCover: Math.floor(Math.random() * 100),
    })
  }
  return days
}
