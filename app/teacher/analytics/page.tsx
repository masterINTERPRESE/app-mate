"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, TrendingUp, Users, Target, Clock, Award } from "lucide-react"
import { teacherService, type TeacherAnalytics } from "@/lib/teacher"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null)
  const router = useRouter()

  useEffect(() => {
    const teacherAnalytics = teacherService.getTeacherAnalytics("teacher_1")
    setAnalytics(teacherAnalytics)
  }, [])

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">CARGANDO REPORTES...</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/teacher")}
          className="border-primary/50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">REPORTES</h1>
          <p className="text-muted-foreground">Análisis detallado del rendimiento estudiantil</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="neon-border border-primary/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-primary" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analytics.totalStudents}</div>
            <p className="text-sm text-muted-foreground">Estudiantes Activos</p>
            <div className="text-xs text-green-400 mt-1">+{analytics.newStudentsThisWeek} esta semana</div>
          </CardContent>
        </Card>

        <Card className="neon-border border-secondary/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Target className="w-8 h-8 text-secondary" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{analytics.averageScore}%</div>
            <p className="text-sm text-muted-foreground">Promedio General</p>
            <div className="text-xs text-green-400 mt-1">+{analytics.scoreImprovement}% vs mes anterior</div>
          </CardContent>
        </Card>

        <Card className="neon-border border-accent/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-accent" />
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{analytics.totalTimeSpent}h</div>
            <p className="text-sm text-muted-foreground">Tiempo Total</p>
            <div className="text-xs text-blue-400 mt-1">{analytics.avgSessionTime}min promedio</div>
          </CardContent>
        </Card>

        <Card className="neon-border border-green-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Award className="w-8 h-8 text-green-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{analytics.completedAssignments}</div>
            <p className="text-sm text-muted-foreground">Tareas Completadas</p>
            <div className="text-xs text-green-400 mt-1">{analytics.completionRate}% tasa de finalización</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="neon-border border-primary/50">
          <CardHeader>
            <CardTitle className="font-orbitron text-xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Rendimiento por Tema
            </CardTitle>
            <CardDescription>Áreas de fortaleza y oportunidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topicPerformance.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-muted-foreground">{topic.score}%</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        topic.score >= 80 ? "bg-green-400" : topic.score >= 60 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border border-secondary/50">
          <CardHeader>
            <CardTitle className="font-orbitron text-xl flex items-center gap-2">
              <Users className="w-6 h-6 text-secondary" />
              Top Estudiantes
            </CardTitle>
            <CardDescription>Mejores rendimientos del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-black"
                          : index === 1
                            ? "bg-gray-400 text-black"
                            : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-primary/20 text-primary"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{student.score}%</div>
                    <div className="text-sm text-muted-foreground">{student.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
