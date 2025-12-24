<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModuleStore } from '@/stores/moduleStore'
import { useWaitingStore } from '@/stores/waitingStore'

const router = useRouter()
const moduleStore = useModuleStore()
const waitingStore = useWaitingStore()

const phone = ref('')
const adultCount = ref(2)
const kidCount = ref(0)
const isSubmitting = ref(false)
const showMenuPreview = ref(false)

const isFormValid = computed(() => {
  return phone.value.length >= 10 && (adultCount.value + kidCount.value) > 0
})

const incrementAdult = () => adultCount.value++
const decrementAdult = () => { if (adultCount.value > 0) adultCount.value-- }
const incrementKid = () => kidCount.value++
const decrementKid = () => { if (kidCount.value > 0) kidCount.value-- }

const openMenuPreview = () => {
  // 메뉴 미리보기 활성화 시 메뉴 페이지로 이동
  if (moduleStore.isOptionEnabled('waiting', 'menuPreview')) {
    showMenuPreview.value = true
    router.push('/service/menu?from=waiting')
  }
}

const openPreCart = () => {
  // 장바구니 사전구성 활성화 시 메뉴 페이지로 이동
  if (moduleStore.isOptionEnabled('waiting', 'preCart')) {
    router.push('/service/menu?from=waiting')
  }
}

const submitWaiting = () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  // 웨이팅 등록 시뮬레이션
  setTimeout(() => {
    waitingStore.register({
      phone: phone.value,
      adultCount: adultCount.value,
      kidCount: kidCount.value
    })
    
    isSubmitting.value = false
    
    // 다음 단계로 이동
    const nextRoute = moduleStore.getNextRoute('waiting')
    if (nextRoute) {
      router.push(`/service/${nextRoute}`)
    }
  }, 1000)
}

const skipWaiting = () => {
  const nextRoute = moduleStore.getNextRoute('waiting')
  if (nextRoute) {
    router.push(`/service/${nextRoute}`)
  }
}
</script>

<template>
  <div class="waiting-view">
    <!-- 헤더 -->
    <div class="waiting-header">
      <div class="shop-name">아치서울 레스토랑</div>
      <q-chip color="blue" text-color="white" size="sm">
        현재 대기 12팀
      </q-chip>
    </div>

    <!-- 등록 폼 -->
    <div class="waiting-form">
      <h2>웨이팅 등록</h2>
      
      <!-- 연락처 -->
      <div class="form-section">
        <label>연락처</label>
        <q-input 
          v-model="phone"
          type="tel"
          placeholder="010-0000-0000"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
      </div>

      <!-- 인원 선택 -->
      <div class="form-section">
        <label>인원</label>
        
        <div class="person-row">
          <span class="person-label">성인</span>
          <div class="counter">
            <q-btn flat round icon="remove" @click="decrementAdult" :disable="adultCount <= 0" />
            <span class="count">{{ adultCount }}</span>
            <q-btn flat round icon="add" @click="incrementAdult" />
          </div>
        </div>

        <div class="person-row">
          <span class="person-label">아동</span>
          <div class="counter">
            <q-btn flat round icon="remove" @click="decrementKid" :disable="kidCount <= 0" />
            <span class="count">{{ kidCount }}</span>
            <q-btn flat round icon="add" @click="incrementKid" />
          </div>
        </div>
      </div>

      <!-- 메뉴 미리보기 옵션 -->
      <div v-if="moduleStore.isOptionEnabled('waiting', 'menuPreview')" class="preview-option">
        <q-btn 
          outline 
          color="primary" 
          icon="restaurant_menu" 
          label="메뉴 미리보기"
          class="preview-btn"
          @click="openMenuPreview"
        />
      </div>

      <!-- 장바구니 사전구성 옵션 -->
      <div v-if="moduleStore.isOptionEnabled('waiting', 'preCart')" class="precart-section">
        <div class="precart-notice">
          <q-icon name="info" color="blue" />
          <span>대기 중 장바구니에 담은 메뉴는 입장 시 자동 연동됩니다</span>
        </div>
        <q-btn 
          outline 
          color="orange" 
          icon="shopping_cart" 
          label="미리 주문하기"
          class="precart-btn"
          @click="openPreCart"
        />
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <q-btn 
        outline 
        color="grey" 
        class="skip-btn"
        @click="skipWaiting"
      >
        건너뛰기
      </q-btn>
      <q-btn 
        color="primary" 
        class="submit-btn"
        :disable="!isFormValid"
        :loading="isSubmitting"
        @click="submitWaiting"
      >
        웨이팅 등록
      </q-btn>
    </div>

    <!-- 모듈 정보 -->
    <div class="module-indicator">
      <q-chip color="blue" text-color="white" icon="schedule" size="sm">
        웨이팅 모듈
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

.waiting-view {
  min-height: 100vh;
  background: $gray-light;
  padding-bottom: 120px;
}

.waiting-header {
  background: $primary;
  color: $white;
  padding: 40px 20px;
  text-align: center;

  .shop-name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
  }
}

.waiting-form {
  background: $white;
  margin: -20px 16px 16px;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid $border;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: $black;
    margin: 0 0 24px;
    text-align: center;
  }
}

.form-section {
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: $black;
    margin-bottom: 8px;
  }
}

.person-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid $border;

  &:last-child {
    border-bottom: none;
  }

  .person-label {
    font-size: 15px;
    color: $black;
  }
}

.counter {
  display: flex;
  align-items: center;
  gap: 8px;

  .count {
    width: 32px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: $black;
  }
}

.preview-option {
  margin-top: 16px;
  margin-bottom: 16px;

  .preview-btn {
    width: 100%;
  }
}

.precart-section {
  margin-top: 16px;

  .precart-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
    background: $orange-light;
    border-radius: 8px;
    margin-bottom: 12px;

    span {
      font-size: 13px;
      color: $orange;
      line-height: 1.4;
    }
  }

  .precart-btn {
    width: 100%;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: $white;
  border-top: 1px solid $border;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  .skip-btn {
    flex: 1;
    height: 54px;
    border-radius: 12px;
    border-color: $border;
  }

  .submit-btn {
    flex: 2;
    height: 54px;
    border-radius: 12px;
    background: $primary;
    font-weight: 600;
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
