<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 모바일 뷰가 필요한 경로 (PreviewView와 서비스 플로우)
const isMobileView = computed(() => {
  return route.path.startsWith('/preview') || route.path.startsWith('/service')
})
</script>

<template>
  <div class="app-container" :class="{ 'mobile-wrapper': isMobileView }">
    <div v-if="isMobileView" class="mobile-frame">
      <RouterView />
    </div>
    <RouterView v-else />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background: #f5f5f5;

  &.mobile-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    background: #e0e0e0;
  }
}

.mobile-frame {
  width: 100%;
  max-width: 430px;
  min-height: calc(100vh - 40px);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  
  // 내부 컨텐츠가 프레임에 맞춰지도록
  > :deep(*) {
    max-width: 100%;
  }

  // 모바일 노치 시뮬레이션
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 25px;
    background: #000;
    border-radius: 0 0 15px 15px;
    z-index: 9999;
    pointer-events: none;
  }
  
  // 노치 공간 확보
  :deep(.preview-view),
  :deep(.qr-entry-view),
  :deep(.waiting-view),
  :deep(.menu-view),
  :deep(.menu-detail-view),
  :deep(.cart-view),
  :deep(.payment-view),
  :deep(.complete-view) {
    padding-top: 30px;
  }
}
</style>
