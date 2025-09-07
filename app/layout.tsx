import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { Rajdhani } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MathQuizEscolar: Battle Mode",
  description: "Aplicación educativa gamificada para álgebra básica - Nicaragua",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#0a0a2a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans ${orbitron.variable} ${rajdhani.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen bg-background military-grid">
            {children}
            <OfflineIndicator />
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
