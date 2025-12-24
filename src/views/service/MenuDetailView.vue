<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useCartStore } from '@/stores/cartStore'
import { menuData } from '@/data/menuData'
import type { MenuItem } from '@/types'

const router = useRouter()
const route = useRoute()
const moduleStore = useModuleStore()
const cartStore = useCartStore()

const menuItem = ref<MenuItem | null>(null)
const quantity = ref(1)

onMounted(() => {
  const id = route.query.id as string
  if (id) {
    menuItem.value = menuData.find(item => item.id === id) || null
  } else {
    // ID가 없으면 (메뉴 리스트 없이 직접 진입한 경우) 첫 번째 메뉴 표시
    menuItem.value = menuData[0] || null
  }
})

const formatPrice = (price: number) => {
  return price.toLocaleString() + '원'
}

const totalPrice = computed(() => {
  if (!menuItem.value) return 0
  return menuItem.value.price * quantity.value
})

const incrementQuantity = () => quantity.value++
const decrementQuantity = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  if (!menuItem.value) return
  
  cartStore.addItem({
    menuId: menuItem.value.id,
    name: menuItem.value.name,
    price: menuItem.value.price,
    quantity: quantity.value
  })
  
  // 메뉴 리스트가 없으면 바로 장바구니로, 있으면 뒤로
  const hasMenuList = moduleStore.activeModules.some(m => m.id === 'menu')
  if (!hasMenuList) {
    // 메뉴 리스트 없이 디테일만 있는 경우 바로 장바구니로
    router.push('/service/cart')
  } else if (moduleStore.isOptionEnabled('menuDetail', 'directOrder')) {
    router.push('/service/cart')
  } else {
    router.back()
  }
}

const shareItem = () => {
  if (!menuItem.value || !navigator.share) return
  
  navigator.share({
    title: menuItem.value.name,
    text: menuItem.value.description,
    url: window.location.href
  })
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="menu-detail-view">
    <!-- 로딩/에러 -->
    <div v-if="!menuItem" class="loading">
      <q-spinner size="50px" color="primary" />
    </div>

    <template v-else>
      <!-- 상단 이미지 -->
      <div class="hero-image">
        <img :src="menuItem.image || '/placeholder.png'" :alt="menuItem.name" />
        
        <q-btn 
          flat 
          round 
          icon="arrow_back" 
          class="back-btn"
          @click="goBack"
        />
        
        <q-btn 
          v-if="moduleStore.isOptionEnabled('menuDetail', 'share')"
          flat 
          round 
          icon="share" 
          class="share-btn"
          @click="shareItem"
        />
      </div>

      <!-- 프로모션 배너 -->
      <div v-if="moduleStore.isOptionEnabled('menuDetail', 'promo')" class="promo-banner">
        <q-icon name="local_fire_department" />
        <span>지금 주문하면 10% 할인!</span>
      </div>

      <!-- 메뉴 정보 -->
      <div class="menu-content">
        <div class="menu-header">
          <h1>{{ menuItem.name }}</h1>
          <div class="price">{{ formatPrice(menuItem.price) }}</div>
        </div>

        <p class="description">{{ menuItem.description }}</p>

        <!-- 상세 정보 -->
        <div v-if="moduleStore.isOptionEnabled('menuDetail', 'detail')" class="details-section">
          <h3>상세 정보</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <q-icon name="schedule" />
              <span>조리시간 15분</span>
            </div>
            <div class="detail-item">
              <q-icon name="restaurant" />
              <span>1인분 기준</span>
            </div>
            <div class="detail-item">
              <q-icon name="whatshot" />
              <span>450 kcal</span>
            </div>
            <div class="detail-item">
              <q-icon name="eco" />
              <span>비건 옵션 가능</span>
            </div>
          </div>
        </div>

        <!-- 추천 메뉴 -->
        <div class="recommend-section">
          <h3>함께 주문하면 좋은 메뉴</h3>
          <div class="recommend-list">
            <div 
              v-for="item in menuData.slice(0, 3)" 
              :key="item.id"
              class="recommend-item"
            >
              <img :src="item.image || '/placeholder.png'" :alt="item.name" />
              <span class="name">{{ item.name }}</span>
              <span class="price">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 주문 영역 -->
      <div class="order-section">
        <div class="quantity-control">
          <q-btn flat round icon="remove" @click="decrementQuantity" :disable="quantity <= 1" />
          <span class="quantity">{{ quantity }}</span>
          <q-btn flat round icon="add" @click="incrementQuantity" />
        </div>
        
        <q-btn 
          color="primary" 
          class="add-btn"
          :disable="menuItem.soldOut"
          @click="addToCart"
        >
          {{ formatPrice(totalPrice) }} 담기
        </q-btn>
      </div>

      <!-- 모듈 정보 -->
      <div class="module-indicator">
        <q-chip color="purple" text-color="white" icon="article" size="sm">
          메뉴디테일 모듈
        </q-chip>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.menu-detail-view {
  min-height: 100vh;
  background: white;
  padding-bottom: 100px;
}

.loading {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  position: relative;
  width: 100%;
  height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .back-btn {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.4);
    color: white;
  }

  .share-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.4);
    color: white;
  }
}

.promo-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: white;
  font-weight: 600;
}

.menu-content {
  padding: 20px 16px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }

  .price {
    font-size: 22px;
    font-weight: 700;
    color: #1976d2;
  }
}

.description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.details-section {
  margin-bottom: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.recommend-section {
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px;
  }
}

.recommend-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.recommend-item {
  flex-shrink: 0;
  width: 100px;
  text-align: center;

  img {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    object-fit: cover;
    margin-bottom: 8px;
  }

  .name {
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 12px;
    color: #1976d2;
    font-weight: 600;
  }
}

.order-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #f5f5f5;
  border-radius: 8px;

  .quantity {
    width: 32px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
}

.add-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

.module-indicator {
  position: fixed;
  top: 60px;
  right: 16px;
}
</style>
