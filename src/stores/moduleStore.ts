import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ModuleConfig, ServiceModule } from '@/types'

// 기본 모듈 설정
const defaultModules: ModuleConfig = {
  dynamicQr: {
    id: 'dynamicQr',
    name: '동적 QR',
    icon: 'qr_code_2',
    color: '#4CAF50',
    enabled: true,
    order: 1,
    options: [
      { id: 'dynamicRefresh', label: '동적 갱신', description: 'QR 코드 주기적 자동 갱신', enabled: true },
      { id: 'sessionCreate', label: '세션 생성', description: '스캔 시 고유 세션/식별자 발급', enabled: true },
      { id: 'autoExpire', label: '자동 만료', description: '완료/취소 시 QR 무효화', enabled: true },
      { id: 'nfcSupport', label: 'NFC 지원', description: 'QR 외 NFC 태그 병행', enabled: false },
      { id: 'multiDevice', label: '멀티 디바이스', description: '동일 세션 복수 단말 허용', enabled: false }
    ]
  },
  waiting: {
    id: 'waiting',
    name: '웨이팅',
    icon: 'schedule',
    color: '#2196F3',
    enabled: true,
    order: 2,
    options: [
      { id: 'waitRegister', label: '대기 등록', description: '고객 정보 입력 및 대기열 등록', enabled: true },
      { id: 'queueNotify', label: '순번 안내', description: '실시간 대기 순번/예상 시간 표시', enabled: true },
      { id: 'smsAlert', label: '알림 발송', description: '입장 임박 시 SMS/푸시 알림', enabled: false },
      { id: 'menuPreview', label: '메뉴 미리보기', description: '대기 중 메뉴판 열람 허용', enabled: false },
      { id: 'preCart', label: '장바구니 사전구성', description: '대기 중 장바구니 담기 → 입장 후 연동', enabled: false }
    ]
  },
  menu: {
    id: 'menu',
    name: '메뉴판',
    icon: 'restaurant_menu',
    color: '#FF9800',
    enabled: true,
    order: 3,
    options: [
      { id: 'categorySort', label: '카테고리 분류', description: '메뉴 카테고리별 정렬/필터', enabled: true },
      { id: 'search', label: '검색 기능', description: '메뉴명/재료 검색', enabled: false },
      { id: 'soldOutDisplay', label: '품절 표시', description: '실시간 품절/판매중지 반영', enabled: true },
      { id: 'optionSelect', label: '옵션 선택', description: '사이즈, 토핑 등 커스텀', enabled: false },
      { id: 'quantityControl', label: '수량 조절', description: '수량 증감', enabled: true },
      { id: 'addToCart', label: '장바구니 담기', description: '선택 메뉴 장바구니 추가', enabled: true },
      { id: 'externalShare', label: '외부 공유', description: '원격 사용자에게 메뉴판 링크 공유', enabled: false },
      { id: 'participantDistinct', label: '참여자 구분', description: '외부 참여자 닉네임별 선택 구분', enabled: false },
      { id: 'realtimeSync', label: '실시간 동기화', description: '외부 참여자 선택 실시간 반영', enabled: false },
      { id: 'hostEdit', label: '호스트 편집 권한', description: '외부 참여자 선택 수정/삭제', enabled: false },
      { id: 'orderApproval', label: '주문 승인', description: '호스트만 최종 주문 확정', enabled: false }
    ]
  },
  menuDetail: {
    id: 'menuDetail',
    name: '메뉴 디테일',
    icon: 'info',
    color: '#9C27B0',
    enabled: false,
    order: 4,
    options: [
      { id: 'detailInfo', label: '상세 정보', description: '이미지, 설명, 가격, 영양정보 등', enabled: true },
      { id: 'promoBanner', label: '프로모션 배너', description: '개별 상품 할인/이벤트 표시', enabled: false },
      { id: 'snsShare', label: 'SNS 공유', description: '블로그/SNS 공유 버튼', enabled: false },
      { id: 'externalLanding', label: '외부 유입 랜딩', description: '광고/블로그에서 직접 진입', enabled: false },
      { id: 'directOrder', label: '바로 주문', description: '메뉴판 거치지 않고 단품 주문', enabled: false },
      { id: 'relatedRecommend', label: '관련 상품 추천', description: '연관 메뉴 표시', enabled: false }
    ]
  },
  payment: {
    id: 'payment',
    name: '결제창',
    icon: 'payment',
    color: '#F44336',
    enabled: true,
    order: 5,
    options: [
      { id: 'orderPaymentLink', label: '주문-결제 연동', description: '식별자 기반 주문내역 자동 매핑', enabled: true },
      { id: 'benefitCompare', label: '결제 혜택 비교', description: '결제수단별 할인/적립/혜택 비교 UI', enabled: false },
      { id: 'optimalRecommend', label: '최적 결제 추천', description: '혜택 최대화 결제수단 자동 추천', enabled: false },
      { id: 'applessPayment', label: '앱리스 결제', description: '기본 카메라/NFC → 결제앱 자동 호출', enabled: false },
      { id: 'dynamicMpm', label: '동적 MPM 생성', description: '서버에서 실시간 결제 데이터 생성', enabled: false },
      { id: 'appFallback', label: '앱 미설치 Fallback', description: '앱스토어 자동 이동', enabled: false },
      { id: 'postpaid', label: '후불 결제', description: '주문 후 퇴장 시 결제', enabled: false },
      { id: 'prepaid', label: '선불 결제', description: '주문과 동시 결제', enabled: true }
    ]
  }
}

