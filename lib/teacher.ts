"use client"

export interface Student {
  id: string
  name: string
  email: string
  rank: string
  xp: number
  joinedAt: Date
  lastActive: Date
  stats: {
    totalProblems: number
    correctAnswers: number
    averageTime: number
    currentStreak: number
    maxStreak: number
    weakAreas: string[]
    strongAreas: string[]
  }
  classrooms: string[]
}

export interface Assignment {
  id: string
  title: string
  description: string
  difficulty: 1 | 2 | 3 | 4
  questionCount: number
  timeLimit: number
  dueDate: Date
  createdAt: Date
  createdBy: string
  classroomId: string
  classroomName: string // Added classroomName for display
  status: "draft" | "active" | "completed" // Updated status options
  categories: string[]
  totalQuestions: number // Added for assignment display
  totalStudents: number // Added for progress tracking
  completedBy: number // Added for completion tracking
}

export interface Classroom {
  id: string
  name: string
  description: string
  code: string
  teacherId: string
  teacherName: string
  students: Student[]
  assignments: Assignment[]
  createdAt: Date
  settings: {
    allowHints: boolean
    showLeaderboard: boolean
    autoGrade: boolean
  }
}

export interface StudentProgress {
  studentId: string
  assignmentId: string
  status: "not_started" | "in_progress" | "completed"
  score: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  completedAt?: Date
  attempts: number
}

export interface ClassroomAnalytics {
  totalStudents: number
  activeStudents: number
  averageScore: number
  completionRate: number
  topPerformers: Student[]
  strugglingStudents: Student[]
  popularTopics: string[]
  difficultyDistribution: Record<number, number>
}

export interface TeacherAnalytics {
  totalStudents: number
  newStudentsThisWeek: number
  averageScore: number
  scoreImprovement: number
  totalTimeSpent: number
  avgSessionTime: number
  completedAssignments: number
  completionRate: number
  topicPerformance: Array<{
    name: string
    score: number
  }>
  topStudents: Array<{
    name: string
    rank: string
    score: number
    xp: number
  }>
}

export class TeacherService {
  private classrooms: Map<string, Classroom> = new Map()
  private studentProgress: Map<string, StudentProgress[]> = new Map()

  // Mock data for demonstration
  private mockStudents: Student[] = [
    {
      id: "student_1",
      name: "María González",
      email: "maria.gonzalez@estudiante.edu.ni",
      rank: "Sargento",
      xp: 2340,
      joinedAt: new Date("2024-01-15"),
      lastActive: new Date(),
      stats: {
        totalProblems: 156,
        correctAnswers: 142,
        averageTime: 45,
        currentStreak: 12,
        maxStreak: 28,
        weakAreas: ["Ecuaciones complejas"],
        strongAreas: ["Operaciones básicas", "Problemas verbales"],
      },
      classrooms: ["class_1"],
    },
    {
      id: "student_2",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@estudiante.edu.ni",
      rank: "Capitán",
      xp: 4120,
      joinedAt: new Date("2024-01-10"),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      stats: {
        totalProblems: 203,
        correctAnswers: 178,
        averageTime: 38,
        currentStreak: 8,
        maxStreak: 35,
        weakAreas: ["Problemas verbales"],
        strongAreas: ["Ecuaciones lineales", "Álgebra básica"],
      },
      classrooms: ["class_1"],
    },
    {
      id: "student_3",
      name: "Ana Rodríguez",
      email: "ana.rodriguez@estudiante.edu.ni",
      rank: "Soldado",
      xp: 890,
      joinedAt: new Date("2024-02-01"),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      stats: {
        totalProblems: 67,
        correctAnswers: 52,
        averageTime: 62,
        currentStreak: 3,
        maxStreak: 15,
        weakAreas: ["Ecuaciones lineales", "Álgebra básica"],
        strongAreas: ["Operaciones básicas"],
      },
      classrooms: ["class_1"],
    },
    {
      id: "student_4",
      name: "Diego Herrera",
      email: "diego.herrera@estudiante.edu.ni",
      rank: "Coronel",
      xp: 7890,
      joinedAt: new Date("2023-12-05"),
      lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      stats: {
        totalProblems: 312,
        correctAnswers: 289,
        averageTime: 32,
        currentStreak: 22,
        maxStreak: 45,
        weakAreas: [],
        strongAreas: ["Ecuaciones complejas", "Enigmas", "Álgebra avanzada"],
      },
      classrooms: ["class_1"],
    },
  ]

  constructor() {
    // Initialize with mock classroom
    this.initializeMockData()
  }

