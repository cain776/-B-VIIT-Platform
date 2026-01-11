/**
 * Supabase Configuration - Admin
 * EyeChartPro / B-Viit Platform
 * 
 * ⚠️ IMPORTANT: 
 * - anon key는 클라이언트에서 사용 가능 (공개 키)
 * - service_role key는 절대 클라이언트에 노출하면 안됨 (서버 전용)
 */

const SUPABASE_URL = 'https://txzcmvoknooiejwkprje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emNtdm9rbm9vaWVqd2twcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTAxMDksImV4cCI6MjA4MzQ4NjEwOX0.WXSm7pW9sCXzioGczZvE_eQsvcYyVkB1ogCyk0dVtFk';

// Supabase 클라이언트 초기화
let supabaseInstance = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 연결 완료 (Admin)');
        return supabaseInstance;
    } else {
        console.error('❌ Supabase 라이브러리가 로드되지 않았습니다.');
        return null;
    }
}

// 현재 로그인한 사용자 정보 가져오기
async function getCurrentUser() {
    if (!supabaseInstance) return null;
    const { data: { user } } = await supabaseInstance.auth.getUser();
    return user;
}

// 세션 변경 감지
function onAuthStateChange(callback) {
    if (!supabaseInstance) return;
    supabaseInstance.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

// Super Admin 권한 확인 (Admin 전용)
async function isSuperAdmin() {
    const user = await getCurrentUser();
    if (!user) return false;

    // user_metadata 또는 profiles 테이블에서 role 확인
    const { data, error } = await supabaseInstance
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'super_admin';
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY, initSupabase, getCurrentUser, onAuthStateChange, isSuperAdmin };
}
