# 구독 관리 화면 기획서

> 작성일: 2026-01-10  
> 버전: v1.0  
> 상태: 초안

---

## 1. 개요

### 1.1 목적

- SaaS 모델 지원을 위한 조직별 구독 관리
- 플랜별 기능 제한 및 과금 관리
- 구독 상태 모니터링

### 1.2 플랜 구조

| 플랜 | 가격 | 대상 | 기능 |
|------|------|------|------|
| **Free** | 무료 | 개인/소규모 | 기본 기능, 1병원, 3명 |
| **Pro** | 월 ₩99,000 | 중소병원 | 전체 기능, 5병원, 20명 |
| **Enterprise** | 협의 | 대형병원/프랜차이즈 | 무제한, 전용 지원 |

---

## 2. DB 구조

### 2.1 subscriptions 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| organization_id | UUID | FK → organizations |
| plan | VARCHAR(20) | free/pro/enterprise |
| status | VARCHAR(20) | active/cancelled/expired |
| started_at | TIMESTAMPTZ | 구독 시작일 |
| expires_at | TIMESTAMPTZ | 만료일 |
| auto_renew | BOOLEAN | 자동 갱신 여부 |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

### 2.2 organizations 수정

| 컬럼 | 추가 | 설명 |
|------|------|------|
| plan | 신규 | 현재 플랜 (캐시) |
| max_hospitals | 신규 | 최대 병원 수 |
| max_users | 신규 | 최대 사용자 수 |

---

## 3. 화면 구조

### 3.1 구독 관리 페이지 (Owner 전용)

```
┌─────────────────────────────────────────┐
│  구독 관리                              │
├─────────────────────────────────────────┤
│                                         │
│  현재 플랜: Pro                         │
│  상태: 활성                             │
│  만료일: 2026-02-10                     │
│  자동갱신: ON                           │
│                                         │
│  [플랜 변경] [결제 수단 관리] [해지]     │
│                                         │
├─────────────────────────────────────────┤
│  결제 내역                              │
│                                         │
│  2026-01-10 | Pro | ₩99,000 | 완료     │
│  2025-12-10 | Pro | ₩99,000 | 완료     │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 플랜 비교 모달

```
┌─────────────────────────────────────────────────┐
│  플랜 선택                                       │
├──────────────┬──────────────┬──────────────────┤
│     Free     │     Pro      │    Enterprise    │
│              │              │                  │
│   무료       │  ₩99,000/월  │    협의          │
│              │              │                  │
│  1 병원      │  5 병원      │  무제한          │
│  3 사용자    │  20 사용자   │  무제한          │
│  기본 기능   │  전체 기능   │  전용 지원       │
│              │              │                  │
│  [현재 플랜] │  [업그레이드]│  [문의하기]      │
└──────────────┴──────────────┴──────────────────┘
```

---

## 4. 기능 제한 로직

### 4.1 프론트엔드 체크

```javascript
// 병원 추가 시
if (currentHospitalCount >= organization.max_hospitals) {
  showUpgradeModal('병원 추가 한도에 도달했습니다.');
  return;
}

// 회원 추가 시
if (currentUserCount >= organization.max_users) {
  showUpgradeModal('사용자 추가 한도에 도달했습니다.');
  return;
}
```

### 4.2 백엔드 (RLS)

```sql
-- 병원 추가 제한
CREATE POLICY "Limit hospital creation by plan" ON hospitals
FOR INSERT WITH CHECK (
  (SELECT COUNT(*) FROM hospitals WHERE organization_id = NEW.organization_id) 
  < (SELECT max_hospitals FROM organizations WHERE id = NEW.organization_id)
);
```

---

## 5. 결제 연동 (향후)

### 5.1 추천 PG사

| PG사 | 장점 | 수수료 |
|------|------|--------|
| 토스페이먼츠 | 개발자 친화적, 빠른 연동 | 3.3% |
| 포트원 | 다중 PG 지원 | 2.9%~ |
| 이니시스 | 안정성, 대기업 선호 | 협의 |

### 5.2 연동 시 필요 테이블

- `payments` - 결제 내역
- `invoices` - 청구서
- `payment_methods` - 결제 수단 (카드 등)

---

## 6. 구현 체크리스트

### 6.1 Phase 1 (MVP)

- [ ] subscriptions 테이블 생성
- [ ] organizations에 plan 컬럼 추가
- [ ] 구독 관리 페이지 UI
- [ ] 플랜별 기능 제한 로직

### 6.2 Phase 2 (결제)

- [ ] PG사 연동
- [ ] 자동 결제 로직
- [ ] 결제 내역 페이지

### 6.3 Phase 3 (고도화)

- [ ] 쿠폰/할인 코드
- [ ] 연간 결제 할인
- [ ] 사용량 기반 과금

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2026-01-10 | 초안 작성 |
