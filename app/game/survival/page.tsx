"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Trophy, ArrowLeft } from "lucide-react"

export default function SurvivalPage() {
  const router = useRouter()

  return (
    <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full text-center neon-border border-accent/50">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <CardTitle className="font-orbitron text-3xl text-accent neon-glow">Modo Supervivencia</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            ¡Próximamente!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Esta sección está en desarrollo. ¿Cuántos problemas consecutivos podrás resolver antes de cometer un error? ¡Pon a prueba tu resistencia!
          </p>
          <Button
            onClick={() => router.push("/")}
            variant="destructive"
            className="w-full font-orbitron bg-accent hover:bg-accent/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
