<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'

const router = useRouter()
const moduleStore = useModuleStore()

const orderNumber = ref('')
const showConfetti = ref(false)

onMounted(() => {
  // 주문번호 생성
  orderNumber.value = `A${Math.floor(Math.random() * 900 + 100)}-${Date.now().toString().slice(-4)}`
  
  // 애니메이션 효과
  setTimeout(() => {
    showConfetti.value = true
  }, 300)
})

const goToHome = () => {
  router.push('/')
}

const startNewOrder = () => {
  // 새 주문 시작
  const firstRoute = moduleStore.serviceFlow[0]
  if (firstRoute) {
    router.push(`/service/${firstRoute}`)
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="complete-view">
    <!-- 성공 아이콘 -->
    <div class="success-section" :class="{ 'animate': showConfetti }">
      <div class="check-circle">
        <q-icon name="check" size="60px" color="white" />
      </div>
      <h1>주문 완료!</h1>
      <p class="sub-text">주문이 성공적으로 접수되었습니다</p>
    </div>

    <!-- 주문 정보 -->
    <div class="order-info-card">
      <div class="order-number">
        <span class="label">주문번호</span>
        <span class="number">{{ orderNumber }}</span>
      </div>
      
      <div class="divider"></div>
      
      <div class="info-row">
        <span class="label">예상 대기시간</span>
        <span class="value">약 15분</span>
      </div>
      
      <div class="info-row">
        <span class="label">테이블</span>
        <span class="value">A-12</span>
      </div>
    </div>

    <!-- 알림 안내 -->
    <div class="notification-card">
      <q-icon name="notifications_active" size="24px" color="primary" />
      <div class="notification-text">
        <strong>알림으로 안내해드릴게요</strong>
        <p>음식이 준비되면 알림을 보내드립니다</p>
      </div>
    </div>

    <!-- 추가 안내 -->
    <div class="additional-info">
      <div class="info-item">
        <q-icon name="receipt_long" color="grey" />
        <span>영수증은 결제 완료 후 문자로 발송됩니다</span>
      </div>
      <div class="info-item">
        <q-icon name="support_agent" color="grey" />
        <span>문의사항은 직원에게 말씀해주세요</span>
      </div>
    </div>

    <!-- 모듈 플로우 요약 -->
    <div class="flow-summary">
      <h3>진행된 서비스 플로우</h3>
      <div class="flow-steps">
        <template v-for="(module, index) in moduleStore.enabledModules" :key="module.id">
          <div class="flow-step completed">
            <q-icon :name="module.id === 'dynamicQr' ? 'qr_code_2' : 
                         module.id === 'waiting' ? 'schedule' :
                         module.id === 'menu' ? 'restaurant_menu' :
                         module.id === 'menuDetail' ? 'article' :
                         'payment'" 
            />
            <span>{{ module.name }}</span>
          </div>
          <div v-if="index < moduleStore.enabledModules.length - 1" class="flow-arrow">→</div>
        </template>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <q-btn 
        outline 
        color="primary" 
        class="action-btn"
        @click="startNewOrder"
      >
        새 주문하기
      </q-btn>
      <q-btn 
        color="primary" 
        class="action-btn"
        @click="goToHome"
      >
        빌더로 돌아가기
      </q-btn>
    </div>

    <!-- 컨페티 효과 -->
    <div v-if="showConfetti" class="confetti-container">
      <div v-for="i in 50" :key="i" class="confetti" :style="{
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        backgroundColor: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 5)]
      }"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.complete-view {
  min-height: 100vh;
  background: linear-gradient(180deg, #4caf50 0%, #2e7d32 50%, #f8f9fa 50%);
  padding: 40px 16px;
  position: relative;
  overflow: hidden;
}

.success-section {
  text-align: center;
  padding: 40px 0;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.5s ease-out;

  &.animate {
    transform: scale(1);
    opacity: 1;
  }

  .check-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    animation: pulse 2s infinite;
  }

  h1 {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  .sub-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 15px;
    margin: 0;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.order-info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .order-number {
    text-align: center;
    
    .label {
      display: block;
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }

    .number {
      font-size: 28px;
      font-weight: 700;
      color: #1976d2;
      letter-spacing: 2px;
    }
  }

  .divider {
    height: 1px;
    background: #eee;
    margin: 20px 0;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;

    .label {
      color: #666;
      font-size: 14px;
    }

    .value {
      font-weight: 600;
      font-size: 14px;
    }
  }
}

.notification-card {
  display: flex;
  gap: 12px;
  background: #e3f2fd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;

  .notification-text {
    strong {
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }

    p {
      font-size: 13px;
      color: #666;
      margin: 0;
    }
  }
}

.additional-info {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 13px;
  color: #666;
}

.flow-summary {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 100px;

  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 12px;
    color: #666;
  }
}

.flow-steps {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #e8f5e9;
  border-radius: 20px;
  font-size: 12px;
  color: #2e7d32;

  &.completed {
    background: #e8f5e9;
  }
}

.flow-arrow {
  color: #ccc;
  font-size: 12px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

  .action-btn {
    flex: 1;
    height: 48px;
  }
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: fall 3s linear forwards;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
