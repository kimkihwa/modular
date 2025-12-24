// 모듈 타입 정의
export interface ModuleOption {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface ServiceModule {
  id: string
  name: string
  icon: string
  color: string
  enabled: boolean
  order: number
  options: ModuleOption[]
}

export interface ModuleConfig {
  dynamicQr: ServiceModule
  waiting: ServiceModule
  menu: ServiceModule
  menuDetail: ServiceModule
  payment: ServiceModule
}

// 메뉴 타입 정의
export interface MenuOption {
  id: string
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  soldOut: boolean
  options?: MenuOption[]
}

export interface CartItem {
  menuId: string
  name: string
  price: number
  quantity: number
  options: MenuOption[]
  totalPrice: number
}

// 웨이팅 타입 정의
export interface WaitingInfo {
  phone: string
  adultCount: number
  kidCount: number
  waitingNumber?: number
  estimatedTime?: number
}

// 결제 타입 정의
export interface PaymentInfo {
  method: 'card' | 'kakao' | 'naver' | 'toss'
  totalAmount: number
  benefitAmount: number
  finalAmount: number
}
