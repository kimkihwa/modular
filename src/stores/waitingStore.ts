import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WaitingInfo } from '@/types'

export const useWaitingStore = defineStore('waitingStore', () => {
  const waitingInfo = ref<WaitingInfo | null>(null)
  const isRegistered = ref(false)

  const register = (info: WaitingInfo) => {
    waitingInfo.value = {
      ...info,
      waitingNumber: Math.floor(Math.random() * 50) + 1,
      estimatedTime: Math.floor(Math.random() * 30) + 10
    }
    isRegistered.value = true
  }

  const cancel = () => {
    waitingInfo.value = null
    isRegistered.value = false
  }

  const reset = () => {
    waitingInfo.value = null
    isRegistered.value = false
  }

  return {
    waitingInfo,
    isRegistered,
    register,
    cancel,
    reset
  }
}, {
  persist: true
})
