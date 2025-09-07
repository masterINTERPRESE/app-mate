"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Student, StudentProgress, Assignment } from "@/lib/teacher"
import { Search, Download, Filter, TrendingUp, TrendingDown, Minus, Clock, Target } from "lucide-react"

interface StudentGradesProps {
  students: Student[]
  assignments: Assignment[]
  progress: StudentProgress[]
}

export function StudentGrades({ students, assignments, progress }: StudentGradesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all")

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStudentProgress = (studentId: string, assignmentId?: string) => {
    return progress.filter((p) => {
      if (assignmentId && assignmentId !== "all") {
        return p.studentId === studentId && p.assignmentId === assignmentId
      }
      return p.studentId === studentId
    })
  }

  const getStudentAverage = (studentId: string) => {
    const studentProgress = getStudentProgress(studentId)
    const completedAssignments = studentProgress.filter((p) => p.status === "completed")

    if (completedAssignments.length === 0) return 0

    return completedAssignments.reduce((sum, p) => sum + p.score, 0) / completedAssignments.length
  }

  const getAssignmentStats = (assignmentId: string) => {
    const assignmentProgress = progress.filter((p) => p.assignmentId === assignmentId && p.status === "completed")

    if (assignmentProgress.length === 0) {
      return { average: 0, completed: 0, total: students.length }
    }

    const average = assignmentProgress.reduce((sum, p) => sum + p.score, 0) / assignmentProgress.length
    return {
      average,
      completed: assignmentProgress.length,
      total: students.length,
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 80) return "text-secondary"
    if (score >= 70) return "text-yellow-500"
    return "text-accent"
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-primary" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-accent" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const exportGrades = () => {
    const data = filteredStudents.map((student) => {
      const studentProgress = getStudentProgress(student.id)
      const average = getStudentAverage(student.id)

      return {
        nombre: student.name,
        email: student.email,
        rango: student.rank,
        xp: student.xp,
        promedio: Math.round(average),
        problemasResueltos: student.stats.totalProblems,
        precision: Math.round((student.stats.correctAnswers / student.stats.totalProblems) * 100),
        rachaMaxima: student.stats.maxStreak,
      }
    })

    const csv = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calificaciones_estudiantes.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <Button variant="outline" size="icon" className="border-primary/50 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm"
          >
            <option value="all">Todas las tareas</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
          <Button
            onClick={exportGrades}
            variant="outline"
            className="border-secondary/50 text-secondary hover:bg-secondary/10 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Assignment Overview */}
      {selectedAssignment !== "all" && (
        <Card className="neon-border border-secondary/50">
          <CardHeader>
            <CardTitle className="font-orbitron">
              {assignments.find((a) => a.id === selectedAssignment)?.title}
            </CardTitle>
            <CardDescription>{assignments.find((a) => a.id === selectedAssignment)?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const stats = getAssignmentStats(selectedAssignment)
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{Math.round(stats.average)}%</div>
                    <p className="text-sm text-muted-foreground">Promedio de la clase</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{stats.completed}</div>
                    <p className="text-sm text-muted-foreground">Estudiantes completaron</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {Math.round((stats.completed / stats.total) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Tasa de finalización</p>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card className="neon-border border-primary/50">
        <CardHeader>
          <CardTitle className="font-orbitron flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Calificaciones de Estudiantes
          </CardTitle>
          <CardDescription>
            {selectedAssignment === "all"
              ? "Vista general del desempeño de todos los estudiantes"
              : `Resultados de: ${assignments.find((a) => a.id === selectedAssignment)?.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const studentProgress = getStudentProgress(student.id, selectedAssignment)
              const average = getStudentAverage(student.id)
              const accuracy = (student.stats.correctAnswers / student.stats.totalProblems) * 100

              return (
                <Card key={student.id} className="bg-card/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-primary text-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className={`text-sm ${getRankColor(student.rank)}`}>{student.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold font-mono ${getScoreColor(average)}`}>
                          {Math.round(average)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Promedio general</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{student.stats.totalProblems}</div>
                        <div className="text-xs text-muted-foreground">Problemas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-secondary">{Math.round(accuracy)}%</div>
                        <div className="text-xs text-muted-foreground">Precisión</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">{student.stats.maxStreak}</div>
                        <div className="text-xs text-muted-foreground">Racha máx.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-500">{student.xp.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">XP Total</div>
                      </div>
                    </div>

                    {selectedAssignment !== "all" && (
                      <div className="border-t border-border pt-4">
                        {(() => {
                          const assignmentProgress = studentProgress.find((p) => p.assignmentId === selectedAssignment)
                          if (!assignmentProgress) {
                            return (
                              <div className="text-center py-2">
                                <Badge variant="secondary">No iniciado</Badge>
                              </div>
                            )
                          }

                          return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className={`text-lg font-bold ${getScoreColor(assignmentProgress.score)}`}>
                                  {assignmentProgress.score}%
                                </div>
                                <div className="text-xs text-muted-foreground">Calificación</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">
                                  {assignmentProgress.correctAnswers}/{assignmentProgress.totalQuestions}
                                </div>
                                <div className="text-xs text-muted-foreground">Correctas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold flex items-center justify-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {Math.round(assignmentProgress.timeSpent / 60)}m
                                </div>
                                <div className="text-xs text-muted-foreground">Tiempo</div>
                              </div>
                              <div className="text-center">
                                <Badge
                                  variant={
                                    assignmentProgress.status === "completed"
                                      ? "default"
                                      : assignmentProgress.status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {assignmentProgress.status === "completed"
                                    ? "Completado"
                                    : assignmentProgress.status === "in_progress"
                                      ? "En progreso"
                                      : "No iniciado"}
                                </Badge>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    {/* Weak Areas */}
                    {student.stats.weakAreas.length > 0 && (
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="text-sm font-medium mb-2">Áreas que necesitan refuerzo:</div>
                        <div className="flex flex-wrap gap-1">
                          {student.stats.weakAreas.map((area) => (
                            <Badge key={area} variant="outline" className="text-xs border-accent/50 text-accent">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
