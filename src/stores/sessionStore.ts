import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSessionStore = defineStore('sessionStore', () => {
  const sessionId = ref<string | null>(null)
  const createdAt = ref<number | null>(null)
  const expiresAt = ref<number | null>(null)

  const isValid = computed(() => {
    if (!sessionId.value || !expiresAt.value) return false
    return Date.now() < expiresAt.value
  })

  const createSession = (durationMinutes: number = 30) => {
    sessionId.value = `SES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    createdAt.value = Date.now()
    expiresAt.value = Date.now() + (durationMinutes * 60 * 1000)
    return sessionId.value
  }

  const expireSession = () => {
    sessionId.value = null
    createdAt.value = null
    expiresAt.value = null
  }

  const getRemainingTime = () => {
    if (!expiresAt.value) return 0
    const remaining = expiresAt.value - Date.now()
    return Math.max(0, Math.floor(remaining / 1000))
  }

  return {
    sessionId,
    createdAt,
    expiresAt,
    isValid,
    createSession,
    expireSession,
    getRemainingTime
  }
}, {
  persist: true
})
