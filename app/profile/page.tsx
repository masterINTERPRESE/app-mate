"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RankDisplay } from "@/components/gamification/rank-display"
import { AchievementsPanel } from "@/components/gamification/achievements-panel"
import { authService, type User } from "@/lib/auth"
import { gamificationService } from "@/lib/gamification"
import { ArrowLeft, Target, Zap, Trophy, Clock } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO PERFIL..."}</div>
      </div>
    )
  }

  const currentRank = gamificationService.getRankByXP(user.xp)
  const { next: nextRank, xpNeeded } = gamificationService.getXPToNextRank(user.xp)
  const accuracy = user.stats.totalProblems > 0 ? (user.stats.correctAnswers / user.stats.totalProblems) * 100 : 0

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="border-primary/50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">{"PERFIL MILITAR"}</h1>
          <p className="text-muted-foreground">{"Estadísticas y logros de combate"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Rank and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <RankDisplay currentRank={currentRank} nextRank={nextRank} currentXP={user.xp} xpToNext={xpNeeded} />

          {/* Combat Stats */}
          <Card className="neon-border border-secondary/50">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                {"Estadísticas de Combate"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-mono">{user.stats.totalProblems}</div>
                  <p className="text-xs text-muted-foreground">{"Problemas Totales"}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary font-mono">{user.stats.correctAnswers}</div>
                  <p className="text-xs text-muted-foreground">{"Correctas"}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent font-mono">{Math.round(accuracy)}%</div>
                  <p className="text-xs text-muted-foreground">{"Precisión"}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary font-mono">{user.stats.maxStreak}</div>
                  <p className="text-xs text-muted-foreground">{"Racha Máxima"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {"Racha Actual"}
                  </span>
                  <span className="font-mono text-primary">{user.stats.currentStreak}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {"Tiempo Promedio"}
                  </span>
                  <span className="font-mono text-secondary">{Math.round(user.stats.averageTime)}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    {"Mejor Tiempo"}
                  </span>
                  <span className="font-mono text-accent">
                    {user.stats.fastestTime > 0 ? `${Math.round(user.stats.fastestTime)}s` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements */}
        <div className="lg:col-span-2">
          <AchievementsPanel achievements={user.stats.achievements} />
        </div>
      </div>
    </main>
  )
}
