<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const moduleStore = useModuleStore()
const cartStore = useCartStore()

const selectedMethod = ref<string | null>(null)
const isProcessing = ref(false)

// 메뉴 없이 바로 결제하는 경우 (놀이공원 입장료 등)
const isDirectPayment = computed(() => cartStore.items.length === 0)
const directPaymentItem = {
  name: '아치서울 테마파크 입장권',
  description: '1일 자유이용권 (성인)',
  price: 52000
}

// 결제 수단 목록
const paymentMethods = ref([
  {
    id: 'kakao',
    name: '카카오페이',
    icon: '💛',
    discount: 5,
    type: 'easy'
  },
  {
    id: 'naver',
    name: '네이버페이',
    icon: '💚',
    discount: 3,
    type: 'easy'
  },
  {
    id: 'toss',
    name: '토스페이',
    icon: '💙',
    discount: 4,
    type: 'easy'
  },
  {
    id: 'samsung',
    name: '삼성페이',
    icon: '🔵',
    discount: 2,
    type: 'easy'
  },
  {
    id: 'card',
    name: '신용/체크카드',
    icon: '💳',
    discount: 0,
    type: 'card'
  }
])

const formatPrice = (price: number) => {
  return price.toLocaleString() + '원'
}

// 총 결제 금액 (카트 또는 직접 결제)
const totalAmount = computed(() => {
  return isDirectPayment.value ? directPaymentItem.price : cartStore.totalPrice
})

const getDiscountAmount = (method: typeof paymentMethods.value[0]) => {
  return Math.floor(totalAmount.value * method.discount / 100)
}

const getFinalPrice = (method: typeof paymentMethods.value[0]) => {
  return totalAmount.value - getDiscountAmount(method)
}

const selectedPayment = computed(() => {
  return paymentMethods.value.find(m => m.id === selectedMethod.value)
})

const finalAmount = computed(() => {
  if (!selectedPayment.value) return totalAmount.value
  return getFinalPrice(selectedPayment.value)
})

