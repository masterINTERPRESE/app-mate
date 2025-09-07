"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User, Mail, Lock, Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string) => void
  onRegister: (email: string, password: string, name: string) => void
}

export function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onLogin(loginData.email, loginData.password)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    setIsLoading(true)
    try {
      await onRegister(registerData.email, registerData.password, registerData.name)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 military-grid">
      <Card className="w-full max-w-md neon-border border-primary/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-orbitron text-2xl text-primary neon-glow">{"ACCESO MILITAR"}</CardTitle>
          <CardDescription>{"Ingresa al campo de batalla matemático"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="font-orbitron">
                {"INGRESAR"}
              </TabsTrigger>
              <TabsTrigger value="register" className="font-orbitron">
                {"RECLUTAR"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {"Correo Electrónico"}
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="soldado@mathquiz.ni"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {"Contraseña"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-input border-border pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron"
                  disabled={isLoading}
                >
                  {isLoading ? "ACCEDIENDO..." : "INICIAR MISIÓN"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {"Nombre de Soldado"}
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Recluta Matemático"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {"Correo Electrónico"}
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="nuevo.soldado@mathquiz.ni"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {"Contraseña"}
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {"Confirmar Contraseña"}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-orbitron"
                  disabled={isLoading}
                >
                  {isLoading ? "RECLUTANDO..." : "UNIRSE AL EJÉRCITO"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
