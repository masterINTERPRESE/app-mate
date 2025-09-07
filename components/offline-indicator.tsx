"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Send as Sync, Check } from "lucide-react"
import { offlineManager } from "@/lib/offline-manager"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingItems, setPendingItems] = useState(0)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const initializeOffline = async () => {
      try {
        // Initialize offline manager
        await offlineManager.initialize()

        // Set initial online status
        setIsOnline(navigator.onLine)

        // Check pending items
        await checkPendingItems()

        // Listen for connection changes
        cleanup = offlineManager.onConnectionChange(async (online) => {
          setIsOnline(online)
          if (online) {
            setIsSyncing(true)
            try {
              await offlineManager.syncWhenOnline()
              await checkPendingItems()
            } catch (error) {
              console.error("Sync failed:", error)
            } finally {
              setIsSyncing(false)
            }
          }
        })

        // Check pending items periodically
        const interval = setInterval(checkPendingItems, 30000) // Every 30 seconds

        return () => {
          clearInterval(interval)
          if (cleanup) cleanup()
        }
      } catch (error) {
        console.error("Failed to initialize offline features:", error)
      }
    }

    initializeOffline()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const checkPendingItems = async () => {
    try {
      const [progress, scores] = await Promise.all([
        offlineManager.getUnsyncedProgress(),
        offlineManager.getUnsyncedScores(),
      ])
      setPendingItems(progress.length + scores.length)
    } catch (error) {
      console.error("Failed to check pending items:", error)
      setPendingItems(0)
    }
  }

  const handleManualSync = async () => {
    if (!isOnline) return

    setIsSyncing(true)
    try {
      await offlineManager.syncWhenOnline()
      await checkPendingItems()
    } catch (error) {
      console.error("Manual sync failed:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
          isOnline
            ? "bg-green-900/40 border-green-400/60 text-green-300"
            : "bg-red-900/40 border-red-400/60 text-red-300"
        }`}
      >
        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}

        <span className="text-sm font-rajdhani font-medium">{isOnline ? "En línea" : "Sin conexión"}</span>

        {pendingItems > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs bg-yellow-900/40 text-yellow-300 px-2 py-1 rounded border border-yellow-400/40">
              {pendingItems} pendientes
            </span>

            {isOnline && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Sincronizar ahora"
              >
                {isSyncing ? <Sync className="w-3 h-3 animate-spin" /> : <Sync className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}

        {isOnline && pendingItems === 0 && <Check className="w-4 h-4 text-green-300" />}
      </div>
    </div>
  )
}
