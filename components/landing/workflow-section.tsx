"use client"

import { useLanguage } from "@/lib/language-context"
import { Database, Bell, MousePointerClick, Sparkles, ArrowRight } from "lucide-react"

const steps = [
  { icon: Database, key: "step1", color: "bg-primary" },
  { icon: Bell, key: "step2", color: "bg-warning" },
  { icon: MousePointerClick, key: "step3", color: "bg-accent" },
  { icon: Sparkles, key: "step4", color: "bg-success" },
]

export function WorkflowSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">{t("workflow.title")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Data → Warning → Action → Saved Food
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.key} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-xl p-6 w-full">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{t(`workflow.${step.key}`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`workflow.${step.key}Desc`)}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-8 -right-3 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
