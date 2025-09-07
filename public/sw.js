const CACHE_NAME = "mathquiz-v2.0"
const STATIC_CACHE = "mathquiz-static-v2.0"
const DYNAMIC_CACHE = "mathquiz-dynamic-v2.0"
const API_CACHE = "mathquiz-api-v2.0"

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/game/quick-battle",
  "/multiplayer",
  "/profile",
  "/teacher",
  "/_next/static/css/app/layout.css",
  "/_next/static/css/app/globals.css",
]

// API endpoints to cache
const API_ENDPOINTS = ["/api/auth", "/api/questions", "/api/progress", "/api/leaderboard"]

// Install event - Cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches
        .open(STATIC_CACHE)
        .then((cache) => {
          console.log("[SW] Caching static assets")
          return cache.addAll(STATIC_ASSETS)
        }),
      // Initialize IndexedDB for offline data
      initializeOfflineDB(),
    ]),
  )

  // Force activation of new service worker
  self.skipWaiting()
})

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")

  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
                console.log("[SW] Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      // Claim all clients
      self.clients.claim(),
    ]),
  )
})

// Fetch event - Advanced caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request))
  } else {
    event.respondWith(handleDynamicRequest(request))
  }
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "sync-progress") {
    event.waitUntil(syncOfflineProgress())
  } else if (event.tag === "sync-scores") {
    event.waitUntil(syncOfflineScores())
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")

  const options = {
    body: event.data ? event.data.text() : "¡Nueva misión disponible en MathQuiz Battle Mode!",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Abrir App",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Cerrar",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("MathQuiz Battle Mode", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked")

  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"))
  }
})

// Helper functions
function isStaticAsset(request) {
  return (
    request.url.includes("/_next/static/") ||
    request.url.includes("/static/") ||
    request.url.endsWith(".css") ||
    request.url.endsWith(".js") ||
    request.url.endsWith(".png") ||
    request.url.endsWith(".jpg") ||
    request.url.endsWith(".svg")
  )
}

function isAPIRequest(request) {
  return request.url.includes("/api/") || API_ENDPOINTS.some((endpoint) => request.url.includes(endpoint))
}

function isNavigationRequest(request) {
  return request.destination === "document"
}

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Static asset fetch failed:", error)
    return new Response("Asset not available offline", { status: 503 })
  }
}

// Network-first strategy for API requests with offline fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE)
      cache.put(request, networkResponse.clone())

      // Store in IndexedDB for offline access
      if (request.url.includes("/questions") || request.url.includes("/progress")) {
        storeInOfflineDB(request.url, await networkResponse.clone().json())
      }
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] API request failed, trying cache:", error)

    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try IndexedDB for structured data
    if (request.url.includes("/questions")) {
      const offlineData = await getFromOfflineDB("questions")
      if (offlineData) {
        return new Response(JSON.stringify(offlineData), {
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    // Return offline response
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "No hay conexión. Usando datos guardados.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Network-first strategy for navigation with offline fallback
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log("[SW] Navigation request failed:", error)

    // Try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page
    return caches.match("/offline.html")
  }
}

// Stale-while-revalidate for dynamic content
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

// IndexedDB functions for offline data storage
async function initializeOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MathQuizOfflineDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Questions store
      if (!db.objectStoreNames.contains("questions")) {
        db.createObjectStore("questions", { keyPath: "id" })
      }

      // Progress store
      if (!db.objectStoreNames.contains("progress")) {
        const progressStore = db.createObjectStore("progress", { keyPath: "id", autoIncrement: true })
        progressStore.createIndex("userId", "userId", { unique: false })
        progressStore.createIndex("timestamp", "timestamp", { unique: false })
      }

      // Scores store
      if (!db.objectStoreNames.contains("scores")) {
        const scoresStore = db.createObjectStore("scores", { keyPath: "id", autoIncrement: true })
        scoresStore.createIndex("userId", "userId", { unique: false })
        scoresStore.createIndex("gameMode", "gameMode", { unique: false })
      }

      // Settings store
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" })
      }
    }
  })
}

async function storeInOfflineDB(key, data) {
  try {
    const db = await initializeOfflineDB()
    const transaction = db.transaction(["questions"], "readwrite")
    const store = transaction.objectStore("questions")

    await store.put({ id: key, data: data, timestamp: Date.now() })
    console.log("[SW] Data stored in IndexedDB:", key)
  } catch (error) {
    console.error("[SW] Failed to store in IndexedDB:", error)
  }
}

async function getFromOfflineDB(key) {
  try {
    const db = await initializeOfflineDB()
    const transaction = db.transaction(["questions"], "readonly")
    const store = transaction.objectStore("questions")

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result?.data)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[SW] Failed to get from IndexedDB:", error)
    return null
  }
}

// Sync offline progress when connection is restored
async function syncOfflineProgress() {
  try {
    const db = await initializeOfflineDB()
    const transaction = db.transaction(["progress"], "readonly")
    const store = transaction.objectStore("progress")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = async () => {
        const offlineProgress = request.result

        for (const progress of offlineProgress) {
          try {
            await fetch("/api/sync/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(progress),
            })

            // Remove synced data
            const deleteTransaction = db.transaction(["progress"], "readwrite")
            const deleteStore = deleteTransaction.objectStore("progress")
            deleteStore.delete(progress.id)
          } catch (error) {
            console.error("[SW] Failed to sync progress:", error)
          }
        }
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[SW] Sync progress failed:", error)
  }
}

// Sync offline scores when connection is restored
async function syncOfflineScores() {
  try {
    const db = await initializeOfflineDB()
    const transaction = db.transaction(["scores"], "readonly")
    const store = transaction.objectStore("scores")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = async () => {
        const offlineScores = request.result

        for (const score of offlineScores) {
          try {
            await fetch("/api/sync/scores", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(score),
            })

            // Remove synced data
            const deleteTransaction = db.transaction(["scores"], "readwrite")
            const deleteStore = deleteTransaction.objectStore("scores")
            deleteStore.delete(score.id)
          } catch (error) {
            console.error("[SW] Failed to sync score:", error)
          }
        }
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[SW] Sync scores failed:", error)
  }
}

console.log("[SW] Service Worker loaded successfully")
