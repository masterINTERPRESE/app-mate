"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Trophy } from "lucide-react"

interface XPNotificationProps {
  xpGained: number
  streakBonus?: number
  newAchievements?: string[]
  onClose: () => void
}

export function XPNotification({ xpGained, streakBonus = 0, newAchievements = [], onClose }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
      <Card className="neon-border border-primary/50 bg-card/95 backdrop-blur">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-orbitron font-bold text-primary">+{xpGained} XP</span>
                {streakBonus > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{streakBonus} racha
                  </Badge>
                )}
              </div>
              {newAchievements.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <Trophy className="w-3 h-3" />
                  {newAchievements.length === 1
                    ? `Nuevo logro: ${newAchievements[0]}`
                    : `${newAchievements.length} nuevos logros`}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
