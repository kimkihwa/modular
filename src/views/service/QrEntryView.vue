<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const moduleStore = useModuleStore()
const sessionStore = useSessionStore()

const scanning = ref(true)
const sessionCreated = ref(false)

onMounted(() => {
  // QR 스캔 시뮬레이션
  setTimeout(() => {
    scanning.value = false
    
    // 세션 생성
    if (moduleStore.isOptionEnabled('dynamicQr', 'sessionCreate')) {
      sessionStore.createSession(30)
      sessionCreated.value = true
    }

    // 다음 단계로 이동
    setTimeout(() => {
      const nextRoute = moduleStore.getNextRoute('qr-entry')
      if (nextRoute) {
        router.push(`/service/${nextRoute}`)
      }
    }, 1500)
  }, 2000)
})
</script>

<template>
  <div class="qr-entry-view">
    <div class="qr-container">
      <!-- 스캐닝 애니메이션 -->
      <div v-if="scanning" class="scanning-animation">
        <div class="qr-frame">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scan-line"></div>
        </div>
        <p class="scanning-text">QR 코드 스캔 중...</p>
      </div>

      <!-- 스캔 완료 -->
      <div v-else class="scan-complete">
        <div class="success-icon">
          <q-icon name="check_circle" size="80px" color="green" />
        </div>
        <h2>QR 스캔 완료!</h2>
        
        <div v-if="sessionCreated" class="session-info">
          <q-icon name="fingerprint" size="20px" color="primary" />
          <span>세션 생성됨: {{ sessionStore.sessionId?.substring(0, 20) }}...</span>
        </div>

        <p class="redirect-text">서비스로 이동 중...</p>
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </div>

    <!-- 모듈 정보 표시 -->
    <div class="module-info">
      <q-chip color="green" text-color="white" icon="qr_code_2">
        동적 QR 모듈
      </q-chip>
      <div class="enabled-features">
        <span v-if="moduleStore.isOptionEnabled('dynamicQr', 'dynamicRefresh')">
          ✓ 동적 갱신
        </span>
        <span v-if="moduleStore.isOptionEnabled('dynamicQr', 'sessionCreate')">
          ✓ 세션 생성
        </span>
        <span v-if="moduleStore.isOptionEnabled('dynamicQr', 'autoExpire')">
          ✓ 자동 만료
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 핸드오더 색상 변수
$black: #1C1917;
$primary: #44403C;
$gray: #878787;
$gray-light: #F5F5F4;
$border: #E7E5E4;
$white: #FFF;
$orange: #F3610B;
$orange-light: #FFEDE3;

.qr-entry-view {
  min-height: 100vh;
  background: linear-gradient(135deg, $black 0%, #2a2520 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qr-container {
  background: $white;
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.scanning-animation {
  .qr-frame {
    width: 200px;
    height: 200px;
    position: relative;
    margin: 0 auto 24px;
    background: $gray-light;
    border-radius: 12px;

    .corner {
      position: absolute;
      width: 30px;
      height: 30px;
      border: 4px solid $primary;

      &.top-left {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
        border-radius: 8px 0 0 0;
      }

      &.top-right {
        top: 0;
        right: 0;
        border-left: none;
        border-bottom: none;
        border-radius: 0 8px 0 0;
      }

      &.bottom-left {
        bottom: 0;
        left: 0;
        border-right: none;
        border-top: none;
        border-radius: 0 0 0 8px;
      }

      &.bottom-right {
        bottom: 0;
        right: 0;
        border-left: none;
        border-top: none;
        border-radius: 0 0 8px 0;
      }
    }

    .scan-line {
      position: absolute;
      left: 10px;
      right: 10px;
      height: 3px;
      background: linear-gradient(90deg, transparent, $orange, transparent);
      animation: scan 2s ease-in-out infinite;
    }
  }

  .scanning-text {
    font-size: 16px;
    color: $gray;
  }
}

@keyframes scan {
  0%, 100% {
    top: 10px;
  }
  50% {
    top: calc(100% - 13px);
  }
}

.scan-complete {
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 16px 0;
    color: $black;
  }

  .session-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: $orange-light;
    padding: 8px 16px;
    border-radius: 8px;
    margin-bottom: 20px;

    span {
      font-size: 12px;
      color: $orange;
      font-family: monospace;
    }
  }

  .redirect-text {
    font-size: 14px;
    color: $gray;
    margin-bottom: 16px;
  }
}

.module-info {
  margin-top: 24px;
  text-align: center;

  .enabled-features {
    display: flex;
    gap: 12px;
    margin-top: 12px;

    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
