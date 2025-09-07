"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BookOpen, ArrowLeft } from "lucide-react"

export default function CampaignPage() {
  const router = useRouter()

  return (
    <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full text-center neon-border border-primary/50">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-orbitron text-3xl text-primary neon-glow">Modo Campaña</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            ¡Próximamente!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Esta sección está en desarrollo. Aquí encontrarás misiones estructuradas con una dificultad progresiva para que te conviertas en un maestro del álgebra.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="w-full font-orbitron"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú Principal
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
