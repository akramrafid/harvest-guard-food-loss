"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X, Globe } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { isLoggedIn, logout } = useData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HarvestGuard</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.home")}
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.dashboard")}
                </Link>
                <Link href="/weather" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.weather")}
                </Link>
                <Link href="/scanner" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.scanner")}
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "বাংলা" : "English"}
            </Button>

            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t("nav.register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-lg py-2" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.home")}
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/dashboard" className="text-lg py-2" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.dashboard")}
                  </Link>
                  <Link href="/weather" className="text-lg py-2" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.weather")}
                  </Link>
                  <Link href="/scanner" className="text-lg py-2" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.scanner")}
                  </Link>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="w-full justify-center"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "বাংলা" : "English"}
              </Button>
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                >
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">{t("nav.register")}</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
