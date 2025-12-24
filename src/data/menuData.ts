import type { MenuItem } from '@/types'

export const menuData: MenuItem[] = [
  // 메인 메뉴
  {
    id: 'menu-1',
    name: '시그니처 스테이크',
    description: '부드러운 안심 스테이크에 트러플 소스를 곁들인 시그니처 메뉴',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    category: '메인',
    soldOut: false,
    options: [
      { id: 'opt-1-1', name: '미디움 레어', price: 0 },
      { id: 'opt-1-2', name: '미디움', price: 0 },
      { id: 'opt-1-3', name: '웰던', price: 0 }
    ]
  },
  {
    id: 'menu-2',
    name: '해산물 파스타',
    description: '신선한 해산물과 토마토 소스의 조화',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    category: '메인',
    soldOut: false,
    options: [
      { id: 'opt-2-1', name: '크림 소스로 변경', price: 2000 },
      { id: 'opt-2-2', name: '면 추가', price: 3000 }
    ]
  },
  {
    id: 'menu-3',
    name: '그릴드 치킨 샐러드',
    description: '구운 닭가슴살과 신선한 채소의 건강한 조합',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: '메인',
    soldOut: false
  },
  {
    id: 'menu-4',
    name: '트러플 리조또',
    description: '블랙 트러플과 파마산 치즈의 풍미 가득한 리조또',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    category: '메인',
    soldOut: true
  },
  // 사이드
  {
    id: 'menu-5',
    name: '감자튀김',
    description: '바삭하게 튀긴 감자튀김',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    category: '사이드',
    soldOut: false,
    options: [
      { id: 'opt-5-1', name: '치즈 토핑', price: 2000 },
      { id: 'opt-5-2', name: '트러플 오일', price: 3000 }
    ]
  },
  {
    id: 'menu-6',
    name: '시저 샐러드',
    description: '로메인 상추와 시저 드레싱',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    category: '사이드',
    soldOut: false
  },
  {
    id: 'menu-7',
    name: '마늘빵',
    description: '갓 구운 마늘 버터빵',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1619535860434-cf9b902a0a14?w=400',
    category: '사이드',
    soldOut: false
  },
  // 음료
  {
    id: 'menu-8',
    name: '아메리카노',
    description: '깊고 진한 에스프레소',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    category: '음료',
    soldOut: false,
    options: [
      { id: 'opt-8-1', name: 'ICE', price: 0 },
      { id: 'opt-8-2', name: 'HOT', price: 0 },
      { id: 'opt-8-3', name: '샷 추가', price: 500 }
    ]
  },
  {
    id: 'menu-9',
    name: '레몬에이드',
    description: '상큼한 레몬에이드',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    category: '음료',
    soldOut: false
  },
  {
    id: 'menu-10',
    name: '하우스 와인 (글라스)',
    description: '오늘의 추천 와인',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    category: '음료',
    soldOut: false,
    options: [
      { id: 'opt-10-1', name: '레드', price: 0 },
      { id: 'opt-10-2', name: '화이트', price: 0 }
    ]
  },
  // 디저트
  {
    id: 'menu-11',
    name: '티라미수',
    description: '이탈리안 정통 티라미수',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    category: '디저트',
    soldOut: false
  },
  {
    id: 'menu-12',
    name: '초콜릿 브라우니',
    description: '진한 초콜릿 브라우니와 바닐라 아이스크림',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
    category: '디저트',
    soldOut: false
  }
]

export const categories = ['전체', '메인', '사이드', '음료', '디저트']
