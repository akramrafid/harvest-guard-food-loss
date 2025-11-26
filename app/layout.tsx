import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { DataProvider } from "@/lib/data-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "HarvestGuard - Protect Your Harvest",
  description:
    "Tech-based solution to reduce food loss in Bangladesh. Smart weather alerts, risk prediction, and crop health scanning for farmers.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <DataProvider>
            <Header />
            {children}
            <Footer />
          </DataProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
