"use client"

import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wheat, Shield, TrendingDown } from "lucide-react"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-primary/5 py-16 md:py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Shield className="h-5 w-5" />
            <span className="font-medium">HarvestGuard Bangladesh</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">{t("hero.title")}</h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">{t("hero.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
              >
                <Wheat className="mr-2 h-5 w-5" />
                {t("hero.cta")}
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mx-auto mb-4">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{t("stats.foodLoss")}</div>
              <div className="text-muted-foreground">{t("stats.foodLossLabel")}</div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{t("stats.economicLoss")}</div>
              <div className="text-muted-foreground">{t("stats.economicLossLabel")}</div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-earth/10 rounded-full mx-auto mb-4">
                <Wheat className="h-6 w-6 text-earth" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{t("stats.stapleLoss")}</div>
              <div className="text-muted-foreground">{t("stats.stapleLossLabel")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
