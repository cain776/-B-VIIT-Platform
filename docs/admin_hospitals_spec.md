# 병원/조직 관리 화면 기획서

> 작성일: 2026-01-10  
> 버전: v1.0  
> 상태: 초안

---

## 1. 개요

### 1.1 목적

- 조직(회사)과 병원을 분리 관리
- 본점/지점 계층 구조 지원
- 회원 소속 지정의 기반 데이터 제공

### 1.2 현재 문제점

- VisuWorks(회사)가 hospitals 테이블에 저장됨
- 조직과 병원의 구분이 불명확

---

## 2. DB 구조 변경

### 2.1 현재 구조

```
hospitals 테이블
├── VisuWorks (type: headquarter) ← 회사인데 병원으로 분류
├── 비앤빛안과 (type: headquarter)
├── 비앤빛안과 백내장센터(강서점) (type: branch)
└── 비앤빛안과 스마일센터(강동점) (type: branch)
```

### 2.2 개선 구조

```
organizations 테이블 (조직/회사)
└── VisuWorks

hospitals 테이블 (병원만)
├── 비앤빛안과 (type: headquarter)
├── 비앤빛안과 백내장센터(강서점) (type: branch)
└── 비앤빛안과 스마일센터(강동점) (type: branch)
```

### 2.3 테이블 스키마

#### organizations (신규)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| code | VARCHAR(20) | 고유 코드 |
| name | VARCHAR(100) | 조직명 |
| address | TEXT | 주소 |
| phone | VARCHAR(20) | 연락처 |
| status | VARCHAR(20) | active/inactive |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

#### hospitals (수정)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| organization_id | UUID | FK → organizations |
| code | VARCHAR(20) | 고유 코드 |
| name | VARCHAR(100) | 병원명 |
| type | VARCHAR(20) | headquarter/branch |
| parent_hospital_id | UUID | 상위 병원 (분원용) |
| address | TEXT | 주소 |
| phone | VARCHAR(20) | 연락처 |
| status | VARCHAR(20) | active/inactive |

#### profiles (수정)

| 컬럼 | 변경 | 설명 |
|------|------|------|
| organization_id | 신규 | FK → organizations |
| hospital_id | 유지 | FK → hospitals |

---

## 3. 마이그레이션 계획

### Step 1: organizations 테이블 생성

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Step 2: VisuWorks 데이터 이동

```sql
-- organizations에 VisuWorks 추가
INSERT INTO organizations (code, name, status)
SELECT code, name, status
FROM hospitals
WHERE code = 'visuworks2024';

-- hospitals에서 VisuWorks 삭제
DELETE FROM hospitals WHERE code = 'visuworks2024';
```

### Step 3: hospitals에 organization_id 추가

```sql
ALTER TABLE hospitals ADD COLUMN organization_id UUID REFERENCES organizations(id);

-- 모든 병원을 VisuWorks 조직에 연결 (현재는 1개 조직)
UPDATE hospitals SET organization_id = (SELECT id FROM organizations LIMIT 1);
```

### Step 4: profiles에 organization_id 추가

```sql
ALTER TABLE profiles ADD COLUMN organization_id UUID REFERENCES organizations(id);
```

---

## 4. 화면 구조

### 4.1 조직 관리 (신규 페이지)

```
[ 조직 관리 ]

┌─────────────────────────────────────────┐
│  전체 조직 | 1개    활성 | 1개          │
├─────────────────────────────────────────┤
│  No | 조직명    | 코드       | 상태     │
│  1  | VisuWorks | visuworks  | 활성     │
└─────────────────────────────────────────┘
```

### 4.2 병원 관리 (기존 페이지 유지)

```
[ 병원 관리 ]

┌─────────────────────────────────────────┐
│  전체 | 3개   본점 | 1개   지점 | 2개    │
├─────────────────────────────────────────┤
│  No | 병원명              | 구분 | 상태 │
│  1  | 비앤빛안과          | 본점 | 활성 │
│  2  | 비앤빛안과 백내장.. | 지점 | 활성 │
│  3  | 비앤빛안과 스마일.. | 지점 | 활성 │
└─────────────────────────────────────────┘
```

---

## 5. 구현 체크리스트

### 5.1 DB 작업

- [ ] organizations 테이블 생성
- [ ] VisuWorks 데이터 이동
- [ ] hospitals.organization_id 추가
- [ ] profiles.organization_id 추가
- [ ] RLS 정책 업데이트

### 5.2 UI 작업

- [ ] 조직 관리 페이지 생성 (organizations.html)
- [ ] 병원 관리 페이지에서 VisuWorks 제외
- [ ] 회원 관리 소속 드롭다운 수정

---

## 6. 향후 고려사항

1. **다중 조직 지원**: 향후 다른 회사도 시스템 사용 시
2. **조직별 병원 연결**: 각 조직이 관리하는 병원 구분
3. **조직별 관리자**: 조직별로 다른 관리자 지정

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2026-01-10 | 초안 작성 |
