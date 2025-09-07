"use client"

export interface OfflineProgress {
  id?: number
  userId: string
  questionId: string
  answer: string | number
  correct: boolean
  timeSpent: number
  timestamp: number
  synced: boolean
}

export interface OfflineScore {
  id?: number
  userId: string
  gameMode: string
  score: number
  xpEarned: number
  questionsAnswered: number
  correctAnswers: number
  timestamp: number
  synced: boolean
}

export class OfflineManager {
  private dbName = "MathQuizOfflineDB"
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Check if IndexedDB is available
      if (!window.indexedDB) {
        console.warn("IndexedDB not available, offline features disabled")
        resolve()
        return
      }

      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error("IndexedDB initialization failed:", request.error)
        resolve() // Don't reject, just continue without offline features
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log("IndexedDB initialized successfully")
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        try {
          // Questions store
          if (!db.objectStoreNames.contains("questions")) {
            db.createObjectStore("questions", { keyPath: "id" })
          }

          // Progress store
          if (!db.objectStoreNames.contains("progress")) {
            const progressStore = db.createObjectStore("progress", { keyPath: "id", autoIncrement: true })
            progressStore.createIndex("userId", "userId", { unique: false })
            progressStore.createIndex("synced", "synced", { unique: false })
          }

          // Scores store
          if (!db.objectStoreNames.contains("scores")) {
            const scoresStore = db.createObjectStore("scores", { keyPath: "id", autoIncrement: true })
            scoresStore.createIndex("userId", "userId", { unique: false })
            scoresStore.createIndex("synced", "synced", { unique: false })
          }

          // Settings store
          if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "key" })
          }
        } catch (error) {
          console.error("Error creating object stores:", error)
        }
      }
    })

    return this.initPromise
  }

  async storeProgress(progress: OfflineProgress): Promise<void> {
    if (!this.db) {
      console.warn("IndexedDB not available, cannot store progress")
      return
    }

    try {
      const transaction = this.db.transaction(["progress"], "readwrite")
      const store = transaction.objectStore("progress")

      await new Promise<void>((resolve, reject) => {
        const request = store.add({
          ...progress,
          timestamp: Date.now(),
          synced: false,
        })

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to store progress:", error)
    }
  }

  async storeScore(score: OfflineScore): Promise<void> {
    if (!this.db) {
      console.warn("IndexedDB not available, cannot store score")
      return
    }

    try {
      const transaction = this.db.transaction(["scores"], "readwrite")
      const store = transaction.objectStore("scores")

      await new Promise<void>((resolve, reject) => {
        const request = store.add({
          ...score,
          timestamp: Date.now(),
          synced: false,
        })

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to store score:", error)
    }
  }

  async getUnsyncedProgress(): Promise<OfflineProgress[]> {
    if (!this.db) {
      return []
    }

    try {
      const transaction = this.db.transaction(["progress"], "readonly")
      const store = transaction.objectStore("progress")

      return new Promise<OfflineProgress[]>((resolve, reject) => {
        const request = store.getAll()

        request.onsuccess = () => {
          const allProgress = request.result as OfflineProgress[]
          const unsyncedProgress = allProgress.filter((p) => !p.synced)
          resolve(unsyncedProgress)
        }

        request.onerror = () => {
          console.error("Failed to get unsynced progress:", request.error)
          resolve([]) // Return empty array on error
        }
      })
    } catch (error) {
      console.error("Error getting unsynced progress:", error)
      return []
    }
  }

  async getUnsyncedScores(): Promise<OfflineScore[]> {
    if (!this.db) {
      return []
    }

    try {
      const transaction = this.db.transaction(["scores"], "readonly")
      const store = transaction.objectStore("scores")

      return new Promise<OfflineScore[]>((resolve, reject) => {
        const request = store.getAll()

        request.onsuccess = () => {
          const allScores = request.result as OfflineScore[]
          const unsyncedScores = allScores.filter((s) => !s.synced)
          resolve(unsyncedScores)
        }

        request.onerror = () => {
          console.error("Failed to get unsynced scores:", request.error)
          resolve([]) // Return empty array on error
        }
      })
    } catch (error) {
      console.error("Error getting unsynced scores:", error)
      return []
    }
  }

  async markProgressSynced(id: number): Promise<void> {
    if (!this.db) return

    try {
      const transaction = this.db.transaction(["progress"], "readwrite")
      const store = transaction.objectStore("progress")

      await new Promise<void>((resolve, reject) => {
        const getRequest = store.get(id)
        getRequest.onsuccess = () => {
          const progress = getRequest.result
          if (progress) {
            progress.synced = true
            const putRequest = store.put(progress)
            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject(putRequest.error)
          } else {
            resolve()
          }
        }
        getRequest.onerror = () => reject(getRequest.error)
      })
    } catch (error) {
      console.error("Failed to mark progress as synced:", error)
    }
  }

  async markScoreSynced(id: number): Promise<void> {
    if (!this.db) return

    try {
      const transaction = this.db.transaction(["scores"], "readwrite")
      const store = transaction.objectStore("scores")

      await new Promise<void>((resolve, reject) => {
        const getRequest = store.get(id)
        getRequest.onsuccess = () => {
          const score = getRequest.result
          if (score) {
            score.synced = true
            const putRequest = store.put(score)
            putRequest.onsuccess = () => resolve()
            putRequest.onerror = () => reject(putRequest.error)
          } else {
            resolve()
          }
        }
        getRequest.onerror = () => reject(getRequest.error)
      })
    } catch (error) {
      console.error("Failed to mark score as synced:", error)
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) return

    try {
      // Sync progress
      const unsyncedProgress = await this.getUnsyncedProgress()
      for (const progress of unsyncedProgress) {
        try {
          const response = await fetch("/api/sync/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(progress),
          })

          if (response.ok && progress.id) {
            await this.markProgressSynced(progress.id)
          }
        } catch (error) {
          console.error("Failed to sync progress:", error)
        }
      }

      // Sync scores
      const unsyncedScores = await this.getUnsyncedScores()
      for (const score of unsyncedScores) {
        try {
          const response = await fetch("/api/sync/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(score),
          })

          if (response.ok && score.id) {
            await this.markScoreSynced(score.id)
          }
        } catch (error) {
          console.error("Failed to sync score:", error)
        }
      }
    } catch (error) {
      console.error("Sync failed:", error)
    }
  }

  async clearSyncedData(): Promise<void> {
    if (!this.db) return

    try {
      // Get all synced items and delete them
      const progressTransaction = this.db.transaction(["progress"], "readwrite")
      const progressStore = progressTransaction.objectStore("progress")

      const progressRequest = progressStore.getAll()
      progressRequest.onsuccess = () => {
        const allProgress = progressRequest.result as OfflineProgress[]
        const syncedProgress = allProgress.filter((p) => p.synced)

        syncedProgress.forEach((progress) => {
          if (progress.id) {
            progressStore.delete(progress.id)
          }
        })
      }

      const scoresTransaction = this.db.transaction(["scores"], "readwrite")
      const scoresStore = scoresTransaction.objectStore("scores")

      const scoresRequest = scoresStore.getAll()
      scoresRequest.onsuccess = () => {
        const allScores = scoresRequest.result as OfflineScore[]
        const syncedScores = allScores.filter((s) => s.synced)

        syncedScores.forEach((score) => {
          if (score.id) {
            scoresStore.delete(score.id)
          }
        })
      }
    } catch (error) {
      console.error("Failed to clear synced data:", error)
    }
  }

  isOnline(): boolean {
    return navigator.onLine
  }

  onConnectionChange(callback: (online: boolean) => void): void {
    const handleOnline = () => {
      callback(true)
      this.syncWhenOnline()
    }

    const handleOffline = () => {
      callback(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Return cleanup function
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }
}

export const offlineManager = new OfflineManager()
