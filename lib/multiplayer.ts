"use client"

import type { Question } from "./questions"
import type { User } from "./auth"

export interface Player {
  id: string
  name: string
  rank: string
  xp: number
  avatar?: string
  isReady: boolean
  score: number
  currentAnswer?: string | number
  timeSpent: number
}

export interface GameRoom {
  id: string
  name: string
  type: "1v1" | "battle_royale" | "private"
  status: "waiting" | "starting" | "in_progress" | "finished"
  maxPlayers: number
  currentPlayers: number
  players: Player[]
  currentQuestion?: Question
  questionIndex: number
  totalQuestions: number
  createdBy: string
  createdAt: Date
  settings: {
    difficulty: "mixed" | 1 | 2 | 3 | 4
    timeLimit: number
    questionCount: number
    allowHints: boolean
  }
}

export interface BattleResult {
  playerId: string
  playerName: string
  rank: string
  score: number
  correctAnswers: number
  totalTime: number
  xpGained: number
  position: number
}

export class MultiplayerService {
  private rooms: Map<string, GameRoom> = new Map()
  private playerRooms: Map<string, string> = new Map()

  // Simulate AI opponents for demo purposes
  private aiOpponents = [
    { name: "MathBot Alpha", rank: "Sargento", xp: 1500 },
    { name: "AlgebraKnight", rank: "Capitán", xp: 4200 },
    { name: "EquationMaster", rank: "Coronel", xp: 8900 },
    { name: "NumberNinja", rank: "Soldado", xp: 800 },
    { name: "CalculusCommander", rank: "General", xp: 18000 },
  ]

  createRoom(
    creator: User,
    type: "1v1" | "battle_royale" | "private",
    settings: GameRoom["settings"],
    roomName?: string,
  ): GameRoom {
    const roomId = this.generateRoomId()
    const maxPlayers = type === "1v1" ? 2 : type === "battle_royale" ? 8 : 10

    const room: GameRoom = {
      id: roomId,
      name: roomName || `${creator.name}'s Room`,
      type,
      status: "waiting",
      maxPlayers,
      currentPlayers: 1,
      players: [
        {
          id: creator.id,
          name: creator.name,
          rank: creator.rank,
          xp: creator.xp,
          isReady: false,
          score: 0,
          timeSpent: 0,
        },
      ],
      questionIndex: 0,
      totalQuestions: settings.questionCount,
      createdBy: creator.id,
      createdAt: new Date(),
      settings,
    }

    this.rooms.set(roomId, room)
    this.playerRooms.set(creator.id, roomId)

    return room
  }

  joinRoom(roomId: string, player: User): GameRoom | null {
    const room = this.rooms.get(roomId)
    if (!room || room.currentPlayers >= room.maxPlayers || room.status !== "waiting") {
      return null
    }

    const newPlayer: Player = {
      id: player.id,
      name: player.name,
      rank: player.rank,
      xp: player.xp,
      isReady: false,
      score: 0,
      timeSpent: 0,
    }

    room.players.push(newPlayer)
    room.currentPlayers++
    this.playerRooms.set(player.id, roomId)

    return room
  }

  findMatch(player: User, type: "1v1" | "battle_royale"): GameRoom {
    // Try to find existing room
    const availableRooms = Array.from(this.rooms.values()).filter(
      (room) => room.type === type && room.status === "waiting" && room.currentPlayers < room.maxPlayers,
    )

    if (availableRooms.length > 0) {
      const room = availableRooms[0]
      this.joinRoom(room.id, player)
      return room
    }

    // Create new room with AI opponents
    const settings: GameRoom["settings"] = {
      difficulty: "mixed",
      timeLimit: 60,
      questionCount: type === "1v1" ? 5 : 10,
      allowHints: false,
    }

    const room = this.createRoom(player, type, settings)

    // Add AI opponents
    const opponentsNeeded = type === "1v1" ? 1 : Math.floor(Math.random() * 4) + 3
    for (let i = 0; i < opponentsNeeded; i++) {
      const aiOpponent = this.aiOpponents[Math.floor(Math.random() * this.aiOpponents.length)]
      const aiPlayer: Player = {
        id: `ai_${Date.now()}_${i}`,
        name: aiOpponent.name,
        rank: aiOpponent.rank,
        xp: aiOpponent.xp,
        isReady: true,
        score: 0,
        timeSpent: 0,
      }
      room.players.push(aiPlayer)
      room.currentPlayers++
    }

    return room
  }

