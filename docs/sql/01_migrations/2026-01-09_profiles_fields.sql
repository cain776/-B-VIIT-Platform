-- =====================================================
-- B-Viit CRM/EMR - Profiles 테이블 필드 추가
-- 날짜: 2026-01-09
-- 목적: 부서(department), 직함(job_title) 필드 추가
-- =====================================================

-- 부서 필드 추가 (예: 개발팀, 영업팀, 마케팅팀 등)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS department VARCHAR(50);

-- 직함 필드 추가 (예: 대표, 팀장, 과장, 사원 등)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS job_title VARCHAR(50);

-- =====================================================
-- 완료! 추가된 필드:
-- ✅ department: 부서명 (예: 개발팀, 영업팀)
-- ✅ job_title: 직함 (예: 팀장, 과장, 사원)
-- =====================================================
