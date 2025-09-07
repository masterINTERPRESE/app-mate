"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type Rank, RANKS } from "@/lib/gamification"

interface RankDisplayProps {
  currentRank: Rank
  nextRank: Rank | null
  currentXP: number
  xpToNext: number
}

export function RankDisplay({ currentRank, nextRank, currentXP, xpToNext }: RankDisplayProps) {
  const progress = nextRank ? ((currentXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100 : 100

  return (
    <Card className="neon-border border-primary/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{currentRank.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-orbitron text-xl font-bold" style={{ color: currentRank.color }}>
                {currentRank.name}
              </h3>
              <Badge variant="outline" style={{ borderColor: currentRank.color, color: currentRank.color }}>
                {"Rango " + (RANKS.findIndex((r) => r.id === currentRank.id) + 1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentXP.toLocaleString()} XP
              {nextRank && ` • ${xpToNext.toLocaleString()} XP para ${nextRank.name}`}
            </p>
          </div>
        </div>

        {nextRank && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{"Progreso al siguiente rango"}</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">{"Beneficios del rango:"}</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {currentRank.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
