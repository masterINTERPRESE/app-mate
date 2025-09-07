"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LoginForm } from "@/components/auth/login-form"
import { authService, type User } from "@/lib/auth"
import { gamificationService } from "@/lib/gamification"
import { Zap, Target, Trophy, Users, BookOpen, Settings, LogOut, UserIcon } from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedInUser = await authService.login(email, password)
      setUser(loggedInUser)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al iniciar sesión")
    }
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const newUser = await authService.register(email, password, name)
      setUser(newUser)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al registrarse")
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      // Optionally, force a reload to clear all state
      // router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al cerrar sesión");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO SISTEMA..."}</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
  }

  const currentRank = gamificationService.getRankByXP(user.xp)
  const { next: nextRank, xpNeeded } = gamificationService.getXPToNextRank(user.xp)
  const progressPercentage = nextRank
    ? ((user.xp - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100
    : 100
  const accuracy = user.stats.totalProblems > 0 ? (user.stats.correctAnswers / user.stats.totalProblems) * 100 : 0

  return (
    <main className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-primary neon-glow mb-2">{"MATHQUIZ"}</h1>
        <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-secondary neon-glow mb-4">{"BATTLE MODE"}</h2>
        <p className="text-muted-foreground text-lg">{"Domina el álgebra básica en el campo de batalla matemático"}</p>
      </header>

      {/* User Status */}
      <Card className="mb-6 neon-border border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-orbitron text-xl">{user.name}</CardTitle>
                <CardDescription className="text-secondary">
                  {"Rango: "}{" "}
                  <Badge
                    variant="secondary"
                    className="bg-secondary/20 text-secondary"
                    style={{ color: currentRank.color }}
                  >
                    {currentRank.name} {currentRank.icon}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-secondary/50 bg-transparent"
                onClick={() => router.push("/profile")}
              >
                <UserIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-primary/50 bg-transparent"
                onClick={() => router.push("/settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-accent/50 bg-transparent text-accent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{"Experiencia"}</span>
              <span className="text-primary font-mono">
                {user.xp.toLocaleString()} XP
                {nextRank && ` • ${xpNeeded.toLocaleString()} para ${nextRank.name}`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Campaña */}
        <Card
          className="group hover:neon-border hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => router.push("/game/campaign")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-orbitron text-lg">{"Campaña"}</CardTitle>
                <CardDescription>{"Misiones estructuradas"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {"Completa misiones de álgebra básica con dificultad progresiva"}
            </p>
            <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron">
              {"INICIAR CAMPAÑA"}
            </Button>
          </CardContent>
        </Card>

        {/* Batalla Rápida */}
        <Card
          className="group hover:neon-border hover:border-secondary/50 transition-all cursor-pointer"
          onClick={() => router.push("/game/quick-battle")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="font-orbitron text-lg">{"Batalla Rápida"}</CardTitle>
                <CardDescription>{"Acción inmediata"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {"Resuelve problemas contra el tiempo y gana XP rápido"}
            </p>
            <Button
              variant="secondary"
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
            >
              {"BATALLA RÁPIDA"}
            </Button>
          </CardContent>
        </Card>

        {/* Supervivencia */}
        <Card
          className="group hover:neon-border hover:border-accent/50 transition-all cursor-pointer"
          onClick={() => router.push("/game/survival")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="font-orbitron text-lg">{"Supervivencia"}</CardTitle>
                <CardDescription>{"Resistencia extrema"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{"¿Cuántos problemas consecutivos puedes resolver?"}</p>
            <Button
              variant="destructive"
              className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-orbitron"
            >
              {"MODO SUPERVIVENCIA"}
            </Button>
          </CardContent>
        </Card>

        {/* Multijugador */}
        <Card
          className="group hover:neon-border hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => router.push("/multiplayer")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-orbitron text-lg">{"Multijugador"}</CardTitle>
                <CardDescription>{"Combate en línea"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{"Enfréntate a otros estudiantes en tiempo real"}</p>
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 font-orbitron bg-transparent"
            >
              {"BUSCAR OPONENTE"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary font-mono">{user.stats.totalProblems}</div>
            <p className="text-xs text-muted-foreground">{"Problemas Resueltos"}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary font-mono">{Math.round(accuracy)}%</div>
            <p className="text-xs text-muted-foreground">{"Precisión"}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent font-mono">{user.stats.maxStreak}</div>
            <p className="text-xs text-muted-foreground">{"Racha Máxima"}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
