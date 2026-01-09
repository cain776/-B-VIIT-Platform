-- =====================================================
-- B-Viit CRM/EMR - Profiles RLS 정책 수정
-- 날짜: 2026-01-09
-- 목적: 관리자가 모든 프로필 조회/수정 가능하도록 수정
-- =====================================================

-- =====================================================
-- 1. 기존 Profiles RLS 정책 삭제
-- =====================================================
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for auth trigger" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;

-- =====================================================
-- 2. 새로운 Profiles RLS 정책 생성
-- =====================================================

-- 인증된 사용자는 모든 프로필 조회 가능 (관리자 페이지용)
CREATE POLICY "Authenticated users can view all profiles" ON profiles
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 인증된 사용자는 프로필 수정 가능
CREATE POLICY "Authenticated users can update profiles" ON profiles
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- 프로필 생성 허용 (Auth 트리거용)
CREATE POLICY "Allow insert for auth trigger" ON profiles
  FOR INSERT 
  WITH CHECK (true);

-- =====================================================
-- 완료! 정책 확인:
-- ✅ 인증된 사용자: 모든 프로필 조회/수정 가능
-- ✅ 프로필 생성: 허용 (회원가입 시 Auth 트리거용)
-- =====================================================
