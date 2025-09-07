"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Achievement } from "@/lib/gamification"
import { Trophy, Lock, Star } from "lucide-react"

interface AchievementsPanelProps {
  achievements: Achievement[]
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "Todos", icon: Trophy },
    { id: "problems", name: "Problemas", icon: Star },
    { id: "streak", name: "Rachas", icon: Trophy },
    { id: "accuracy", name: "Precisión", icon: Star },
    { id: "speed", name: "Velocidad", icon: Trophy },
    { id: "special", name: "Especiales", icon: Star },
  ]

  const filteredAchievements =
    selectedCategory === "all" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  const getTypeColor = (type: Achievement["type"]) => {
    switch (type) {
      case "bronze":
        return "text-amber-600"
      case "silver":
        return "text-gray-400"
      case "gold":
        return "text-yellow-500"
      case "platinum":
        return "text-purple-400"
      default:
        return "text-primary"
    }
  }

  const getTypeBorder = (type: Achievement["type"]) => {
    switch (type) {
      case "bronze":
        return "border-amber-600/50"
      case "silver":
        return "border-gray-400/50"
      case "gold":
        return "border-yellow-500/50"
      case "platinum":
        return "border-purple-400/50"
      default:
        return "border-primary/50"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="neon-border border-secondary/50">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            {"Logros Militares"}
          </CardTitle>
          <CardDescription>
            {"Progreso: "}
            {unlockedCount}/{totalCount} logros desbloqueados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => {
              const Icon = category.icon
              const count =
                category.id === "all"
                  ? achievements.filter((a) => a.unlocked).length
                  : achievements.filter((a) => a.category === category.id && a.unlocked).length

              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="font-orbitron"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {category.name} ({count})
                </Button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${achievement.unlocked ? getTypeBorder(achievement.type) : "border-muted/50"} ${
                  achievement.unlocked ? "neon-border" : "opacity-60"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-semibold ${achievement.unlocked ? getTypeColor(achievement.type) : "text-muted-foreground"}`}
                        >
                          {achievement.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${achievement.unlocked ? getTypeColor(achievement.type) : "text-muted-foreground"}`}
                        >
                          {achievement.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-primary">
                          {"Desbloqueado: "}
                          {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
