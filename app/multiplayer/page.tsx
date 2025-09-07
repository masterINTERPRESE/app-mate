"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { authService, type User } from "@/lib/auth"
import { multiplayerService } from "@/lib/multiplayer"
import { ArrowLeft, Swords, Users, Crown, Search, Plus, Trophy } from "lucide-react"

export default function MultiplayerPage() {
  const [user, setUser] = useState<User | null>(null)
  const [roomCode, setRoomCode] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleQuickMatch = async (type: "1v1" | "battle_royale") => {
    if (!user) return

    setIsSearching(true)
    try {
      // Simulate matchmaking delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const room = multiplayerService.findMatch(user, type)
      router.push(`/multiplayer/room/${room.id}`)
    } catch (error) {
      console.error("Error finding match:", error)
      setIsSearching(false)
    }
  }

  const handleJoinRoom = () => {
    if (!roomCode.trim()) return

    const room = multiplayerService.getRoom(roomCode.toUpperCase())
    if (room && user) {
      const joinedRoom = multiplayerService.joinRoom(room.id, user)
      if (joinedRoom) {
        router.push(`/multiplayer/room/${room.id}`)
      } else {
        alert("No se pudo unir a la sala. Puede estar llena o ya haber comenzado.")
      }
    } else {
      alert("Código de sala inválido")
    }
  }

  const handleCreateRoom = () => {
    if (!user) return

    const settings = {
      difficulty: "mixed" as const,
      timeLimit: 60,
      questionCount: 10,
      allowHints: true,
    }

    const room = multiplayerService.createRoom(user, "private", settings, `${user.name}'s Room`)
    router.push(`/multiplayer/room/${room.id}`)
  }

  const leaderboard = multiplayerService.getLeaderboard()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO ARSENAL..."}</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="border-primary/50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">{"ARENA MULTIJUGADOR"}</h1>
          <p className="text-muted-foreground">{"Enfréntate a otros soldados matemáticos"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Modes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Match */}
          <Card className="neon-border border-primary/50">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl flex items-center gap-2">
                <Swords className="w-6 h-6 text-primary" />
                {"Batalla Rápida"}
              </CardTitle>
              <CardDescription>{"Encuentra oponentes automáticamente"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleQuickMatch("1v1")}
                  disabled={isSearching}
                  className="h-20 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
                >
                  <div className="text-center">
                    <Swords className="w-6 h-6 mx-auto mb-1" />
                    <div>{"DUELO 1v1"}</div>
                    <div className="text-xs opacity-80">{"Combate directo"}</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleQuickMatch("battle_royale")}
                  disabled={isSearching}
                  className="h-20 bg-accent hover:bg-accent/80 text-accent-foreground font-orbitron"
                >
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-1" />
                    <div>{"BATALLA REAL"}</div>
                    <div className="text-xs opacity-80">{"Hasta 8 jugadores"}</div>
                  </div>
                </Button>
              </div>

              {isSearching && (
                <div className="text-center py-4">
                  <div className="text-primary font-orbitron animate-pulse">{"BUSCANDO OPONENTES..."}</div>
                  <div className="text-sm text-muted-foreground mt-1">{"Esto puede tomar unos segundos"}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="neon-border border-secondary/50">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl flex items-center gap-2">
                <Search className="w-6 h-6 text-secondary" />
                {"Unirse a Sala"}
              </CardTitle>
              <CardDescription>{"Ingresa el código de una sala privada"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Código de sala (ej: ABC123XYZ)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-input border-border font-mono"
                  maxLength={9}
                />
                <Button
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim()}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron px-6"
                >
                  {"UNIRSE"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Room */}
          <Card className="neon-border border-accent/50">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl flex items-center gap-2">
                <Crown className="w-6 h-6 text-accent" />
                {"Crear Sala Privada"}
              </CardTitle>
              <CardDescription>{"Invita a tus amigos a una batalla personalizada"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateRoom}
                className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-orbitron h-12"
              >
                <Plus className="w-5 h-5 mr-2" />
                {"CREAR SALA"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Card className="neon-border border-primary/50 h-fit">
            <CardHeader>
              <CardTitle className="font-orbitron text-xl flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                {"Ranking Global"}
              </CardTitle>
              <CardDescription>{"Los mejores soldados matemáticos"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((result, index) => (
                  <div key={result.playerId} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
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
                      <div className="text-sm font-semibold truncate">{result.playerName}</div>
                      <div className="text-xs text-muted-foreground">{result.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold">{result.score.toLocaleString()}</div>
                      <div className="text-xs text-primary">+{result.xpGained} XP</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border text-center">
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {"Tu mejor posición: #15"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
