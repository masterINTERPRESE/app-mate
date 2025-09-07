"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { authService, type User } from "@/lib/auth"
import { teacherService, type Classroom, type ClassroomAnalytics } from "@/lib/teacher"

export default function ClassroomDetailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [analytics, setAnalytics] = useState<ClassroomAnalytics | null>(null)
  const router = useRouter()
  const params = useParams()
  const classroomId = params.classroomId as string

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)

    const classroomData = teacherService.getClassroom(classroomId)
    if (!classroomData) {
      router.push("/teacher")
      return
    }
    setClassroom(classroomData)

    const analyticsData = teacherService.getClassroomAnalytics(classroomId)
    setAnalytics(analyticsData)
  }, [classroomId, router])

  if (!user || !classroom || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-military-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-neon-blue font-rajdhani">Cargando aula...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-military-dark text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/teacher")}
            className="mb-4 px-4 py-2 bg-military-gray border border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-all duration-300 font-rajdhani"
          >
            ← Volver al Panel
          </button>
          <h1 className="text-3xl font-orbitron font-bold text-neon-green mb-2">{classroom.name}</h1>
          <p className="text-gray-300 font-rajdhani">{classroom.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-military-gray border border-neon-blue rounded-lg p-6 neon-glow-blue">
            <h3 className="text-xl font-orbitron text-neon-blue mb-2">Estudiantes Activos</h3>
            <p className="text-3xl font-bold text-neon-green">{analytics.totalStudents}</p>
          </div>
          <div className="bg-military-gray border border-neon-green rounded-lg p-6 neon-glow-green">
            <h3 className="text-xl font-orbitron text-neon-green mb-2">Promedio General</h3>
            <p className="text-3xl font-bold text-neon-blue">{analytics.averageScore.toFixed(1)}%</p>
          </div>
          <div className="bg-military-gray border border-neon-red rounded-lg p-6 neon-glow-red">
            <h3 className="text-xl font-orbitron text-neon-red mb-2">Actividad Hoy</h3>
            <p className="text-3xl font-bold text-neon-green">{analytics.activeToday}</p>
          </div>
        </div>

        <div className="bg-military-gray border border-neon-blue rounded-lg p-6 neon-glow-blue">
          <h2 className="text-2xl font-orbitron text-neon-blue mb-6">Estudiantes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue">
                  <th className="text-left py-3 px-4 font-orbitron text-neon-green">Estudiante</th>
                  <th className="text-left py-3 px-4 font-orbitron text-neon-green">Rango</th>
                  <th className="text-left py-3 px-4 font-orbitron text-neon-green">XP</th>
                  <th className="text-left py-3 px-4 font-orbitron text-neon-green">Promedio</th>
                  <th className="text-left py-3 px-4 font-orbitron text-neon-green">Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {classroom.students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-600 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 font-rajdhani">{student.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-neon-blue text-black rounded text-sm font-rajdhani">
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-rajdhani text-neon-green">{student.xp}</td>
                    <td className="py-3 px-4 font-rajdhani text-neon-blue">{student.averageScore}%</td>
                    <td className="py-3 px-4 font-rajdhani text-gray-300">{student.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
