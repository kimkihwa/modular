<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const moduleStore = useModuleStore()
const cartStore = useCartStore()

const formatPrice = (price: number) => {
  return price.toLocaleString() + '원'
}

const incrementQuantity = (index: number) => {
  const item = cartStore.items[index]
  if (item) {
    cartStore.updateQuantity(index, item.quantity + 1)
  }
}

const decrementQuantity = (index: number) => {
  const item = cartStore.items[index]
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(index, item.quantity - 1)
  } else if (item) {
    cartStore.removeFromCart(index)
  }
}

const removeItem = (index: number) => {
  cartStore.removeFromCart(index)
}

const goToPayment = () => {
  router.push('/service/payment')
}

const goBack = () => {
  router.back()
}

const clearCart = () => {
  cartStore.clearCart()
}
</script>

<template>
  <div class="cart-view">
    <!-- 헤더 -->
    <div class="cart-header">
      <q-btn flat round icon="arrow_back" @click="goBack" />
      <h1>장바구니</h1>
      <q-btn 
        flat 
        dense 
        label="전체삭제" 
        color="red"
        @click="clearCart"
        v-if="cartStore.totalItems > 0"
      />
    </div>

    <!-- 빈 장바구니 -->
    <div v-if="cartStore.totalItems === 0" class="empty-cart">
      <q-icon name="shopping_cart" size="80px" color="grey-4" />
      <p>장바구니가 비어있습니다</p>
      <q-btn outline color="primary" label="메뉴 보러가기" @click="goBack" />
    </div>

    <!-- 장바구니 목록 -->
    <div v-else class="cart-content">
      <div class="cart-list">
        <div v-for="(item, index) in cartStore.items" :key="item.menuId" class="cart-item">
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <span class="price">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
          
          <div class="item-actions">
            <div class="quantity-control">
              <q-btn 
                flat 
                round 
                dense
                icon="remove" 
                size="sm"
                @click="decrementQuantity(index)" 
              />
              <span class="quantity">{{ item.quantity }}</span>
              <q-btn 
                flat 
                round 
                dense
                icon="add" 
                size="sm"
                @click="incrementQuantity(index)" 
              />
            </div>
            <q-btn 
              flat 
              round 
              dense
              icon="close" 
              color="grey"
              @click="removeItem(index)" 
            />
          </div>
        </div>
      </div>

      <!-- 주문 요약 -->
      <div class="order-summary">
        <h3>주문 내역</h3>
        
        <div class="summary-row">
          <span>주문 금액</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        
        <div class="summary-row">
          <span>배달비</span>
          <span>0원</span>
        </div>
        
        <div class="summary-row discount" v-if="moduleStore.isModuleEnabled('payment')">
          <span>예상 할인</span>
          <span class="discount-amount">-{{ formatPrice(Math.floor(cartStore.totalPrice * 0.05)) }}</span>
        </div>
        
        <div class="summary-row total">
          <span>총 결제금액</span>
          <span>{{ formatPrice(cartStore.totalPrice - Math.floor(cartStore.totalPrice * 0.05)) }}</span>
        </div>
      </div>

      <!-- 혜택 미리보기 -->
      <div v-if="moduleStore.isModuleEnabled('payment')" class="benefit-preview">
        <q-icon name="savings" color="orange" />
        <div class="benefit-text">
          <strong>최대 혜택 비교</strong>
          <p>결제 수단별 혜택을 비교하고 최적의 결제방법을 선택하세요</p>
        </div>
      </div>
    </div>

    <!-- 하단 결제 버튼 -->
    <div v-if="cartStore.totalItems > 0" class="bottom-actions">
      <div class="total-info">
        <span>총 {{ cartStore.totalItems }}개</span>
        <span class="total-price">{{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
      <q-btn 
        color="primary" 
        class="pay-btn"
        @click="goToPayment"
      >
        {{ formatPrice(cartStore.totalPrice) }} 결제하기
      </q-btn>
    </div>

    <!-- 모듈 정보 -->
    <div class="module-indicator">
      <q-chip color="green" text-color="white" icon="shopping_cart" size="sm">
        장바구니 (메뉴판 하위)
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

.cart-view {
  min-height: 100vh;
  background: $gray-light;
  padding-bottom: 140px;
}

.cart-header {
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
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  gap: 16px;

  p {
    font-size: 16px;
    color: $gray;
    margin: 0;
  }
}

.cart-content {
  padding: 16px;
}

.cart-list {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid $border;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }
}

.item-info {
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: $black;
    margin: 0 0 4px;
  }

  .price {
    font-size: 14px;
    color: $black;
    font-weight: 700;
  }
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: $gray-light;
  border-radius: 6px;
  padding: 2px;

  .quantity {
    width: 28px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: $black;
  }
}

.order-summary {
  background: $white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid $border;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $black;
    margin: 0 0 16px;
  }
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: $gray;

  &.discount {
    color: $orange;
    
    .discount-amount {
      font-weight: 600;
    }
  }

  &.total {
    padding-top: 12px;
    margin-top: 8px;
    border-top: 1px solid $border;
    font-size: 16px;
    font-weight: 700;
    color: $black;
  }
}

.benefit-preview {
  display: flex;
  gap: 12px;
  background: $orange-light;
  border-radius: 12px;
  padding: 16px;

  .benefit-text {
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
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  border-top: 1px solid $border;

  .total-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: $gray;

    .total-price {
      font-weight: 700;
      color: $black;
    }
  }

  .pay-btn {
    width: 100%;
    height: 54px;
    font-size: 16px;
    font-weight: 600;
    background: $primary;
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
    background: rgba($primary, 0.95);
    color: $white;
  }
}
</style>
