"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Classroom, ClassroomAnalytics } from "@/lib/teacher"
import { Users, TrendingUp, Award, AlertTriangle, BookOpen, Clock } from "lucide-react"

interface ClassroomDashboardProps {
  classroom: Classroom
  analytics: ClassroomAnalytics
}

export function ClassroomDashboard({ classroom, analytics }: ClassroomDashboardProps) {
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

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="neon-border border-primary/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Estudiantes</p>
                <p className="text-2xl font-bold text-primary">{analytics.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border border-secondary/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-secondary">{analytics.activeStudents}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border border-accent/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio General</p>
                <p className="text-2xl font-bold text-accent">{Math.round(analytics.averageScore)}%</p>
              </div>
              <Award className="w-8 h-8 text-accent/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border border-yellow-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Finalización</p>
                <p className="text-2xl font-bold text-yellow-500">{Math.round(analytics.completionRate)}%</p>
              </div>
              <BookOpen className="w-8 h-8 text-yellow-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="neon-border border-primary/50">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Mejores Estudiantes
            </CardTitle>
            <CardDescription>Los soldados con mejor desempeño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformers.map((student, index) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-500"
                        : index === 1
                          ? "bg-gray-400/20 text-gray-400"
                          : "bg-amber-600/20 text-amber-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{student.name}</div>
                    <div className={`text-sm ${getRankColor(student.rank)}`}>{student.rank}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold">{student.xp.toLocaleString()} XP</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((student.stats.correctAnswers / student.stats.totalProblems) * 100)}% precisión
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Struggling Students */}
        <Card className="neon-border border-accent/50">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Estudiantes que Necesitan Apoyo
            </CardTitle>
            <CardDescription>Soldados que requieren atención especial</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.strugglingStudents.length > 0 ? (
              <div className="space-y-4">
                {analytics.strugglingStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Precisión: {Math.round((student.stats.correctAnswers / student.stats.totalProblems) * 100)}%
                      </div>
                      <div className="text-xs text-accent">Áreas débiles: {student.stats.weakAreas.join(", ")}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-accent/50 text-accent text-xs">
                        Necesita ayuda
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>¡Excelente! Todos los estudiantes están progresando bien.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Topics */}
        <Card className="neon-border border-secondary/50">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Temas Populares
            </CardTitle>
            <CardDescription>Los temas más trabajados por los estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularTopics.map((topic, index) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm">{topic}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85 - index * 15} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground w-8">{85 - index * 15}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="neon-border border-primary/50">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Distribución de Dificultad
            </CardTitle>
            <CardDescription>Preferencias de nivel de los estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.difficultyDistribution).map(([level, percentage]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm">Nivel {level}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={percentage} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card className="neon-border border-accent/50">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Tareas Recientes
          </CardTitle>
          <CardDescription>Últimas asignaciones de la clase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classroom.assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                <div className="flex-1">
                  <div className="font-semibold">{assignment.title}</div>
                  <div className="text-sm text-muted-foreground">{assignment.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Nivel {assignment.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {assignment.questionCount} preguntas
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={assignment.status === "published" ? "default" : "secondary"} className="mb-1">
                    {assignment.status === "published" ? "Publicada" : "Borrador"}
                  </Badge>
                  <div className="text-xs text-muted-foreground">Vence: {assignment.dueDate.toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
