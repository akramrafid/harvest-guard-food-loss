"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "bn"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<string, Record<Language, string>> = {
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.dashboard": { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  "nav.weather": { en: "Weather", bn: "আবহাওয়া" },
  "nav.scanner": { en: "Crop Scanner", bn: "ফসল স্ক্যানার" },
  "nav.login": { en: "Login", bn: "লগইন" },
  "nav.register": { en: "Register", bn: "নিবন্ধন" },
  "hero.title": { en: "Protect Your Harvest", bn: "আপনার ফসল রক্ষা করুন" },
  "hero.subtitle": {
    en: "Smart technology to reduce food loss in Bangladesh",
    bn: "বাংলাদেশে খাদ্য অপচয় কমাতে স্মার্ট প্রযুক্তি",
  },
  "hero.cta": { en: "Register as Farmer", bn: "কৃষক হিসেবে নিবন্ধন করুন" },
  "stats.foodLoss": { en: "4.5M Tons", bn: "৪.৫ মিলিয়ন টন" },
  "stats.foodLossLabel": { en: "Food Lost Yearly", bn: "বার্ষিক খাদ্য অপচয়" },
  "stats.economicLoss": { en: "$1.5 Billion", bn: "১.৫ বিলিয়ন ডলার" },
  "stats.economicLossLabel": { en: "Economic Loss", bn: "অর্থনৈতিক ক্ষতি" },
  "stats.stapleLoss": { en: "12-32%", bn: "১২-৩২%" },
  "stats.stapleLossLabel": { en: "Staple Crop Loss", bn: "প্রধান ফসলের ক্ষতি" },
  "workflow.title": { en: "How HarvestGuard Works", bn: "হার্ভেস্টগার্ড কিভাবে কাজ করে" },
  "workflow.step1": { en: "Collect Data", bn: "ডেটা সংগ্রহ" },
  "workflow.step1Desc": { en: "Register your crops and storage conditions", bn: "আপনার ফসল এবং সংরক্ষণ অবস্থা নিবন্ধন করুন" },
  "workflow.step2": { en: "Get Warning", bn: "সতর্কতা পান" },
  "workflow.step2Desc": {
    en: "Receive alerts based on weather and conditions",
    bn: "আবহাওয়া এবং অবস্থার উপর ভিত্তি করে সতর্কতা পান",
  },
  "workflow.step3": { en: "Take Action", bn: "পদক্ষেপ নিন" },
  "workflow.step3Desc": { en: "Follow simple guidance to protect crops", bn: "ফসল রক্ষা করতে সহজ নির্দেশনা অনুসরণ করুন" },
  "workflow.step4": { en: "Save Food", bn: "খাদ্য বাঁচান" },
  "workflow.step4Desc": { en: "Reduce loss and increase your income", bn: "অপচয় কমান এবং আপনার আয় বাড়ান" },
  "features.title": { en: "Features", bn: "বৈশিষ্ট্য" },
  "features.weather": { en: "Weather Alerts", bn: "আবহাওয়া সতর্কতা" },
  "features.weatherDesc": { en: "Hyper-local 5-day forecasts for your area", bn: "আপনার এলাকার জন্য ৫ দিনের পূর্বাভাস" },
  "features.prediction": { en: "Risk Prediction", bn: "ঝুঁকি পূর্বাভাস" },
  "features.predictionDesc": { en: "AI-powered spoilage predictions", bn: "এআই চালিত পচন পূর্বাভাস" },
  "features.scanner": { en: "Crop Scanner", bn: "ফসল স্ক্যানার" },
  "features.scannerDesc": { en: "Upload photos to check crop health", bn: "ফসলের স্বাস্থ্য পরীক্ষা করতে ছবি আপলোড করুন" },
  "features.offline": { en: "Works Offline", bn: "অফলাইনে কাজ করে" },
  "features.offlineDesc": { en: "Access your data without internet", bn: "ইন্টারনেট ছাড়াই আপনার ডেটা অ্যাক্সেস করুন" },
  "cta.title": { en: "Start Protecting Your Harvest Today", bn: "আজই আপনার ফসল রক্ষা শুরু করুন" },
  "cta.subtitle": {
    en: "Join thousands of farmers reducing food loss",
    bn: "খাদ্য অপচয় কমাতে হাজার হাজার কৃষকদের সাথে যোগ দিন",
  },
  "footer.copyright": {
    en: "© 2025 HarvestGuard. Protecting Bangladesh's Harvest.",
    bn: "© ২০২৫ হার্ভেস্টগার্ড। বাংলাদেশের ফসল রক্ষা করছে।",
  },
  "dashboard.title": { en: "Farmer Dashboard", bn: "কৃষক ড্যাশবোর্ড" },
  "dashboard.activeBatches": { en: "Active Batches", bn: "সক্রিয় ব্যাচ" },
  "dashboard.completedBatches": { en: "Completed Batches", bn: "সম্পন্ন ব্যাচ" },
  "dashboard.lossEvents": { en: "Loss Events", bn: "ক্ষতির ঘটনা" },
  "dashboard.successRate": { en: "Success Rate", bn: "সাফল্যের হার" },
  "dashboard.addCrop": { en: "Add New Crop Batch", bn: "নতুন ফসল ব্যাচ যোগ করুন" },
  "crop.type": { en: "Crop Type", bn: "ফসলের ধরন" },
  "crop.rice": { en: "Rice", bn: "ধান" },
  "crop.wheat": { en: "Wheat", bn: "গম" },
  "crop.weight": { en: "Weight (kg)", bn: "ওজন (কেজি)" },
  "crop.harvestDate": { en: "Harvest Date", bn: "ফসল কাটার তারিখ" },
  "crop.division": { en: "Division", bn: "বিভাগ" },
  "crop.district": { en: "District", bn: "জেলা" },
  "crop.storageType": { en: "Storage Type", bn: "সংরক্ষণের ধরন" },
  "crop.silo": { en: "Silo", bn: "সাইলো" },
  "crop.juteBag": { en: "Jute Bag", bn: "পাটের বস্তা" },
  "crop.openField": { en: "Open Field", bn: "খোলা মাঠ" },
  "crop.save": { en: "Save Batch", bn: "ব্যাচ সংরক্ষণ করুন" },
  "weather.title": { en: "Weather Forecast", bn: "আবহাওয়ার পূর্বাভাস" },
  "weather.temperature": { en: "Temperature", bn: "তাপমাত্রা" },
  "weather.humidity": { en: "Humidity", bn: "আর্দ্রতা" },
  "weather.rain": { en: "Rain Probability", bn: "বৃষ্টির সম্ভাবনা" },
  "weather.advisory": { en: "Advisory", bn: "পরামর্শ" },
  "weather.rainWarning": {
    en: "Rain expected in next 3 days: Cover your rice today!",
    bn: "আগামী ৩ দিন বৃষ্টি: আজই ধান ঢেকে রাখুন",
  },
  "weather.heatWarning": { en: "Temperature 36°C: Dry crops in ventilated area", bn: "তাপমাত্রা ৩৬°C: শস্য বাতাসে শুকান" },
  "risk.title": { en: "Risk Assessment", bn: "ঝুঁকি মূল্যায়ন" },
  "risk.high": { en: "High Risk", bn: "উচ্চ ঝুঁকি" },
  "risk.medium": { en: "Medium Risk", bn: "মাঝারি ঝুঁকি" },
  "risk.low": { en: "Low Risk", bn: "কম ঝুঁকি" },
  "risk.etcl": { en: "Time to Critical Loss", bn: "সংকটময় ক্ষতি পর্যন্ত সময়" },
  "risk.hours": { en: "hours", bn: "ঘন্টা" },
  "scanner.title": { en: "Crop Health Scanner", bn: "ফসল স্বাস্থ্য স্ক্যানার" },
  "scanner.upload": { en: "Upload Image", bn: "ছবি আপলোড করুন" },
  "scanner.analyzing": { en: "Analyzing...", bn: "বিশ্লেষণ করা হচ্ছে..." },
  "scanner.fresh": { en: "Fresh", bn: "তাজা" },
  "scanner.rotten": { en: "Rotten", bn: "পচা" },
  "scanner.instruction": { en: "Take a clear photo of your crop", bn: "আপনার ফসলের একটি পরিষ্কার ছবি তুলুন" },
  "auth.email": { en: "Email", bn: "ইমেইল" },
  "auth.password": { en: "Password", bn: "পাসওয়ার্ড" },
  "auth.phone": { en: "Phone Number", bn: "ফোন নম্বর" },
  "auth.name": { en: "Full Name", bn: "পুরো নাম" },
  "auth.loginTitle": { en: "Welcome Back", bn: "স্বাগতম" },
  "auth.registerTitle": { en: "Create Account", bn: "অ্যাকাউন্ট তৈরি করুন" },
  "auth.loginBtn": { en: "Login", bn: "লগইন" },
  "auth.registerBtn": { en: "Register", bn: "নিবন্ধন" },
  "auth.noAccount": { en: "Don't have an account?", bn: "অ্যাকাউন্ট নেই?" },
  "auth.hasAccount": { en: "Already have an account?", bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?" },
  "badges.firstHarvest": { en: "First Harvest Logged", bn: "প্রথম ফসল লগ করা হয়েছে" },
  "badges.riskExpert": { en: "Risk Mitigation Expert", bn: "ঝুঁকি প্রশমন বিশেষজ্ঞ" },
  "export.csv": { en: "Export CSV", bn: "CSV রপ্তানি" },
  "export.json": { en: "Export JSON", bn: "JSON রপ্তানি" },
  "common.loading": { en: "Loading...", bn: "লোড হচ্ছে..." },
  "common.error": { en: "Something went wrong", bn: "কিছু ভুল হয়েছে" },
  "common.success": { en: "Success!", bn: "সফল!" },
  "common.cancel": { en: "Cancel", bn: "বাতিল" },
  "common.save": { en: "Save", bn: "সংরক্ষণ" },
  "common.delete": { en: "Delete", bn: "মুছুন" },
  "common.edit": { en: "Edit", bn: "সম্পাদনা" },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("harvestguard-language") as Language
    if (saved) setLanguage(saved)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("harvestguard-language", lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
