"use client"

import { useLanguage } from "@/lib/language-context"
import { Cloud, Brain, Camera, WifiOff } from "lucide-react"

const features = [
  { icon: Cloud, key: "weather", color: "bg-blue-500" },
  { icon: Brain, key: "prediction", color: "bg-purple-500" },
  { icon: Camera, key: "scanner", color: "bg-green-500" },
  { icon: WifiOff, key: "offline", color: "bg-orange-500" },
]

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">{t("features.title")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(`features.${feature.key}`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`features.${feature.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
