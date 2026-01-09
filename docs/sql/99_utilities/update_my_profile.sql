-- =====================================================
-- 김승욱 프로필 정보 업데이트
-- =====================================================

-- 1. 먼저 부서/직함 컬럼 추가 (없으면)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title VARCHAR(50);

-- 2. 프로필 정보 업데이트
UPDATE profiles
SET 
  department = 'DX Team',
  job_title = '디렉터',
  phone = NULL  -- 전화번호 있으면 여기에 입력
WHERE email = 'cain776@gmail.com';

-- 3. 결과 확인
SELECT name, email, department, job_title, role 
FROM profiles 
WHERE email = 'cain776@gmail.com';
