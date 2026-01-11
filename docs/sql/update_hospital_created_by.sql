-- 기존 병원들의 등록자를 김승욱(owner)으로 설정
-- Supabase SQL Editor에서 실행하세요

-- 1. 먼저 김승욱의 profile ID 확인
SELECT id, email, name, role FROM profiles WHERE name = '김승욱';

-- 2. 모든 병원의 created_by를 김승욱으로 업데이트
-- (위 쿼리에서 확인한 ID를 사용하거나, 서브쿼리 사용)
UPDATE hospitals
SET created_by = (
    SELECT id FROM profiles WHERE email = 'seungwook.kim@visuworks.co.kr' LIMIT 1
)
WHERE created_by IS NULL;

-- 3. 업데이트 결과 확인
SELECT h.name as hospital_name, h.created_by, p.name as creator_name
FROM hospitals h
LEFT JOIN profiles p ON h.created_by = p.id;
