<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBuilder = () => {
  router.push('/builder')
}

const goToPreview = () => {
  router.push('/preview')
}
</script>

<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="logo">
        <q-icon name="qr_code_2" size="64px" color="primary" />
      </div>
      <h1>모듈형 QR 서비스</h1>
      <p class="subtitle">프로토타입 데모</p>
      <p class="description">
        QR 진입부터 웨이팅, 메뉴판, 결제까지<br>
        필요한 모듈만 조합하여 커스텀 서비스를 구성하세요
      </p>
    </div>

    <div class="action-cards">
      <q-card class="action-card" @click="goToBuilder">
        <q-card-section>
          <div class="card-icon">
            <q-icon name="build" size="48px" color="primary" />
          </div>
          <h3>서비스 빌더</h3>
          <p>모듈을 드래그하여 서비스 구성<br>옵션 ON/OFF로 기능 커스터마이징</p>
        </q-card-section>
      </q-card>

      <q-card class="action-card" @click="goToPreview">
        <q-card-section>
          <div class="card-icon">
            <q-icon name="visibility" size="48px" color="orange" />
          </div>
          <h3>서비스 미리보기</h3>
          <p>구성된 서비스를 실제로 체험<br>QR 스캔부터 결제까지 테스트</p>
        </q-card-section>
      </q-card>
    </div>

    <div class="module-overview">
      <h2>5대 핵심 모듈</h2>
      <div class="modules-grid">
        <div class="module-item">
          <q-icon name="qr_code_2" size="32px" color="green" />
          <span>동적 QR</span>
        </div>
        <div class="module-item">
          <q-icon name="schedule" size="32px" color="blue" />
          <span>웨이팅</span>
        </div>
        <div class="module-item">
          <q-icon name="restaurant_menu" size="32px" color="orange" />
          <span>메뉴판</span>
        </div>
        <div class="module-item">
          <q-icon name="info" size="32px" color="purple" />
          <span>메뉴 디테일</span>
        </div>
        <div class="module-item">
          <q-icon name="payment" size="32px" color="red" />
          <span>결제창</span>
        </div>
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

.home-view {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  background: $gray-light;
}

.hero-section {
  text-align: center;
  margin-bottom: 48px;

  .logo {
    margin-bottom: 16px;
    
    :deep(.q-icon) {
      color: $primary !important;
    }
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: $black;
    margin: 0 0 8px;
  }

  .subtitle {
    font-size: 18px;
    color: $orange;
    font-weight: 600;
    margin: 0 0 16px;
  }

  .description {
    font-size: 14px;
    color: $gray;
    line-height: 1.6;
  }
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}

.action-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 16px;
  background: $white;
  border: 1px solid $border;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .card-icon {
    margin-bottom: 16px;
    
    :deep(.q-icon) {
      color: $primary !important;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
    color: $black;
  }

  p {
    font-size: 14px;
    color: $gray;
    line-height: 1.5;
    margin: 0;
  }
}

.module-overview {
  background: $white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid $border;

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px;
    text-align: center;
    color: $black;
  }
}

.modules-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}

.module-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    font-size: 12px;
    color: $gray;
    font-weight: 500;
  }
}
</style>
