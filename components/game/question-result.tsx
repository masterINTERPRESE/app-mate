"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/lib/questions"
import { CheckCircle, XCircle, Clock, Target, BookOpen } from "lucide-react"

interface QuestionResultProps {
  question: Question
  userAnswer: string | number
  isCorrect: boolean
  timeSpent: number
  xpGained: number
  streakCount: number
  onContinue: () => void
  showExplanation?: boolean
}

export function QuestionResult({
  question,
  userAnswer,
  isCorrect,
  timeSpent,
  xpGained,
  streakCount,
  onContinue,
  showExplanation = true,
}: QuestionResultProps) {
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(1).padStart(4, "0")}`
  }

  return (
    <Card className={`neon-border max-w-2xl mx-auto ${isCorrect ? "border-primary/50" : "border-accent/50"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCorrect ? <CheckCircle className="w-8 h-8 text-primary" /> : <XCircle className="w-8 h-8 text-accent" />}
            <div>
              <CardTitle className={`font-orbitron text-xl ${isCorrect ? "text-primary" : "text-accent"}`}>
                {isCorrect ? "¡MISIÓN COMPLETADA!" : "MISIÓN FALLIDA"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isCorrect ? "Excelente trabajo, soldado" : "No te rindas, inténtalo de nuevo"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-mono text-primary">+{xpGained} XP</span>
            </div>
            {streakCount > 1 && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                Racha: {streakCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Answer Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Tu respuesta</div>
              <div className={`font-mono text-lg ${isCorrect ? "text-primary" : "text-accent"}`}>
                {userAnswer.toString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Respuesta correcta</div>
              <div className="font-mono text-lg text-primary">{question.answer.toString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Tiempo
              </div>
              <div className="font-mono text-lg text-secondary">{formatTime(timeSpent)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                {"Explicación paso a paso"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {question.explanation.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-secondary/20 text-secondary rounded-full flex items-center justify-center text-sm font-mono">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onContinue}
            className={`font-orbitron px-8 ${
              isCorrect
                ? "bg-primary hover:bg-primary/80 text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            {isCorrect ? "SIGUIENTE MISIÓN" : "REINTENTAR"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
