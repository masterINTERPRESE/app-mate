"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authService, type User } from "@/lib/auth"
import { teacherService, type Classroom } from "@/lib/teacher"
import { ArrowLeft, Users, BookOpen, Plus, Settings, BarChart3 } from "lucide-react"

export default function TeacherPage() {
  const [user, setUser] = useState<User | null>(null)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)

    // For demo purposes, we'll use a mock teacher ID
    const teacherClassrooms = teacherService.getTeacherClassrooms("teacher_1")
    setClassrooms(teacherClassrooms)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO PANEL..."}</div>
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
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">{"PANEL DE PROFESOR"}</h1>
          <p className="text-muted-foreground">{"Gestiona tus clases y monitorea el progreso de los estudiantes"}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          onClick={() => router.push("/teacher/create-classroom")}
          className="h-20 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
        >
          <div className="text-center">
            <Plus className="w-6 h-6 mx-auto mb-1" />
            <div>{"CREAR CLASE"}</div>
            <div className="text-xs opacity-80">{"Nueva aula virtual"}</div>
          </div>
        </Button>

        <Button
          onClick={() => router.push("/teacher/assignments")}
          className="h-20 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
        >
          <div className="text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-1" />
            <div>{"TAREAS"}</div>
            <div className="text-xs opacity-80">{"Crear y gestionar"}</div>
          </div>
        </Button>

        <Button
          onClick={() => router.push("/teacher/analytics")}
          className="h-20 bg-accent hover:bg-accent/80 text-accent-foreground font-orbitron"
        >
          <div className="text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-1" />
            <div>{"REPORTES"}</div>
            <div className="text-xs opacity-80">{"Análisis detallado"}</div>
          </div>
        </Button>
      </div>

      {/* Classrooms */}
      <Card className="neon-border border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-orbitron text-xl flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {"Mis Clases"}
              </CardTitle>
              <CardDescription>{"Administra tus aulas virtuales y estudiantes"}</CardDescription>
            </div>
            <Button
              onClick={() => router.push("/teacher/create-classroom")}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              {"Nueva Clase"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {classrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map((classroom) => {
                const analytics = teacherService.getClassroomAnalytics(classroom.id)

                return (
                  <Card
                    key={classroom.id}
                    className="group hover:neon-border hover:border-secondary/50 transition-all cursor-pointer"
                    onClick={() => router.push(`/teacher/classroom/${classroom.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{classroom.name}</CardTitle>
                          <CardDescription className="mt-1">{classroom.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-primary/50 text-primary font-mono">
                          {classroom.code}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{classroom.students.length}</div>
                          <div className="text-xs text-muted-foreground">Estudiantes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-secondary">{classroom.assignments.length}</div>
                          <div className="text-xs text-muted-foreground">Tareas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-accent">
                            {analytics ? Math.round(analytics.averageScore) : 0}%
                          </div>
                          <div className="text-xs text-muted-foreground">Promedio</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Creada: {classroom.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/teacher/classroom/${classroom.id}/settings`)
                            }}
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">{"No tienes clases aún"}</h3>
              <p className="text-muted-foreground mb-4">
                {"Crea tu primera clase para comenzar a gestionar estudiantes y tareas"}
              </p>
              <Button
                onClick={() => router.push("/teacher/create-classroom")}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
              >
                <Plus className="w-4 h-4 mr-2" />
                {"Crear Primera Clase"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
