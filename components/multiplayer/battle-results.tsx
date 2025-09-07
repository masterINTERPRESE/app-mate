"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GameRoom } from "@/lib/multiplayer"
import { Trophy, Medal, Award, Target, Zap } from "lucide-react"

interface BattleResultsProps {
  room: GameRoom
  currentPlayerId: string
  onPlayAgain: () => void
  onLeave: () => void
}

export function BattleResults({ room, currentPlayerId, onPlayAgain, onLeave }: BattleResultsProps) {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score)
  const currentPlayer = room.players.find((p) => p.id === currentPlayerId)
  const currentPlayerPosition = sortedPlayers.findIndex((p) => p.id === currentPlayerId) + 1

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return <Target className="w-8 h-8 text-muted-foreground" />
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getPositionTitle = (position: number) => {
    switch (position) {
      case 1:
        return "¡VICTORIA!"
      case 2:
        return "Segundo Lugar"
      case 3:
        return "Tercer Lugar"
      default:
        return `Posición ${position}`
    }
  }

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

  const calculateXPGained = (score: number, position: number) => {
    let baseXP = Math.floor(score / 10)
    if (position === 1) baseXP *= 1.5
    else if (position === 2) baseXP *= 1.3
    else if (position === 3) baseXP *= 1.1
    return Math.floor(baseXP)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Personal Result */}
      <Card className={`neon-border ${currentPlayerPosition === 1 ? "border-yellow-500/50" : "border-primary/50"}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getPositionIcon(currentPlayerPosition)}</div>
          <CardTitle className={`font-orbitron text-2xl ${getPositionColor(currentPlayerPosition)} neon-glow`}>
            {getPositionTitle(currentPlayerPosition)}
          </CardTitle>
          <p className="text-muted-foreground">
            {currentPlayerPosition === 1 ? "¡Excelente trabajo, comandante!" : "Buen esfuerzo, sigue entrenando"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary font-mono">{currentPlayer?.score || 0}</div>
              <p className="text-sm text-muted-foreground">Puntuación Final</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary font-mono">
                +{calculateXPGained(currentPlayer?.score || 0, currentPlayerPosition)}
              </div>
              <p className="text-sm text-muted-foreground">XP Ganado</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent font-mono">{currentPlayerPosition}</div>
              <p className="text-sm text-muted-foreground">Posición</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card className="neon-border border-secondary/50">
        <CardHeader>
          <CardTitle className="font-orbitron text-xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-secondary" />
            {"Tabla de Posiciones Final"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const position = index + 1
              const xpGained = calculateXPGained(player.score, position)

              return (
                <Card
                  key={player.id}
                  className={`${
                    player.id === currentPlayerId
                      ? "bg-primary/10 border-primary/30"
                      : position <= 3
                        ? "bg-card/80"
                        : "bg-card/50"
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            position === 1
                              ? "bg-yellow-500/20"
                              : position === 2
                                ? "bg-gray-400/20"
                                : position === 3
                                  ? "bg-amber-600/20"
                                  : "bg-muted/20"
                          }`}
                        >
                          <span className={`font-bold ${getPositionColor(position)}`}>{position}</span>
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {player.name}
                            {player.id === currentPlayerId && (
                              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                                TÚ
                              </Badge>
                            )}
                          </div>
                          <div className={`text-sm ${getRankColor(player.rank)}`}>{player.rank}</div>
                        </div>
                      </div>

                      <div className="flex-1" />

                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-lg font-bold font-mono">{player.score}</div>
                          <div className="text-xs text-muted-foreground">Puntos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold font-mono text-secondary">+{xpGained}</div>
                          <div className="text-xs text-muted-foreground">XP</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold font-mono text-accent">{Math.round(player.timeSpent)}s</div>
                          <div className="text-xs text-muted-foreground">Tiempo</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onPlayAgain}
          className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron px-8"
        >
          <Zap className="w-4 h-4 mr-2" />
          {"NUEVA BATALLA"}
        </Button>
        <Button
          onClick={onLeave}
          variant="outline"
          className="border-secondary/50 text-secondary hover:bg-secondary/10 font-orbitron px-8 bg-transparent"
        >
          {"VOLVER AL CUARTEL"}
        </Button>
      </div>
    </div>
  )
}
