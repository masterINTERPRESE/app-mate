"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QuestionDisplay } from "@/components/game/question-display"
import type { GameRoom } from "@/lib/multiplayer"
import type { Question } from "@/lib/questions"
import { Trophy, Clock, Users } from "lucide-react"

interface BattleArenaProps {
  room: GameRoom
  currentPlayerId: string
  currentQuestion: Question
  onAnswer: (answer: string | number, timeSpent: number) => void
  onHint?: () => void
  showHint?: boolean
  hintText?: string
}

export function BattleArena({
  room,
  currentPlayerId,
  currentQuestion,
  onAnswer,
  onHint,
  showHint,
  hintText,
}: BattleArenaProps) {
  const [timeLeft, setTimeLeft] = useState(currentQuestion.timeLimit)
  const currentPlayer = room.players.find((p) => p.id === currentPlayerId)
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score)

  useEffect(() => {
    setTimeLeft(currentQuestion.timeLimit)
  }, [currentQuestion])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Soldado":
        return "text-primary"
      case "Sargento":
        return "text-secondary"
      case "Capitán":
        return "text-accent"
      case "Coronel":
        return "text-yellow-500"
      case "General":
        return "text-purple-400"
      default:
        return "text-primary"
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-yellow-500" // Gold
      case 1:
        return "text-gray-400" // Silver
      case 2:
        return "text-amber-600" // Bronze
      default:
        return "text-muted-foreground"
    }
  }

  const progressPercentage = ((room.questionIndex + 1) / room.totalQuestions) * 100
  const timeProgressPercentage = (timeLeft / currentQuestion.timeLimit) * 100
  const isTimeRunningOut = timeLeft <= 10

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Battle Header */}
      <Card className="neon-border border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-orbitron text-xl text-primary neon-glow">{"ARENA DE BATALLA"}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="border-secondary/50 text-secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {room.players.length} Combatientes
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  Pregunta {room.questionIndex + 1}/{room.totalQuestions}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary font-mono">{currentPlayer?.score || 0}</div>
              <div className="text-sm text-muted-foreground">Tu puntuación</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso de batalla</span>
              <span className="font-mono">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3">
          <QuestionDisplay
            question={currentQuestion}
            onAnswer={onAnswer}
            onHint={onHint}
            showHint={showHint}
            hintText={hintText}
          />
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Card className="neon-border border-secondary/50 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="font-orbitron text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                {"Ranking"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      player.id === currentPlayerId ? "bg-primary/10 border border-primary/30" : "bg-card/50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-500/20 text-yellow-500"
                          : index === 1
                            ? "bg-gray-400/20 text-gray-400"
                            : index === 2
                              ? "bg-amber-600/20 text-amber-600"
                              : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{player.name}</div>
                      <div className={`text-xs ${getRankColor(player.rank)}`}>{player.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold">{player.score}</div>
                      {player.currentAnswer && <div className="text-xs text-primary">✓</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Battle Timer */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Tiempo
                  </span>
                  <span className={`font-mono ${isTimeRunningOut ? "text-accent animate-pulse" : "text-foreground"}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <Progress value={timeProgressPercentage} className={`h-2 ${isTimeRunningOut ? "animate-pulse" : ""}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
