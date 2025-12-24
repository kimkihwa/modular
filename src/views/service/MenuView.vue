<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useCartStore } from '@/stores/cartStore'
import { menuData, categories } from '@/data/menuData'
import type { MenuItem } from '@/types'

const router = useRouter()
const route = useRoute()
const moduleStore = useModuleStore()
const cartStore = useCartStore()

// 웨이팅에서 온 경우 확인
const fromWaiting = computed(() => route.query.from === 'waiting')

const activeCategory = ref<string | null>(null)
const searchQuery = ref('')
const showCart = ref(false)

const filteredMenu = computed(() => {
  let items = menuData
  
  if (activeCategory.value) {
    items = items.filter(item => item.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }
  
  return items
})

const formatPrice = (price: number) => {
  return price.toLocaleString() + '원'
}

const addToCart = (item: MenuItem) => {
  cartStore.addItem({
    menuId: item.id,
    name: item.name,
    price: item.price,
    quantity: 1
  })
}

const getCartQuantity = (menuId: string) => {
  const item = cartStore.items.find(i => i.menuId === menuId)
  return item?.quantity || 0
}

const goToDetail = (item: MenuItem) => {
  if (moduleStore.isModuleEnabled('menuDetail')) {
    router.push(`/service/menu-detail?id=${item.id}`)
  }
}

const goToCart = () => {
  router.push('/service/cart')
}

const goBackToWaiting = () => {
  router.push('/service/waiting')
}

const shareMenu = () => {
  if (navigator.share) {
    navigator.share({
      title: '아치서울 레스토랑 메뉴',
      text: '맛있는 메뉴를 확인해보세요!',
      url: window.location.href
    })
  }
}
</script>

<template>
  <div class="menu-view">
    <!-- 헤더 -->
    <div class="menu-header">
      <div class="header-top">
        <q-btn 
          v-if="fromWaiting" 
          flat 
          icon="arrow_back" 
          @click="goBackToWaiting"
        />
        <div class="shop-info">
          <h1>아치서울 레스토랑</h1>
          <p>테이블 A-12</p>
        </div>
        <q-btn 
          v-if="moduleStore.isOptionEnabled('menu', 'share')" 
          flat 
          round 
          icon="share" 
          @click="shareMenu" 
        />
      </div>

      <!-- 검색 -->
      <div v-if="moduleStore.isOptionEnabled('menu', 'search')" class="search-bar">
        <q-input 
          v-model="searchQuery"
          placeholder="메뉴 검색"
          outlined
          dense
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- 카테고리 탭 -->
    <div v-if="moduleStore.isOptionEnabled('menu', 'category')" class="category-tabs">
      <q-chip 
        :outline="activeCategory !== null"
        color="primary"
        clickable
        @click="activeCategory = null"
      >
        전체
      </q-chip>
      <q-chip 
        v-for="cat in categories" 
        :key="cat.id"
        :outline="activeCategory !== cat.id"
        color="primary"
        clickable
        @click="activeCategory = cat.id"
      >
        {{ cat.name }}
      </q-chip>
    </div>

    <!-- 메뉴 목록 -->
    <div class="menu-list">
      <div 
        v-for="item in filteredMenu" 
        :key="item.id" 
        class="menu-item"
        :class="{ 'sold-out': item.soldOut }"
        @click="goToDetail(item)"
      >
        <div class="menu-image">
          <img :src="item.image || '/placeholder.png'" :alt="item.name" />
          <q-chip 
            v-if="item.soldOut && moduleStore.isOptionEnabled('menu', 'soldOut')" 
            color="red" 
            text-color="white" 
            class="sold-out-badge"
          >
            품절
          </q-chip>
        </div>
        
        <div class="menu-info">
          <h3>{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>
          <div class="price-row">
            <span class="price">{{ formatPrice(item.price) }}</span>
            <q-btn 
              v-if="moduleStore.isOptionEnabled('menu', 'cart') && !item.soldOut"
              round 
              color="primary" 
              icon="add" 
              size="sm"
              @click.stop="addToCart(item)"
            />
            <q-badge 
              v-if="getCartQuantity(item.id) > 0" 
              color="red"
              floating
            >
              {{ getCartQuantity(item.id) }}
            </q-badge>
          </div>
        </div>
      </div>
    </div>

    <!-- 장바구니 FAB (웨이팅에서 온 경우는 숨김) -->
    <q-page-sticky 
      v-if="!fromWaiting && moduleStore.isOptionEnabled('menu', 'cart') && cartStore.totalItems > 0" 
      position="bottom-right" 
      :offset="[16, 100]"
    >
      <q-btn 
        fab 
        icon="shopping_cart" 
        color="primary" 
        @click="goToCart"
      >
        <q-badge color="red" floating>{{ cartStore.totalItems }}</q-badge>
      </q-btn>
    </q-page-sticky>

    <!-- 하단 액션 -->
    <div class="bottom-actions">
      <div class="cart-summary" v-if="cartStore.totalItems > 0">
        <span>{{ cartStore.totalItems }}개 · {{ formatPrice(cartStore.totalPrice) }}</span>
      </div>
      
      <!-- 웨이팅에서 온 경우: 웨이팅으로 돌아가기 -->
      <q-btn 
        v-if="fromWaiting"
        color="primary" 
        class="order-btn"
        @click="goBackToWaiting"
      >
        <q-icon name="arrow_back" class="q-mr-sm" />
        웨이팅으로 돌아가기 ({{ cartStore.totalItems }}개 담김)
      </q-btn>
      
      <!-- 일반 플로우: 장바구니로 이동 -->
      <q-btn 
        v-else
        color="primary" 
        class="order-btn"
        :disable="cartStore.totalItems === 0"
        @click="goToCart"
      >
        <q-icon name="shopping_cart" class="q-mr-sm" />
        {{ cartStore.totalItems > 0 ? '장바구니 보기' : '메뉴를 선택해주세요' }}
      </q-btn>
    </div>

    <!-- 모듈 정보 -->
    <div class="module-indicator">
      <q-chip color="green" text-color="white" icon="restaurant_menu" size="sm">
        메뉴판 모듈
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

.menu-view {
  min-height: 100vh;
  background: $gray-light;
  padding-bottom: 120px;
}

.menu-header {
  background: $white;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid $border;

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .shop-info {
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: $black;
      margin: 0 0 4px;
    }

    p {
      font-size: 13px;
      color: $gray;
      margin: 0;
    }
  }
}

.search-bar {
  margin-top: 8px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  background: $white;
  border-bottom: 1px solid $border;

  &::-webkit-scrollbar {
    display: none;
  }
  
  .q-chip {
    flex-shrink: 0;
  }
}

.menu-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  border: 1px solid $border;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  &.sold-out {
    opacity: 0.5;
    pointer-events: none;

    .menu-image img {
      filter: grayscale(1);
    }
  }
}

.menu-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sold-out-badge {
    position: absolute;
    top: 8px;
    left: 8px;
  }
}

.menu-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $black;
    margin: 0 0 4px;
  }

  .description {
    font-size: 13px;
    color: $gray;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    position: relative;

    .price {
      font-size: 16px;
      font-weight: 700;
      color: $black;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $white;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  border-top: 1px solid $border;

  .cart-summary {
    text-align: center;
    font-size: 14px;
    color: $gray;
    margin-bottom: 8px;
  }

  .order-btn {
    width: 100%;
    height: 54px;
    font-size: 16px;
    font-weight: 600;
    background: $primary;
    border-radius: 12px;
    
    &:disabled {
      background: $gray;
      opacity: 0.5;
    }
  }
}

.module-indicator {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 200;
  
  .q-chip {
    background: rgba($primary, 0.95);
    color: $white;
  }
}
</style>
