-- =====================================================
-- B-Viit CRM/EMR - 조직 구조 정리
-- 날짜: 2026-01-09
-- 목적: VisuWorks를 조직으로 추가, 사용자 소속 연결
-- =====================================================

-- =====================================================
-- 1. VisuWorks 조직 추가 (type='company')
-- =====================================================
INSERT INTO hospitals (code, name, type, address, phone, status)
VALUES (
  'visuworks2024',
  'VisuWorks',
  'headquarter',
  '서울시 서초구',
  '',
  'active'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name;

-- =====================================================
-- 2. 김승욱 프로필 - VisuWorks 소속으로 연결
-- =====================================================
UPDATE profiles
SET hospital_id = (SELECT id FROM hospitals WHERE code = 'visuworks2024')
WHERE email = 'cain776@gmail.com';

-- =====================================================
-- 3. 부서 드롭다운 옵션 - 전산정보팀 추가 필요 시 UI에서 추가
-- =====================================================

-- =====================================================
-- 4. 임종철 사용자 추가 (비앤빛안과 소속)
-- 참고: 실제 회원가입은 Auth를 통해 진행됨
-- 이 쿼리는 기존 가입된 사용자 정보 업데이트용
-- =====================================================
-- UPDATE profiles
-- SET 
--   name = '임종철',
--   department = '전산정보팀',
--   job_title = '대리',
--   phone = '010-3022-1928',
--   hospital_id = (SELECT id FROM hospitals WHERE code = 'bnviit1994'),
--   role = 'hospital_staff'
-- WHERE email = 'bv1040@bnbiit.com';

-- =====================================================
-- 결과 확인
-- =====================================================
SELECT code, name, type, status FROM hospitals ORDER BY created_at DESC LIMIT 5;
