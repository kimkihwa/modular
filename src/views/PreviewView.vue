<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useCartStore } from '@/stores/cartStore'
import { useWaitingStore } from '@/stores/waitingStore'
import { useSessionStore } from '@/stores/sessionStore'

const router = useRouter()
const moduleStore = useModuleStore()
const cartStore = useCartStore()
const waitingStore = useWaitingStore()
const sessionStore = useSessionStore()

const startService = () => {
  // 상태 초기화
  cartStore.clearCart()
  waitingStore.reset()
  sessionStore.expireSession()
  
  // 첫 번째 활성 모듈로 이동
  const firstRoute = moduleStore.serviceFlow[0]
  if (firstRoute) {
    router.push(`/service/${firstRoute}`)
  }
}

const goToBuilder = () => {
  router.push('/builder')
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="preview-view">
    <!-- 헤더 -->
    <div class="preview-header">
      <q-btn flat icon="arrow_back" @click="goBack" />
      <h1>서비스 미리보기</h1>
      <q-btn flat icon="settings" @click="goToBuilder" />
    </div>

    <!-- 구성된 서비스 요약 -->
    <div class="config-summary">
      <h2>현재 구성</h2>
      
      <div class="active-modules">
        <div 
          v-for="module in moduleStore.activeModules" 
          :key="module.id"
          class="module-badge"
          :style="{ borderColor: module.color }"
        >
          <q-icon :name="module.icon" :style="{ color: module.color }" size="20px" />
          <span>{{ module.name }}</span>
        </div>
      </div>

      <div class="flow-preview">
        <div class="flow-title">서비스 플로우</div>
        <div class="flow-steps">
          <template v-for="(route, index) in moduleStore.serviceFlow" :key="route">
            <div class="flow-step">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-name">{{ route }}</div>
            </div>
            <div v-if="index < moduleStore.serviceFlow.length - 1" class="flow-arrow">
              <q-icon name="arrow_downward" color="grey" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 활성화된 옵션 요약 -->
    <div class="options-summary">
      <h2>활성화된 주요 옵션</h2>
      <div v-for="module in moduleStore.activeModules" :key="module.id" class="module-options">
        <div class="module-title">
          <q-icon :name="module.icon" :style="{ color: module.color }" size="16px" />
          {{ module.name }}
        </div>
        <div class="enabled-options">
          <q-chip 
            v-for="option in module.options.filter(o => o.enabled)" 
            :key="option.id"
            size="sm"
            color="grey-3"
          >
            {{ option.label }}
          </q-chip>
          <span v-if="module.options.filter(o => o.enabled).length === 0" class="no-options">
            기본 설정
          </span>
        </div>
      </div>
    </div>

    <!-- 시작 버튼 -->
    <div class="start-button-container">
      <q-btn 
        color="primary" 
        size="lg" 
        class="start-btn"
        @click="startService"
      >
        <q-icon name="play_arrow" class="q-mr-sm" />
        서비스 시작하기
      </q-btn>
      <p class="hint">QR 스캔을 시뮬레이션합니다</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  h1 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.config-summary {
  background: white;
  margin: 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
  }
}

.active-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.module-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid;
  border-radius: 20px;
  background: white;

  span {
    font-size: 13px;
    font-weight: 500;
  }
}

.flow-preview {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 16px;

  .flow-title {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
  }
}

.flow-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 200px;

  .step-number {
    width: 24px;
    height: 24px;
    background: #1976d2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }

  .step-name {
    font-size: 14px;
    font-weight: 500;
  }
}

.flow-arrow {
  padding: 4px 0;
}

.options-summary {
  background: white;
  margin: 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
  }
}

.module-options {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .module-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .enabled-options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-left: 22px;

    .no-options {
      font-size: 12px;
      color: #999;
    }
  }
}

.start-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;

  .start-btn {
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
  }

  .hint {
    font-size: 12px;
    color: #999;
    margin: 8px 0 0;
  }
}
</style>
