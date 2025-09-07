"use client"

export interface Rank {
  id: string
  name: string
  minXP: number
  maxXP: number
  color: string
  icon: string
  benefits: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  type: "bronze" | "silver" | "gold" | "platinum"
  requirement: number
  category: "problems" | "streak" | "accuracy" | "speed" | "special"
  unlocked: boolean
  unlockedAt?: Date
}

export interface UserStats {
  totalProblems: number
  correctAnswers: number
  currentStreak: number
  maxStreak: number
  totalXP: number
  averageTime: number
  fastestTime: number
  achievements: Achievement[]
  rank: Rank
}

export const RANKS: Rank[] = [
  {
    id: "soldado",
    name: "Soldado",
    minXP: 0,
    maxXP: 999,
    color: "#39ff14",
    icon: "🎖️",
    benefits: ["Acceso a modo Campaña", "Problemas básicos"],
  },
  {
    id: "sargento",
    name: "Sargento",
    minXP: 1000,
    maxXP: 2999,
    color: "#00bfff",
    icon: "⭐",
    benefits: ["Modo Batalla Rápida", "Problemas intermedios", "+10% XP bonus"],
  },
  {
    id: "capitan",
    name: "Capitán",
    minXP: 3000,
    maxXP: 6999,
    color: "#ff073a",
    icon: "🏅",
    benefits: ["Modo Supervivencia", "Problemas avanzados", "+20% XP bonus", "Acceso a enigmas"],
  },
  {
    id: "coronel",
    name: "Coronel",
    minXP: 7000,
    maxXP: 14999,
    color: "#ffd700",
    icon: "🎗️",
    benefits: ["Modo Multijugador", "Problemas expertos", "+30% XP bonus", "Crear salas privadas"],
  },
  {
    id: "general",
    name: "General",
    minXP: 15000,
    maxXP: Number.POSITIVE_INFINITY,
    color: "#ff6b35",
    icon: "👑",
    benefits: ["Todos los modos", "Problemas maestros", "+50% XP bonus", "Panel de liderazgo", "Insignias especiales"],
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  // Problemas resueltos
  {
    id: "first_steps",
    name: "Primeros Pasos",
    description: "Resuelve tu primer problema",
    icon: "🎯",
    type: "bronze",
    requirement: 1,
    category: "problems",
    unlocked: false,
  },
  {
    id: "problem_solver",
    name: "Solucionador",
    description: "Resuelve 10 problemas",
    icon: "🧮",
    type: "bronze",
    requirement: 10,
    category: "problems",
    unlocked: false,
  },
  {
    id: "math_warrior",
    name: "Guerrero Matemático",
    description: "Resuelve 50 problemas",
    icon: "⚔️",
    type: "silver",
    requirement: 50,
    category: "problems",
    unlocked: false,
  },
  {
    id: "algebra_master",
    name: "Maestro del Álgebra",
    description: "Resuelve 100 problemas",
    icon: "🏆",
    type: "gold",
    requirement: 100,
    category: "problems",
    unlocked: false,
  },
  {
    id: "math_legend",
    name: "Leyenda Matemática",
    description: "Resuelve 500 problemas",
    icon: "👑",
    type: "platinum",
    requirement: 500,
    category: "problems",
    unlocked: false,
  },

  // Rachas
  {
    id: "streak_starter",
    name: "Inicio de Racha",
    description: "Consigue una racha de 5",
    icon: "🔥",
    type: "bronze",
    requirement: 5,
    category: "streak",
    unlocked: false,
  },
  {
    id: "hot_streak",
    name: "Racha Caliente",
    description: "Consigue una racha de 15",
    icon: "🌟",
    type: "silver",
    requirement: 15,
    category: "streak",
    unlocked: false,
  },
  {
    id: "unstoppable",
    name: "Imparable",
    description: "Consigue una racha de 30",
    icon: "💫",
    type: "gold",
    requirement: 30,
    category: "streak",
    unlocked: false,
  },

  // Precisión
  {
    id: "accurate_shooter",
    name: "Tirador Preciso",
    description: "Mantén 90% de precisión en 20 problemas",
    icon: "🎯",
    type: "silver",
    requirement: 90,
    category: "accuracy",
    unlocked: false,
  },
  {
    id: "perfect_aim",
    name: "Puntería Perfecta",
    description: "Mantén 95% de precisión en 50 problemas",
    icon: "🏹",
    type: "gold",
    requirement: 95,
    category: "accuracy",
    unlocked: false,
  },

  // Velocidad
  {
    id: "speed_demon",
    name: "Demonio de Velocidad",
    description: "Resuelve un problema en menos de 10 segundos",
    icon: "⚡",
    type: "silver",
    requirement: 10,
    category: "speed",
    unlocked: false,
  },
  {
    id: "lightning_fast",
    name: "Rápido como el Rayo",
    description: "Resuelve un problema en menos de 5 segundos",
    icon: "🌩️",
    type: "gold",
    requirement: 5,
    category: "speed",
    unlocked: false,
  },
]

export class GamificationService {
  calculateXP(isCorrect: boolean, timeSeconds: number, streak: number, difficulty: number): number {
    if (!isCorrect) return 0

    let baseXP = 10 * difficulty

    // Time bonus (faster = more XP)
    if (timeSeconds < 10) baseXP += 15
    else if (timeSeconds < 20) baseXP += 10
    else if (timeSeconds < 30) baseXP += 5

    // Streak bonus
    const streakBonus = Math.min(streak * 2, 50)

    return baseXP + streakBonus
  }

  getRankByXP(xp: number): Rank {
    return RANKS.find((rank) => xp >= rank.minXP && xp <= rank.maxXP) || RANKS[0]
  }

  checkAchievements(stats: UserStats): Achievement[] {
    const newAchievements: Achievement[] = []

    ACHIEVEMENTS.forEach((achievement) => {
      if (achievement.unlocked) return

      let shouldUnlock = false

      switch (achievement.category) {
        case "problems":
          shouldUnlock = stats.totalProblems >= achievement.requirement
          break
        case "streak":
          shouldUnlock = stats.maxStreak >= achievement.requirement
          break
        case "accuracy":
          const accuracy = stats.totalProblems > 0 ? (stats.correctAnswers / stats.totalProblems) * 100 : 0
          shouldUnlock = accuracy >= achievement.requirement && stats.totalProblems >= 20
          break
        case "speed":
          shouldUnlock = stats.fastestTime > 0 && stats.fastestTime <= achievement.requirement
          break
      }

      if (shouldUnlock) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date()
        newAchievements.push(achievement)
      }
    })

    return newAchievements
  }

  getXPToNextRank(currentXP: number): { current: Rank; next: Rank | null; xpNeeded: number } {
    const currentRank = this.getRankByXP(currentXP)
    const currentRankIndex = RANKS.findIndex((rank) => rank.id === currentRank.id)
    const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null
    const xpNeeded = nextRank ? nextRank.minXP - currentXP : 0

    return { current: currentRank, next: nextRank, xpNeeded }
  }
}

export const gamificationService = new GamificationService()
