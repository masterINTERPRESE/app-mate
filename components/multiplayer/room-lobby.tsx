"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { GameRoom } from "@/lib/multiplayer"
import { Users, Crown, Zap, Clock, Settings, Copy, Check } from "lucide-react"

interface RoomLobbyProps {
  room: GameRoom
  currentPlayerId: string
  onReady: (ready: boolean) => void
  onLeave: () => void
  onStart?: () => void
}

export function RoomLobby({ room, currentPlayerId, onReady, onLeave, onStart }: RoomLobbyProps) {
  const [copied, setCopied] = useState(false)
  const currentPlayer = room.players.find((p) => p.id === currentPlayerId)
  const isCreator = room.createdBy === currentPlayerId
  const allReady = room.players.every((p) => p.isReady)
  const readyCount = room.players.filter((p) => p.isReady).length

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy room code:", err)
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "1v1":
        return "Duelo 1v1"
      case "battle_royale":
        return "Batalla Real"
      case "private":
        return "Sala Privada"
      default:
        return type
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Room Header */}
      <Card className="neon-border border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-orbitron text-2xl text-primary neon-glow">{room.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="border-secondary/50 text-secondary">
                  {getTypeLabel(room.type)}
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  <Users className="w-3 h-3 mr-1" />
                  {room.currentPlayers}/{room.maxPlayers}
                </Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Código de sala:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyRoomCode}
                  className="font-mono border-primary/50 bg-transparent"
                >
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {room.id}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {readyCount}/{room.players.length} jugadores listos
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Players List */}
        <div className="lg:col-span-2">
          <Card className="neon-border border-secondary/50">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                {"Soldados en la Sala"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.players.map((player) => (
                  <Card
                    key={player.id}
                    className={`bg-card/50 ${player.isReady ? "border-primary/50" : "border-border"}`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {room.createdBy === player.id && <Crown className="w-4 h-4 text-yellow-500" />}
                          <div>
                            <div className="font-semibold">{player.name}</div>
                            <div className={`text-sm ${getRankColor(player.rank)}`}>{player.rank}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-1">{player.xp.toLocaleString()} XP</div>
                          <Badge variant={player.isReady ? "default" : "secondary"} className="text-xs">
                            {player.isReady ? "LISTO" : "ESPERANDO"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Empty slots */}
                {Array.from({ length: room.maxPlayers - room.currentPlayers }).map((_, index) => (
                  <Card key={`empty-${index}`} className="bg-card/20 border-dashed border-muted/50">
                    <CardContent className="pt-4">
                      <div className="text-center text-muted-foreground">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">Esperando jugador...</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Settings & Controls */}
        <div className="space-y-6">
          {/* Game Settings */}
          <Card className="neon-border border-accent/50">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5 text-accent" />
                {"Configuración"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Dificultad:</span>
                <Badge variant="outline" className="text-xs">
                  {room.settings.difficulty === "mixed" ? "MIXTA" : `NIVEL ${room.settings.difficulty}`}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Preguntas:</span>
                <span className="text-sm font-mono">{room.settings.questionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tiempo límite:</span>
                <span className="text-sm font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {room.settings.timeLimit}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pistas:</span>
                <Badge variant={room.settings.allowHints ? "default" : "secondary"} className="text-xs">
                  {room.settings.allowHints ? "PERMITIDAS" : "DESHABILITADAS"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ready Status */}
          <Card className="neon-border border-primary/50">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg">{"Estado de Preparación"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Jugadores listos</span>
                  <span className="font-mono">
                    {readyCount}/{room.players.length}
                  </span>
                </div>
                <Progress value={(readyCount / room.players.length) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => onReady(!currentPlayer?.isReady)}
                  className={`w-full font-orbitron ${
                    currentPlayer?.isReady
                      ? "bg-accent hover:bg-accent/80 text-accent-foreground"
                      : "bg-primary hover:bg-primary/80 text-primary-foreground"
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {currentPlayer?.isReady ? "CANCELAR" : "LISTO PARA BATALLA"}
                </Button>

                {isCreator && allReady && onStart && (
                  <Button
                    onClick={onStart}
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
                  >
                    {"INICIAR BATALLA"}
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                onClick={onLeave}
                className="w-full border-accent/50 text-accent hover:bg-accent/10 bg-transparent"
              >
                {"ABANDONAR SALA"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