  private initializeMockData() {
    const mockClassroom: Classroom = {
      id: "class_1",
      name: "Álgebra 8° Grado - Sección A",
      description: "Clase de álgebra básica para estudiantes de octavo grado",
      code: "ALG8A2024",
      teacherId: "teacher_1",
      teacherName: "Prof. Roberto Martínez",
      students: this.mockStudents,
      assignments: [
        {
          id: "assign_1",
          title: "Ecuaciones Lineales - Práctica 1",
          description: "Resolver ecuaciones lineales básicas con una variable",
          difficulty: 2,
          questionCount: 10,
          timeLimit: 600,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          createdAt: new Date("2024-01-20"),
          createdBy: "teacher_1",
          classroomId: "class_1",
          status: "published",
          categories: ["linear_equations"],
        },
        {
          id: "assign_2",
          title: "Problemas Verbales Nicaragüenses",
          description: "Problemas contextualizados con situaciones de Nicaragua",
          difficulty: 3,
          questionCount: 8,
          timeLimit: 720,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          createdAt: new Date("2024-01-25"),
          createdBy: "teacher_1",
          classroomId: "class_1",
          status: "published",
          categories: ["word_problems"],
        },
      ],
      createdAt: new Date("2024-01-01"),
      settings: {
        allowHints: true,
        showLeaderboard: true,
        autoGrade: true,
      },
    }

    this.classrooms.set("class_1", mockClassroom)

    // Mock student progress
    const mockProgress: StudentProgress[] = [
      {
        studentId: "student_1",
        assignmentId: "assign_1",
        status: "completed",
        score: 85,
        correctAnswers: 8,
        totalQuestions: 10,
        timeSpent: 420,
        completedAt: new Date("2024-01-22"),
        attempts: 1,
      },
      {
        studentId: "student_2",
        assignmentId: "assign_1",
        status: "completed",
        score: 95,
        correctAnswers: 9,
        totalQuestions: 10,
        timeSpent: 380,
        completedAt: new Date("2024-01-21"),
        attempts: 1,
      },
      {
        studentId: "student_3",
        assignmentId: "assign_1",
        status: "in_progress",
        score: 60,
        correctAnswers: 6,
        totalQuestions: 10,
        timeSpent: 520,
        attempts: 2,
      },
      {
        studentId: "student_4",
        assignmentId: "assign_1",
        status: "completed",
        score: 100,
        correctAnswers: 10,
        totalQuestions: 10,
        timeSpent: 320,
        completedAt: new Date("2024-01-20"),
        attempts: 1,
      },
    ]

    this.studentProgress.set("class_1", mockProgress)
  }

  getClassroom(classroomId: string): Classroom | null {
    return this.classrooms.get(classroomId) || null
  }

  getTeacherClassrooms(teacherId: string): Classroom[] {
    return Array.from(this.classrooms.values()).filter((classroom) => classroom.teacherId === teacherId)
  }

  createClassroom(params: {
    name: string
    description: string
    grade: string
    teacherId: string
  }): Classroom {
    const classroomId = `class_${Date.now()}`
    const code = this.generateClassroomCode()

    const classroom: Classroom = {
      id: classroomId,
      name: params.name,
      description: params.description,
      code,
      teacherId: params.teacherId,
      teacherName: "Prof. Roberto Martínez", // Mock teacher name
      students: [],
      assignments: [],
      createdAt: new Date(),
      settings: {
        allowHints: true,
        showLeaderboard: true,
        autoGrade: true,
      },
    }

    this.classrooms.set(classroomId, classroom)
    return classroom
  }

  addStudentToClassroom(classroomId: string, student: Student): boolean {
    const classroom = this.classrooms.get(classroomId)
    if (!classroom) return false

    const existingStudent = classroom.students.find((s) => s.id === student.id)
    if (existingStudent) return false

    classroom.students.push(student)
    return true
  }

  createAssignment(
    classroomId: string,
    teacherId: string,
    assignment: Omit<Assignment, "id" | "createdAt" | "createdBy" | "classroomId">,
  ): Assignment | null {
    const classroom = this.classrooms.get(classroomId)
    if (!classroom || classroom.teacherId !== teacherId) return null

    const newAssignment: Assignment = {
      ...assignment,
      id: `assign_${Date.now()}`,
      createdAt: new Date(),
      createdBy: teacherId,
      classroomId,
    }

    classroom.assignments.push(newAssignment)
    return newAssignment
  }

  getStudentProgress(classroomId: string, studentId?: string): StudentProgress[] {
    const progress = this.studentProgress.get(classroomId) || []
    return studentId ? progress.filter((p) => p.studentId === studentId) : progress
  }

