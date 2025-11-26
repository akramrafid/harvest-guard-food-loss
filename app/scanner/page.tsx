"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function ScannerPage() {
  const { t } = useLanguage()
  const { isLoggedIn } = useData()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<"fresh" | "rotten" | null>(null)
  const [confidence, setConfidence] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) router.push("/login")
  }, [isLoggedIn, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        analyzeImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    setAnalyzing(true)
    setResult(null)

    setTimeout(() => {
      const isFresh = Math.random() > 0.4
      setResult(isFresh ? "fresh" : "rotten")
      setConfidence(Math.floor(75 + Math.random() * 20))
      setAnalyzing(false)
    }, 2000)
  }

  const resetScanner = () => {
    setImage(null)
    setResult(null)
    setConfidence(0)
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">{t("scanner.title")}</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Camera className="h-5 w-5" />
              {t("scanner.instruction")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!image ? (
              <div
                className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">{t("scanner.upload")}</p>
                <p className="text-sm text-muted-foreground">{t("scanner.instruction")}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={image || "/placeholder.svg"} alt="Uploaded crop" className="w-full h-full object-cover" />
                </div>

                {analyzing && (
                  <div className="flex items-center justify-center gap-3 py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-lg font-medium">{t("scanner.analyzing")}</p>
                  </div>
                )}

                {result && (
                  <div
                    className={`p-6 rounded-xl text-center ${result === "fresh" ? "bg-success/10" : "bg-destructive/10"}`}
                  >
                    <div className="flex justify-center mb-4">
                      {result === "fresh" ? (
                        <CheckCircle className="h-16 w-16 text-success" />
                      ) : (
                        <XCircle className="h-16 w-16 text-destructive" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-2">{t(`scanner.${result}`)}</p>
                    <p className="text-muted-foreground">{confidence}% confidence</p>
                  </div>
                )}

                {result && (
                  <Button className="w-full" onClick={resetScanner}>
                    Scan Another
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
