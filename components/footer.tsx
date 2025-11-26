"use client"

import { useLanguage } from "@/lib/language-context"
import { Leaf } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">HarvestGuard</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