const processPayment = () => {
  if (!selectedMethod.value) return
  
  isProcessing.value = true
  
  // 결제 처리 시뮬레이션
  setTimeout(() => {
    isProcessing.value = false
    cartStore.clearCart()
    router.push('/service/complete')
  }, 2000)
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="payment-view">
    <!-- 헤더 -->
    <div class="payment-header">
      <q-btn flat round icon="arrow_back" @click="goBack" />
      <h1>결제하기</h1>
      <div style="width: 48px"></div>
    </div>

    <div class="payment-content">
      <!-- 주문 정보 -->
      <div class="order-info">
        <h3>{{ isDirectPayment ? '결제 정보' : '주문 정보' }}</h3>
        
        <!-- 직접 결제 (메뉴 없음) -->
        <div v-if="isDirectPayment" class="order-list">
          <div class="order-item">
            <div class="direct-payment-info">
              <span class="name">{{ directPaymentItem.name }}</span>
              <span class="description">{{ directPaymentItem.description }}</span>
            </div>
            <span class="price">{{ formatPrice(directPaymentItem.price) }}</span>
          </div>
        </div>
        
        <!-- 장바구니 주문 -->
        <div v-else class="order-list">
          <div v-for="item in cartStore.items" :key="item.menuId" class="order-item">
            <span class="name">{{ item.name }} x {{ item.quantity }}</span>
            <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
        
        <div class="order-total">
          <span>{{ isDirectPayment ? '결제금액' : '총 주문금액' }}</span>
          <span>{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>

      <!-- 혜택 비교 (결제 모듈 옵션) -->
      <div v-if="moduleStore.isOptionEnabled('payment', 'benefitCompare')" class="benefit-compare">
        <h3>
          <q-icon name="savings" color="orange" />
          결제 수단별 혜택 비교
        </h3>
        <p class="compare-desc">가장 많은 혜택을 받을 수 있는 결제 수단을 추천해드립니다</p>
        
        <div class="benefit-list">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="benefit-item"
            :class="{ best: method.discount === 5 }"
          >
            <span class="method-icon">{{ method.icon }}</span>
            <span class="method-name">{{ method.name }}</span>
            <span class="discount" v-if="method.discount > 0">
              {{ method.discount }}% 할인
            </span>
            <span class="discount-amount" v-if="method.discount > 0">
              -{{ formatPrice(getDiscountAmount(method)) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 결제 수단 선택 -->
      <div class="payment-methods">
        <h3>결제 수단 선택</h3>
        
        <!-- 간편결제 -->
        <div class="method-section">
          <div class="section-label">간편결제</div>
          <div class="method-grid">
            <div 
              v-for="method in paymentMethods.filter(m => m.type === 'easy')"
              :key="method.id"
              class="method-card"
              :class="{ selected: selectedMethod === method.id }"
              @click="selectedMethod = method.id"
            >
              <span class="icon">{{ method.icon }}</span>
              <span class="name">{{ method.name }}</span>
              <q-badge v-if="method.discount > 0" color="red">
                {{ method.discount }}%
              </q-badge>
            </div>
          </div>
        </div>

        <!-- 일반결제 -->
        <div class="method-section">
          <div class="section-label">일반결제</div>
          <div 
            class="method-card full"
            :class="{ selected: selectedMethod === 'card' }"
            @click="selectedMethod = 'card'"
          >
            <span class="icon">💳</span>
            <span class="name">신용/체크카드</span>
          </div>
        </div>

        <!-- 앱리스 결제 옵션 -->
        <div v-if="moduleStore.isOptionEnabled('payment', 'appless')" class="appless-option">
          <q-icon name="phonelink_off" color="blue" />
          <div class="appless-text">
            <strong>앱 없이 결제</strong>
            <p>결제앱이 없어도 카메라로 간편하게 결제할 수 있습니다</p>
          </div>
        </div>
      </div>

      <!-- 후불/선불 옵션 -->
      <div v-if="moduleStore.isOptionEnabled('payment', 'paymentTiming')" class="timing-option">
        <h3>결제 시점</h3>
        <q-option-group
          inline
          :options="[
            { label: '선결제', value: 'prepay' },
            { label: '후결제 (식사 후)', value: 'postpay' }
          ]"
          type="radio"
          v-model="selectedMethod"
        />
      </div>
    </div>

    <!-- 하단 결제 버튼 -->
    <div class="bottom-actions">
      <div class="final-amount">
        <span>최종 결제금액</span>
        <span class="amount">{{ formatPrice(finalAmount) }}</span>
      </div>
      <q-btn 
        color="primary" 
        class="pay-btn"
        :disable="!selectedMethod"
        :loading="isProcessing"
        @click="processPayment"
      >
        {{ selectedPayment ? selectedPayment.name + '로 ' : '' }}{{ formatPrice(finalAmount) }} 결제
      </q-btn>
    </div>

    <!-- 모듈 정보 -->
    <div class="module-indicator">
      <q-chip color="orange" text-color="white" icon="payment" size="sm">
        결제창 모듈
      </q-chip>
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

.payment-view {
  min-height: 100vh;
  background: $gray-light;
  padding-bottom: 140px;
}

.payment-header {
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 4px;
  background: $white;
  border-bottom: 1px solid $border;
  position: sticky;
  top: 0;
  z-index: 100;

  h1 {
    flex: 1;
    font-size: 18px;
    font-weight: 600;
    color: $black;
    margin: 0;
    text-align: center;
  }
}

.payment-content {
  padding: 16px;
}

.order-info,
.benefit-compare,
.payment-methods,
.timing-option {
  background: $white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid $border;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $black;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.order-list {
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: $gray;
  border-bottom: 1px solid $gray-light;

  &:last-child {
    border-bottom: none;
  }

  .direct-payment-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .name {
      font-size: 15px;
      font-weight: 600;
      color: $black;
    }

    .description {
      font-size: 12px;
      color: $gray;
    }
  }
}

.order-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid $border;
  font-weight: 600;
  color: $black;
}

.compare-desc {
  font-size: 13px;
  color: $gray;
  margin: 0 0 16px;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: $gray-light;
  border-radius: 8px;
  font-size: 14px;

  &.best {
    background: $orange-light;
    border: 1px solid $orange;
  }

  .method-icon {
    font-size: 20px;
  }

  .method-name {
    flex: 1;
    color: $black;
  }

  .discount {
    color: $orange;
    font-weight: 600;
  }

  .discount-amount {
    color: $orange;
    font-weight: 600;
  }
}

.method-section {
  margin-bottom: 16px;

  .section-label {
    font-size: 13px;
    color: $gray;
    margin-bottom: 8px;
  }
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.method-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: $gray-light;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border: 2px solid transparent;

  &.full {
    flex-direction: row;
    justify-content: center;
    gap: 12px;
  }

  &.selected {
    background: $orange-light;
    border-color: $orange;
  }

  .icon {
    font-size: 28px;
  }

  .name {
    font-size: 13px;
    font-weight: 500;
    color: $black;
  }

  .q-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: $orange !important;
  }
}

.appless-option {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: $orange-light;
  border-radius: 12px;
  margin-top: 16px;

  .appless-text {
    strong {
      font-size: 14px;
      color: $black;
      display: block;
      margin-bottom: 4px;
    }

    p {
      font-size: 13px;
      color: $gray;
      margin: 0;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  background: $white;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid $border;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  .final-amount {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: $gray;

    .amount {
      font-size: 18px;
      font-weight: 700;
      color: $black;
    }
  }

  .pay-btn {
    width: 100%;
    height: 54px;
    font-size: 16px;
    font-weight: 600;
    background: $orange !important;
    border-radius: 12px;
  }
}

.module-indicator {
  position: fixed;
  top: 56px;
  left: 50%;
  transform: translateX(calc(215px - 50%));
  max-width: 430px;
  z-index: 200;
  
  .q-chip {
    background: rgba($primary, 0.95) !important;
    color: $white;
  }
}
</style>
