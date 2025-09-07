"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Plus, Calendar, Users, Target } from "lucide-react"
import { teacherService, type Assignment } from "@/lib/teacher"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const router = useRouter()

  useEffect(() => {
    const teacherAssignments = teacherService.getTeacherAssignments("teacher_1")
    setAssignments(teacherAssignments)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
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
        <div className="flex-1">
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">TAREAS</h1>
          <p className="text-muted-foreground">Gestiona las asignaciones de tus estudiantes</p>
        </div>
        <Button
          onClick={() => router.push("/teacher/assignments/create")}
          className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="group hover:neon-border hover:border-secondary/50 transition-all cursor-pointer"
            onClick={() => router.push(`/teacher/assignments/${assignment.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status === "active"
                    ? "Activa"
                    : assignment.status === "draft"
                      ? "Borrador"
                      : "Completada"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <CardDescription>{assignment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{assignment.classroomName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span>{assignment.totalQuestions} preguntas</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Vence: {assignment.dueDate.toLocaleDateString()}</span>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completadas:</span>
                    <span className="font-medium">
                      {assignment.completedBy}/{assignment.totalStudents}
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(assignment.completedBy / assignment.totalStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No hay tareas creadas</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera tarea para asignar ejercicios a tus estudiantes
            </p>
            <Button
              onClick={() => router.push("/teacher/assignments/create")}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Tarea
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
