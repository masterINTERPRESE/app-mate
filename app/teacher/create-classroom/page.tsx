"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users } from "lucide-react"
import { teacherService } from "@/lib/teacher"

export default function CreateClassroomPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [grade, setGrade] = useState("7")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)

    const newClassroom = teacherService.createClassroom({
      name: name.trim(),
      description: description.trim(),
      grade,
      teacherId: "teacher_1",
    })

    setTimeout(() => {
      router.push(`/teacher/classroom/${newClassroom.id}`)
    }, 1000)
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
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
          <h1 className="font-orbitron text-3xl font-bold text-primary neon-glow">CREAR CLASE</h1>
          <p className="text-muted-foreground">Configura una nueva aula virtual</p>
        </div>
      </div>

      <Card className="neon-border border-primary/50">
        <CardHeader>
          <CardTitle className="font-orbitron text-xl flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Nueva Aula Virtual
          </CardTitle>
          <CardDescription>Crea un espacio para que tus estudiantes practiquen matemáticas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-rajdhani text-sm font-medium">
                Nombre de la Clase *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Matemáticas 7° A"
                className="bg-background/50 border-primary/30 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-rajdhani text-sm font-medium">
                Descripción
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ej: Álgebra básica para estudiantes de séptimo grado"
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="font-rajdhani text-sm font-medium">
                Grado
              </Label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-primary/30 rounded-md focus:border-primary focus:outline-none"
              >
                <option value="7">7° Grado</option>
                <option value="8">8° Grado</option>
                <option value="9">9° Grado</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/teacher")}
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isCreating}
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
              >
                {isCreating ? "Creando..." : "Crear Clase"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
