"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Question } from "@/lib/questions"
import { Clock, Lightbulb, Target, Zap } from "lucide-react"

interface QuestionDisplayProps {
  question: Question
  onAnswer: (answer: string | number, timeSpent: number) => void
  onHint?: () => void
  showHint?: boolean
  hintText?: string
}

export function QuestionDisplay({ question, onAnswer, onHint, showHint, hintText }: QuestionDisplayProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(question.timeLimit)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    setTimeLeft(question.timeLimit)
    setUserAnswer("")
  }, [question])

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSubmit = () => {
    const timeSpent = (Date.now() - startTime) / 1000
    onAnswer(userAnswer, timeSpent)
  }

  const handleOptionSelect = (option: string) => {
    const timeSpent = (Date.now() - startTime) / 1000
    onAnswer(option, timeSpent)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "text-primary"
      case 2:
        return "text-secondary"
      case 3:
        return "text-accent"
      case 4:
        return "text-purple-400"
      default:
        return "text-primary"
    }
  }

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "RECLUTA"
      case 2:
        return "SOLDADO"
      case 3:
        return "SARGENTO"
      case 4:
        return "CAPITÁN"
      default:
        return "RECLUTA"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "equation":
        return "📐"
      case "word_problem":
        return "📝"
      case "enigma":
        return "🧩"
      case "multiple_choice":
        return "🎯"
      default:
        return "❓"
    }
  }

  const progressPercentage = (timeLeft / question.timeLimit) * 100
  const isTimeRunningOut = timeLeft <= 10

  return (
    <Card className="neon-border border-primary/50 max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTypeIcon(question.type)}</div>
            <div>
              <CardTitle className="font-orbitron text-lg">{"MISIÓN MATEMÁTICA"}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Badge>
                {question.context === "nicaragua" && (
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                    🇳🇮 NICARAGUA
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-mono text-primary">+{question.xpReward} XP</span>
          </div>
        </div>

        {/* Timer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {"Tiempo restante"}
            </span>
            <span className={`font-mono ${isTimeRunningOut ? "text-accent animate-pulse" : "text-foreground"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <Progress value={progressPercentage} className={`h-2 ${isTimeRunningOut ? "animate-pulse" : ""}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="p-4 bg-card/50 rounded-lg border border-border">
          <p className="text-lg leading-relaxed">{question.question}</p>
        </div>

        {/* Answer Input */}
        {question.type === "multiple_choice" && question.options ? (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-4 border-border hover:border-primary/50 bg-transparent"
                onClick={() => handleOptionSelect(option)}
              >
                <span className="font-mono text-primary mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Tu respuesta:"}</label>
              <div className="flex gap-2">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="bg-input border-border"
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                />
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron px-6"
                  disabled={!userAnswer.trim()}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {"ENVIAR"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hint Button */}
        {onHint && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onHint}
              className="border-secondary/50 text-secondary hover:bg-secondary/10 bg-transparent"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {"PISTA"}
            </Button>
          </div>
        )}

        {/* Hint Display */}
        {showHint && hintText && (
          <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-secondary">{hintText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