  setPlayerReady(roomId: string, playerId: string, ready: boolean): GameRoom | null {
    const room = this.rooms.get(roomId)
    if (!room) return null

    const player = room.players.find((p) => p.id === playerId)
    if (player) {
      player.isReady = ready
    }

    // Check if all players are ready
    const allReady = room.players.every((p) => p.isReady)
    if (allReady && room.status === "waiting") {
      room.status = "starting"
      // Simulate game start delay
      setTimeout(() => {
        room.status = "in_progress"
      }, 3000)
    }

    return room
  }

  submitAnswer(
    roomId: string,
    playerId: string,
    answer: string | number,
    timeSpent: number,
    isCorrect: boolean,
  ): GameRoom | null {
    const room = this.rooms.get(roomId)
    if (!room || room.status !== "in_progress") return null

    const player = room.players.find((p) => p.id === playerId)
    if (!player) return null

    player.currentAnswer = answer
    player.timeSpent += timeSpent

    if (isCorrect) {
      // Score calculation: base points + time bonus
      const timeBonus = Math.max(0, 100 - timeSpent)
      player.score += 100 + timeBonus
    }

    // Simulate AI answers
    room.players.forEach((p) => {
      if (p.id.startsWith("ai_") && !p.currentAnswer) {
        const aiTimeSpent = Math.random() * 45 + 15 // 15-60 seconds
        const aiCorrect = Math.random() > 0.3 // 70% accuracy for AI
        p.currentAnswer = aiCorrect ? "correct" : "wrong"
        p.timeSpent += aiTimeSpent

        if (aiCorrect) {
          const timeBonus = Math.max(0, 100 - aiTimeSpent)
          p.score += 100 + timeBonus
        }
      }
    })

    // Check if all players have answered
    const allAnswered = room.players.every((p) => p.currentAnswer !== undefined)
    if (allAnswered) {
      // Move to next question or end game
      room.questionIndex++
      if (room.questionIndex >= room.totalQuestions) {
        room.status = "finished"
      } else {
        // Reset for next question
        room.players.forEach((p) => {
          p.currentAnswer = undefined
        })
      }
    }

    return room
  }

  getRoom(roomId: string): GameRoom | null {
    return this.rooms.get(roomId) || null
  }

  getPlayerRoom(playerId: string): GameRoom | null {
    const roomId = this.playerRooms.get(playerId)
    return roomId ? this.rooms.get(roomId) || null : null
  }

  leaveRoom(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId)
    if (!room) return

    room.players = room.players.filter((p) => p.id !== playerId)
    room.currentPlayers--
    this.playerRooms.delete(playerId)

    if (room.currentPlayers === 0) {
      this.rooms.delete(roomId)
    }
  }

  getLeaderboard(): BattleResult[] {
    // Simulate global leaderboard
    return [
      {
        playerId: "1",
        playerName: "MathMaster2024",
        rank: "General",
        score: 15420,
        correctAnswers: 89,
        totalTime: 1250,
        xpGained: 2340,
        position: 1,
      },
      {
        playerId: "2",
        playerName: "AlgebraAce",
        rank: "Coronel",
        score: 14890,
        correctAnswers: 85,
        totalTime: 1340,
        xpGained: 2180,
        position: 2,
      },
      {
        playerId: "3",
        playerName: "EquationExpert",
        rank: "Capitán",
        score: 13560,
        correctAnswers: 78,
        totalTime: 1420,
        xpGained: 1950,
        position: 3,
      },
    ]
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase()
  }
}

export const multiplayerService = new MultiplayerService()
