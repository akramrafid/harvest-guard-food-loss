"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Award, Wheat, AlertTriangle, CheckCircle, Package } from "lucide-react"

const divisions = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]
const storageTypes = ["silo", "juteBag", "openField"]

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, crops, addCrop, isLoggedIn, exportCSV, exportJSON } = useData()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCrop, setNewCrop] = useState({
    cropType: "rice",
    weight: 0,
    harvestDate: "",
    division: "",
    district: "",
    storageType: "",
  })

  useEffect(() => {
    if (!isLoggedIn) router.push("/login")
  }, [isLoggedIn, router])

  const activeBatches = crops.filter((c) => c.status === "active")
  const completedBatches = crops.filter((c) => c.status === "completed")
  const lostBatches = crops.filter((c) => c.status === "lost")
  const successRate = crops.length > 0 ? Math.round((completedBatches.length / crops.length) * 100) : 0

  const handleAddCrop = () => {
    if (newCrop.weight && newCrop.harvestDate && newCrop.division && newCrop.storageType) {
      addCrop(newCrop)
      setDialogOpen(false)
      setNewCrop({ cropType: "rice", weight: 0, harvestDate: "", division: "", district: "", storageType: "" })
    }
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground">{user?.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              {t("export.csv")}
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              <Download className="h-4 w-4 mr-2" />
              {t("export.json")}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("dashboard.addCrop")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dashboard.addCrop")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t("crop.type")}</Label>
                    <Select value={newCrop.cropType} onValueChange={(v) => setNewCrop({ ...newCrop, cropType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rice">{t("crop.rice")}</SelectItem>
                        <SelectItem value="wheat">{t("crop.wheat")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("crop.weight")}</Label>
                    <Input
                      type="number"
                      value={newCrop.weight || ""}
                      onChange={(e) => setNewCrop({ ...newCrop, weight: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("crop.harvestDate")}</Label>
                    <Input
                      type="date"
                      value={newCrop.harvestDate}
                      onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("crop.division")}</Label>
                    <Select value={newCrop.division} onValueChange={(v) => setNewCrop({ ...newCrop, division: v })}>
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label>{t("crop.storageType")}</Label>
                    <Select
                      value={newCrop.storageType}
                      onValueChange={(v) => setNewCrop({ ...newCrop, storageType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {storageTypes.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`crop.${s}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={handleAddCrop}>
                    {t("crop.save")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {user.badges.includes("firstHarvest") && (
              <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                <Award className="h-4 w-4 text-gold" />
                {t("badges.firstHarvest")}
              </Badge>
            )}
            {user.badges.includes("riskExpert") && (
              <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
                <Award className="h-4 w-4 text-primary" />
                {t("badges.riskExpert")}
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeBatches.length}</p>
                  <p className="text-sm text-muted-foreground">{t("dashboard.activeBatches")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedBatches.length}</p>
                  <p className="text-sm text-muted-foreground">{t("dashboard.completedBatches")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{lostBatches.length}</p>
                  <p className="text-sm text-muted-foreground">{t("dashboard.lossEvents")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <Award className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{successRate}%</p>
                  <p className="text-sm text-muted-foreground">{t("dashboard.successRate")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wheat className="h-5 w-5" />
              {t("dashboard.activeBatches")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeBatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active batches. Add your first crop!</p>
            ) : (
              <div className="space-y-4">
                {activeBatches.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Wheat className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t(`crop.${crop.cropType}`)}</p>
                        <p className="text-sm text-muted-foreground">
                          {crop.weight} kg • {crop.division} • {t(`crop.${crop.storageType}`)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          crop.riskLevel === "high"
                            ? "destructive"
                            : crop.riskLevel === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {crop.riskLevel ? t(`risk.${crop.riskLevel}`) : t("risk.low")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