export const useModuleStore = defineStore('moduleStore', () => {
  const modules = ref<ModuleConfig>(JSON.parse(JSON.stringify(defaultModules)))

  // 활성화된 모듈 목록 (순서대로)
  const activeModules = computed(() => {
    return Object.values(modules.value)
      .filter(m => m.enabled)
      .sort((a, b) => a.order - b.order)
  })

  // 서비스 플로우 경로 계산
  const serviceFlow = computed(() => {
    const flow: string[] = []
    const active = activeModules.value

    // 메뉴 모듈과 메뉴디테일 모듈 확인
    const hasMenu = active.some(m => m.id === 'menu')
    const hasMenuDetail = active.some(m => m.id === 'menuDetail')

    for (const module of active) {
      switch (module.id) {
        case 'dynamicQr':
          // QR entry는 중복 허용 (시연용)
          flow.push('qr-entry')
          break
        case 'waiting':
          flow.push('waiting')
          break
        case 'menu':
          flow.push('menu')
          break
        case 'menuDetail':
          // 메뉴 리스트 없이 디테일만 있으면 플로우에 추가
          if (!hasMenu && hasMenuDetail) {
            flow.push('menu-detail')
          }
          break
        case 'payment':
          // 메뉴 모듈이 있으면 카트를 거치고, 없으면 바로 결제
          if (hasMenu || hasMenuDetail) {
            flow.push('cart')
          }
          flow.push('payment')
          break
      }
    }
    flow.push('complete')
    return flow
  })

  // 모듈 활성화/비활성화
  const toggleModule = (moduleId: keyof ModuleConfig) => {
    modules.value[moduleId].enabled = !modules.value[moduleId].enabled
  }

  // 옵션 토글
  const toggleOption = (moduleId: keyof ModuleConfig, optionId: string) => {
    const option = modules.value[moduleId].options.find(o => o.id === optionId)
    if (option) {
      option.enabled = !option.enabled
    }
  }

  // 모듈 순서 변경
  const updateModuleOrder = (orderedIds: string[]) => {
    orderedIds.forEach((id, index) => {
      const moduleKey = id as keyof ModuleConfig
      if (modules.value[moduleKey]) {
        modules.value[moduleKey].order = index + 1
      }
    })
  }

  // 다음 단계 라우트 가져오기
  const getNextRoute = (currentRoute: string): string | null => {
    const currentIndex = serviceFlow.value.indexOf(currentRoute)
    if (currentIndex === -1 || currentIndex >= serviceFlow.value.length - 1) {
      return null
    }
    return serviceFlow.value[currentIndex + 1]
  }

  // 이전 단계 라우트 가져오기
  const getPrevRoute = (currentRoute: string): string | null => {
    const currentIndex = serviceFlow.value.indexOf(currentRoute)
    if (currentIndex <= 0) {
      return null
    }
    return serviceFlow.value[currentIndex - 1]
  }

  // 특정 옵션이 활성화되어 있는지 확인
  const isOptionEnabled = (moduleId: keyof ModuleConfig, optionId: string): boolean => {
    const module = modules.value[moduleId]
    if (!module.enabled) return false
    const option = module.options.find(o => o.id === optionId)
    return option?.enabled ?? false
  }

  // 특정 모듈이 활성화되어 있는지 확인
  const isModuleEnabled = (moduleId: keyof ModuleConfig): boolean => {
    return modules.value[moduleId]?.enabled ?? false
  }

  // 설정 초기화
  const resetToDefault = () => {
    modules.value = JSON.parse(JSON.stringify(defaultModules))
  }

  // 캔버스 모듈 적용 (빌더에서 사용)
  const applyCanvasModules = (canvasModules: any[]) => {
    // 모든 모듈 비활성화
    Object.keys(modules.value).forEach(key => {
      const moduleKey = key as keyof ModuleConfig
      modules.value[moduleKey].enabled = false
    })

    // 캔버스 모듈들을 활성화하고 순서 및 옵션 적용
    canvasModules.forEach((canvasModule, index) => {
      const moduleKey = canvasModule.id as keyof ModuleConfig
      if (modules.value[moduleKey]) {
        modules.value[moduleKey].enabled = true
        modules.value[moduleKey].order = index + 1
        
        // 옵션 상태 복사
        canvasModule.options.forEach((canvasOption: any) => {
          const option = modules.value[moduleKey].options.find(o => o.id === canvasOption.id)
          if (option) {
            option.enabled = canvasOption.enabled
          }
        })
      }
    })
  }

  return {
    modules,
    activeModules,
    serviceFlow,
    toggleModule,
    toggleOption,
    updateModuleOrder,
    getNextRoute,
    getPrevRoute,
    isOptionEnabled,
    isModuleEnabled,
    resetToDefault,
    applyCanvasModules
  }
}, {
  persist: true
})
