-- =====================================================
-- B-Viit CRM/EMR - Supabase RLS 정책 수정
-- 날짜: 2026-01-09
-- 목적: 관리자가 모든 병원(활성/비활성) 조회 및 수정 가능하도록 수정
-- =====================================================

-- =====================================================
-- 1. 기존 Hospitals RLS 정책 삭제
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view active hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin can view all hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin can insert hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin can update hospitals" ON hospitals;
DROP POLICY IF EXISTS "Authenticated users can view all hospitals" ON hospitals;

-- =====================================================
-- 2. 새로운 Hospitals RLS 정책 생성
-- =====================================================
-- 인증된 사용자는 모든 병원 조회 가능 (관리자 페이지용)
CREATE POLICY "Authenticated users can view all hospitals" ON hospitals
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 비인증 사용자는 활성 병원만 조회 가능 (회원가입 시 병원코드 확인용)
CREATE POLICY "Public can view active hospitals" ON hospitals
  FOR SELECT 
  USING (auth.uid() IS NULL AND status = 'active');

-- 인증된 사용자는 병원 등록 가능
CREATE POLICY "Authenticated users can insert hospitals" ON hospitals
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- 인증된 사용자는 병원 수정 가능
CREATE POLICY "Authenticated users can update hospitals" ON hospitals
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 완료! 정책 확인:
-- ✅ 인증된 사용자: 모든 병원 조회/등록/수정 가능
-- ✅ 비인증 사용자: 활성 병원만 조회 가능
-- =====================================================