  getClassroomAnalytics(classroomId: string): ClassroomAnalytics | null {
    const classroom = this.classrooms.get(classroomId)
    if (!classroom) return null

    const progress = this.studentProgress.get(classroomId) || []
    const totalStudents = classroom.students.length
    const activeStudents = classroom.students.filter(
      (s) => Date.now() - s.lastActive.getTime() < 7 * 24 * 60 * 60 * 1000,
    ).length

    const completedAssignments = progress.filter((p) => p.status === "completed")
    const averageScore =
      completedAssignments.length > 0
        ? completedAssignments.reduce((sum, p) => sum + p.score, 0) / completedAssignments.length
        : 0

    const completionRate =
      classroom.assignments.length > 0
        ? (completedAssignments.length / (classroom.assignments.length * totalStudents)) * 100
        : 0

    const topPerformers = [...classroom.students].sort((a, b) => b.xp - a.xp).slice(0, 3)

    const strugglingStudents = classroom.students.filter(
      (s) => s.stats.totalProblems > 10 && s.stats.correctAnswers / s.stats.totalProblems < 0.7,
    )

    return {
      totalStudents,
      activeStudents,
      averageScore,
      completionRate,
      topPerformers,
      strugglingStudents,
      popularTopics: ["Ecuaciones lineales", "Problemas verbales", "Operaciones básicas"],
      difficultyDistribution: { 1: 25, 2: 35, 3: 30, 4: 10 },
    }
  }

  updateStudentProgress(
    classroomId: string,
    studentId: string,
    assignmentId: string,
    progress: Partial<StudentProgress>,
  ): boolean {
    const classroomProgress = this.studentProgress.get(classroomId) || []
    const existingIndex = classroomProgress.findIndex(
      (p) => p.studentId === studentId && p.assignmentId === assignmentId,
    )

    if (existingIndex !== -1) {
      classroomProgress[existingIndex] = { ...classroomProgress[existingIndex], ...progress }
    } else {
      classroomProgress.push({
        studentId,
        assignmentId,
        status: "not_started",
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        timeSpent: 0,
        attempts: 0,
        ...progress,
      })
    }

    this.studentProgress.set(classroomId, classroomProgress)
    return true
  }

  private generateClassroomCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  exportClassroomData(classroomId: string): any {
    const classroom = this.classrooms.get(classroomId)
    const progress = this.studentProgress.get(classroomId)
    const analytics = this.getClassroomAnalytics(classroomId)

    return {
      classroom,
      progress,
      analytics,
      exportedAt: new Date(),
    }
  }

  getTeacherAssignments(teacherId: string): Assignment[] {
    const teacherClassrooms = this.getTeacherClassrooms(teacherId)
    const assignments: Assignment[] = []

    teacherClassrooms.forEach((classroom) => {
      classroom.assignments.forEach((assignment) => {
        const progress = this.getStudentProgress(classroom.id)
        const completedCount = progress.filter(
          (p) => p.assignmentId === assignment.id && p.status === "completed",
        ).length

        assignments.push({
          ...assignment,
          classroomName: classroom.name,
          totalQuestions: assignment.questionCount,
          totalStudents: classroom.students.length,
          completedBy: completedCount,
          status: assignment.status as "draft" | "active" | "completed",
        })
      })
    })

    return assignments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getTeacherAnalytics(teacherId: string): TeacherAnalytics {
    const classrooms = this.getTeacherClassrooms(teacherId)
    const allStudents = classrooms.flatMap((c) => c.students)
    const allProgress = classrooms.flatMap((c) => this.getStudentProgress(c.id))

    const completedProgress = allProgress.filter((p) => p.status === "completed")
    const averageScore =
      completedProgress.length > 0
        ? completedProgress.reduce((sum, p) => sum + p.score, 0) / completedProgress.length
        : 0

    const totalTimeSpent = Math.round(allProgress.reduce((sum, p) => sum + p.timeSpent, 0) / 3600) // Convert to hours

    const topicPerformance = [
      { name: "Ecuaciones Lineales", score: 85 },
      { name: "Problemas Verbales", score: 78 },
      { name: "Operaciones Básicas", score: 92 },
      { name: "Álgebra Avanzada", score: 71 },
      { name: "Enigmas Matemáticos", score: 68 },
    ]

    const topStudents = allStudents
      .sort(
        (a, b) =>
          b.stats.correctAnswers / Math.max(b.stats.totalProblems, 1) -
          a.stats.correctAnswers / Math.max(a.stats.totalProblems, 1),
      )
      .slice(0, 5)
      .map((student) => ({
        name: student.name,
        rank: student.rank,
        score: Math.round((student.stats.correctAnswers / Math.max(student.stats.totalProblems, 1)) * 100),
        xp: student.xp,
      }))

    return {
      totalStudents: allStudents.length,
      newStudentsThisWeek: 3, // Mock data
      averageScore: Math.round(averageScore),
      scoreImprovement: 5, // Mock improvement
      totalTimeSpent,
      avgSessionTime: 45, // Mock average session time
      completedAssignments: completedProgress.length,
      completionRate: Math.round((completedProgress.length / Math.max(allProgress.length, 1)) * 100),
      topicPerformance,
      topStudents,
    }
  }
}

export const teacherService = new TeacherService()
