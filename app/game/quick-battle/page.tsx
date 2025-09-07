"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QuestionDisplay } from "@/components/game/question-display"
import { QuestionResult } from "@/components/game/question-result"
import { XPNotification } from "@/components/gamification/xp-notification"
import { authService, type User } from "@/lib/auth"
import { questionEngine, type Question } from "@/lib/questions"
import { ArrowLeft, Zap, Target, Trophy } from "lucide-react"

type GameState = "playing" | "result" | "finished"

export default function QuickBattlePage() {
  const [user, setUser] = useState<User | null>(null)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string | number>("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [xpGained, setXpGained] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState("")
  const [gameStats, setGameStats] = useState({
    totalQuestions: 5,
    correctAnswers: 0,
    totalXP: 0,
    currentStreak: 0,
  })
  const [showXPNotification, setShowXPNotification] = useState(false)
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
        loadNextQuestion();
      }
    };
    fetchUser();
  }, [router]);

  const loadNextQuestion = () => {
    try {
      const difficulty = Math.min(4, Math.floor(questionIndex / 2) + 1) as 1 | 2 | 3 | 4
      const questions = questionEngine.getQuestionsByDifficulty(difficulty, 1)

      if (questions.length > 0) {
        setCurrentQuestion(questions[0])
        setShowHint(false)
        setHintText("")
      } else {
        // Fallback to random question
        setCurrentQuestion(questionEngine.getRandomQuestion())
      }
    } catch (error) {
      console.error("Error loading question:", error)
      setGameState("finished")
    }
  }

  const handleAnswer = async (answer: string | number, timeSpentSeconds: number) => {
    if (!currentQuestion || !user) return

    setUserAnswer(answer)
    setTimeSpent(timeSpentSeconds)

    const correct = questionEngine.validateAnswer(currentQuestion, answer)
    setIsCorrect(correct)

    try {
      // Update user stats via API
      const updatedUser = await authService.updateUserStats({
        isCorrect: correct,
        timeSeconds: timeSpentSeconds,
        difficulty: currentQuestion.difficulty,
      })

      // Calculate XP gained by comparing old and new XP
      const xpGained = updatedUser.xp - user.xp;
      setXpGained(xpGained);

      // In a real app, the API would return which achievements were newly unlocked.
      // For now, we'll just show a generic notification if XP was gained.
      // setNewAchievements(result.newAchievements.map((a) => a.name))

      // Update game stats
      setGameStats((prev) => ({
        ...prev,
        correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalXP: prev.totalXP + xpGained,
        currentStreak: correct ? prev.currentStreak + 1 : 0,
      }))

      // Update user state with the fresh data from the API
      setUser(updatedUser)

      // Show XP notification
      if (xpGained > 0) {
        setShowXPNotification(true)
      }
    } catch (error) {
        alert(error instanceof Error ? error.message : "Error al actualizar estadísticas");
    }


    setGameState("result")
  }

  const handleContinue = () => {
    if (questionIndex + 1 >= gameStats.totalQuestions) {
      setGameState("finished")
    } else {
      setQuestionIndex((prev) => prev + 1)
      setGameState("playing")
      loadNextQuestion()
    }
  }

  const handleHint = () => {
    if (currentQuestion) {
      setHintText(questionEngine.generateHint(currentQuestion))
      setShowHint(true)
    }
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setGameStats({
      totalQuestions: 5,
      correctAnswers: 0,
      totalXP: 0,
      currentStreak: 0,
    })
    setGameState("playing")
    loadNextQuestion()
  }

  if (!user || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-orbitron text-xl neon-glow">{"CARGANDO BATALLA..."}</div>
      </div>
    )
  }

  const progressPercentage = ((questionIndex + 1) / gameStats.totalQuestions) * 100

  return (
    <main className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/")}
            className="border-primary/50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-secondary neon-glow">{"BATALLA RÁPIDA"}</h1>
            <p className="text-muted-foreground">{"Resuelve problemas contra el tiempo"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-primary/50 text-primary">
            <Zap className="w-3 h-3 mr-1" />
            Racha: {gameStats.currentStreak}
          </Badge>
          <Badge variant="outline" className="border-secondary/50 text-secondary">
            <Target className="w-3 h-3 mr-1" />
            {gameStats.correctAnswers}/{gameStats.totalQuestions}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{"Progreso de batalla"}</span>
            <span className="font-mono">
              Pregunta {questionIndex + 1} de {gameStats.totalQuestions}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Game Content */}
      {gameState === "playing" && (
        <QuestionDisplay
          question={currentQuestion}
          onAnswer={handleAnswer}
          onHint={handleHint}
          showHint={showHint}
          hintText={hintText}
        />
      )}

      {gameState === "result" && (
        <QuestionResult
          question={currentQuestion}
          userAnswer={userAnswer}
          isCorrect={isCorrect}
          timeSpent={timeSpent}
          xpGained={xpGained}
          streakCount={gameStats.currentStreak}
          onContinue={handleContinue}
        />
      )}

      {gameState === "finished" && (
        <Card className="neon-border border-primary/50 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="font-orbitron text-2xl text-primary neon-glow">{"¡BATALLA COMPLETADA!"}</CardTitle>
            <p className="text-muted-foreground">{"Resumen de tu desempeño"}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-mono">{gameStats.correctAnswers}</div>
                <p className="text-sm text-muted-foreground">Respuestas correctas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary font-mono">{gameStats.totalXP}</div>
                <p className="text-sm text-muted-foreground">XP ganado</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-accent font-mono">
                {Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Precisión</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
              >
                {"NUEVA BATALLA"}
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-orbitron bg-transparent"
              >
                {"VOLVER AL CUARTEL"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* XP Notification */}
      {showXPNotification && (
        <XPNotification
          xpGained={xpGained}
          streakBonus={gameStats.currentStreak > 1 ? gameStats.currentStreak * 2 : 0}
          newAchievements={newAchievements}
          onClose={() => setShowXPNotification(false)}
        />
      )}
    </main>
  )
}
