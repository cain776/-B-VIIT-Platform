-- =====================================================
-- B-Viit CRM/EMR - Supabase 초기 세팅 SQL
-- 생성일: 2026-01-09
-- 수정일: 2026-01-09
-- 특징: 멱등성 보장 (여러 번 실행해도 안전)
-- =====================================================

-- =====================================================
-- 1. HOSPITALS 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'headquarter' 
    CHECK (type IN ('headquarter', 'branch')),
  parent_hospital_id UUID REFERENCES hospitals(id),
  address TEXT,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'inactive', 'pending')),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hospitals_code ON hospitals(code);
CREATE INDEX IF NOT EXISTS idx_hospitals_parent ON hospitals(parent_hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_status ON hospitals(status);

-- =====================================================
-- 2. PROFILES 테이블 (사용자 프로필)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  role VARCHAR(30) NOT NULL DEFAULT 'hospital_staff' 
    CHECK (role IN (
      'super_admin',      -- 시스템 최고 관리자
      'admin_master',     -- 본사 마스터 관리자
      'admin_staff',      -- 본사 일반 직원
      'hospital_master',  -- 병원 원장/관리자
      'hospital_staff'    -- 병원 일반 직원
    )),
  hospital_id UUID REFERENCES hospitals(id),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_hospital ON profiles(hospital_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- =====================================================
-- 3. STAFF_HOSPITALS 테이블 (다중 병원 소속)
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  role VARCHAR(30),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, hospital_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_hospitals_user ON staff_hospitals(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_hospitals_hospital ON staff_hospitals(hospital_id);

-- =====================================================
-- 4. RLS 활성화
-- =====================================================
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_hospitals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. RLS 정책 (기존 삭제 후 재생성)
-- =====================================================

-- Hospitals 정책 삭제
DROP POLICY IF EXISTS "Anyone can view active hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin can view all hospitals" ON hospitals;
DROP POLICY IF EXISTS "Hospital users view own" ON hospitals;
DROP POLICY IF EXISTS "Admin can insert hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin can update hospitals" ON hospitals;

-- Profiles 정책 삭제
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;
DROP POLICY IF EXISTS "Hospital master view staff" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow insert for auth trigger" ON profiles;

-- Staff_hospitals 정책 삭제
DROP POLICY IF EXISTS "Users view own assignments" ON staff_hospitals;
DROP POLICY IF EXISTS "Admin view all assignments" ON staff_hospitals;

-- =====================================================
-- 5-1. Hospitals RLS 정책
-- =====================================================
-- 비인증 사용자도 활성 병원 조회 가능 (회원가입 시 병원코드 확인용)
CREATE POLICY "Anyone can view active hospitals" ON hospitals
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admin can insert hospitals" ON hospitals
  FOR INSERT WITH CHECK (true);  -- 나중에 함수로 권한 체크

CREATE POLICY "Admin can update hospitals" ON hospitals
  FOR UPDATE USING (true);  -- 나중에 함수로 권한 체크

-- =====================================================
-- 5-2. Profiles RLS 정책 (무한 순환 방지 버전)
-- ⚠️ 중요: profiles 정책에서 profiles 테이블을 조회하면 무한 순환 발생!
-- =====================================================
-- 본인 프로필만 조회
CREATE POLICY "Users view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- 본인 프로필 수정
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- 프로필 생성 허용 (Auth 트리거용)
CREATE POLICY "Allow insert for auth trigger" ON profiles
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 5-3. Staff_hospitals RLS 정책
-- =====================================================
CREATE POLICY "Users view own assignments" ON staff_hospitals
  FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- 6. AUTH 트리거 (회원가입 시 자동 프로필 생성)
-- ⚠️ SECURITY DEFINER: RLS 우회하여 프로필 생성
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'hospital_staff'),
    'pending'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 7. updated_at 자동 갱신 함수
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_hospitals_updated_at ON hospitals;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. 테스트 데이터 (필요시 주석 해제)
-- =====================================================
-- INSERT INTO hospitals (code, name, type, address, phone, status)
-- VALUES (
--   'bnviit1994',
--   '비앤빛안과',
--   'headquarter',
--   '서울시 서초구 서초4동 1317-23번지 GT타워 B2층 (강남역 9번출구 앞 50m)',
--   '02-1588-0009',
--   'active'
-- )
-- ON CONFLICT (code) DO UPDATE SET
--   name = EXCLUDED.name,
--   address = EXCLUDED.address;

-- =====================================================
-- 완료! 다음을 확인하세요:
-- ✅ hospitals 테이블
-- ✅ profiles 테이블
-- ✅ staff_hospitals 테이블
-- ✅ RLS 정책 (무한 순환 방지)
-- ✅ Auth 트리거 (SECURITY DEFINER)
-- ✅ updated_at 트리거
-- =====================================================
