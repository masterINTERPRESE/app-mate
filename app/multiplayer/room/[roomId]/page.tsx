"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { RoomLobby } from "@/components/multiplayer/room-lobby"
import { BattleArena } from "@/components/multiplayer/battle-arena"
import { BattleResults } from "@/components/multiplayer/battle-results"
import { authService, type User } from "@/lib/auth"
import { multiplayerService, type GameRoom } from "@/lib/multiplayer"
import { questionEngine, type Question } from "@/lib/questions"

export default function RoomPage() {
  const [user, setUser] = useState<User | null>(null)
  const [room, setRoom] = useState<GameRoom | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState("")

  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)

    const gameRoom = multiplayerService.getRoom(roomId)
    if (!gameRoom) {
      router.push("/multiplayer")
      return
    }
    setRoom(gameRoom)

    // Load first question if game is in progress
    if (gameRoom.status === "in_progress") {
      loadCurrentQuestion()
    }
  }, [roomId, router])

  const loadCurrentQuestion = () => {
    try {
      const difficulty = Math.min(4, Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4
      const questions = questionEngine.getQuestionsByDifficulty(difficulty, 1)
      if (questions.length > 0) {
        setCurrentQuestion(questions[0])
      }
    } catch (error) {
      console.error("Error loading question:", error)
    }
  }

  const handleReady = (ready: boolean) => {
    if (!user || !room) return

    const updatedRoom = multiplayerService.setPlayerReady(room.id, user.id, ready)
    if (updatedRoom) {
      setRoom(updatedRoom)

      // Start game if all players are ready
      if (updatedRoom.status === "starting") {
        setTimeout(() => {
          loadCurrentQuestion()
          const gameRoom = multiplayerService.getRoom(room.id)
          if (gameRoom) {
            setRoom(gameRoom)
          }
        }, 3000)
      }
    }
  }

  const handleAnswer = (answer: string | number, timeSpent: number) => {
    if (!user || !room || !currentQuestion) return

    const isCorrect = questionEngine.validateAnswer(currentQuestion, answer)

    // Update user stats
    authService.updateUserStats({
      isCorrect,
      timeSeconds: timeSpent,
      difficulty: currentQuestion.difficulty,
    })

    // Update multiplayer room
    const updatedRoom = multiplayerService.submitAnswer(room.id, user.id, answer, timeSpent, isCorrect)
    if (updatedRoom) {
      setRoom(updatedRoom)

      // Load next question or finish game
      if (updatedRoom.status === "in_progress" && updatedRoom.questionIndex < updatedRoom.totalQuestions) {
        setTimeout(() => {
          loadCurrentQuestion()
          setShowHint(false)
          setHintText("")
        }, 2000)
      }
    }

    // Update user state
    setUser(authService.getCurrentUser())
  }

  const handleHint = () => {
    if (currentQuestion) {
      setHintText(questionEngine.generateHint(currentQuestion))
      setShowHint(true)
    }
  }

  const handleLeave = () => {
    if (user && room) {
      multiplayerService.leaveRoom(room.id, user.id)
    }
    router.push("/multiplayer")
  }

  const handlePlayAgain = () => {
    router.push("/multiplayer")
  }

  if (!user || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO SALA..."}</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {room.status === "waiting" || room.status === "starting" ? (
        <RoomLobby room={room} currentPlayerId={user.id} onReady={handleReady} onLeave={handleLeave} />
      ) : room.status === "in_progress" && currentQuestion ? (
        <BattleArena
          room={room}
          currentPlayerId={user.id}
          currentQuestion={currentQuestion}
          onAnswer={handleAnswer}
          onHint={handleHint}
          showHint={showHint}
          hintText={hintText}
        />
      ) : room.status === "finished" ? (
        <BattleResults room={room} currentPlayerId={user.id} onPlayAgain={handlePlayAgain} onLeave={handleLeave} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary font-orbitron text-xl neon-glow">{"PREPARANDO BATALLA..."}</div>
        </div>
      )}
    </main>
  )
}
