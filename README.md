# 모듈형 QR 서비스 프로토타입

차세대 결제 QR 시스템의 모듈형 서비스 플랫폼 프로토타입입니다.

## 🎯 프로젝트 목적

특허 출원 내용을 기반으로 모듈형 서비스 구조를 시각화하고, 각 모듈의 조합에 따른 서비스 플로우를 시연합니다.

## 📦 5대 모듈

| 모듈 | 설명 | 주요 옵션 |
|------|------|----------|
| **동적 QR** | QR 진입점 관리 | 동적갱신, 세션생성, 자동만료, NFC지원 |
| **웨이팅** | 대기/순번 관리 | 대기등록, 순번안내, 알림발송, 장바구니사전구성 |
| **메뉴판** | 메뉴 조회/주문 | 카테고리, 검색, 품절표시, 장바구니, 외부공유 |
| **메뉴디테일** | 상세/프로모션 | 상세정보, 프로모션배너, SNS공유, 바로주문 |
| **결제창** | 결제 처리 | 혜택비교, 앱리스결제, 후불/선불 |

## 🚀 시작하기

### 설치

```bash
cd modular-qr-prototype
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── data/           # 정적 데이터 (메뉴 등)
├── router/         # Vue Router 설정
├── stores/         # Pinia 상태관리
│   ├── moduleStore.ts   # 모듈 설정
│   ├── cartStore.ts     # 장바구니
│   ├── waitingStore.ts  # 웨이팅
│   └── sessionStore.ts  # 세션 관리
├── styles/         # 전역 스타일
├── types/          # TypeScript 타입 정의
└── views/
    ├── HomeView.vue      # 홈 화면
    ├── BuilderView.vue   # 모듈 빌더
    ├── PreviewView.vue   # 서비스 미리보기
    └── service/          # 실제 서비스 화면들
        ├── QrEntryView.vue
        ├── WaitingView.vue
        ├── MenuView.vue
        ├── MenuDetailView.vue
        ├── CartView.vue
        ├── PaymentView.vue
        └── CompleteView.vue
```

## 🎮 사용 방법

1. **홈 화면**에서 "모듈 빌더" 클릭
2. **빌더 화면**에서 필요한 모듈을 활성화/비활성화
3. 각 모듈의 세부 옵션 토글
4. "미리보기"로 설정된 서비스 플로우 확인
5. "서비스 시작"으로 실제 플로우 체험

## 🔗 관련 특허

- DP25-0078: 사용자 맞춤 결제조건 안내 시스템
- DP25-0081: 웨이팅-테이블 장바구니 연동 (서버 저장)
- DP25-0082: 웨이팅-테이블 장바구니 연동 (단말 저장)
- DP25-0083: 식별자 기반 주문-결제 자동 연동
- DP25-0127: 외부 사용자 참여형 주문 시스템
- DP25-0149: 기본 카메라/NFC 기반 결제앱 호출

## 🛠 기술 스택

- Vue 3 + TypeScript
- Vite
- Pinia (상태관리)
- Quasar Framework (UI)
- vuedraggable (드래그앤드롭)

---

© 2025 아치서울 - 내부 프로토타입용
