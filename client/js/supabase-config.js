/**
 * Supabase Configuration
 * EyeChartPro / B-Viit Platform
 * 
 * ⚠️ IMPORTANT: 
 * - anon key는 클라이언트에서 사용 가능 (공개 키)
 * - service_role key는 절대 클라이언트에 노출하면 안됨 (서버 전용)
 */

const SUPABASE_URL = 'https://txzcmvoknooiejwkprje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4emNtdm9rbm9vaWVqd2twcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTAxMDksImV4cCI6MjA4MzQ4NjEwOX0.WXSm7pW9sCXzioGczZvE_eQsvcYyVkB1ogCyk0dVtFk';

// Supabase 클라이언트 (초기화 전 null)
let supabaseClient = null;

// Supabase 클라이언트 초기화
function initSupabase() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase 연결 완료');
        return supabaseClient;
    } else {
        console.error('❌ Supabase 라이브러리가 로드되지 않았습니다.');
        return null;
    }
}

// 클라이언트 가져오기 (없으면 초기화)
function getSupabase() {
    if (!supabaseClient) {
        initSupabase();
    }
    return supabaseClient;
}

// 현재 로그인한 사용자 정보 가져오기
async function getCurrentUser() {
    const client = getSupabase();
    if (!client) return null;
    const { data: { user } } = await client.auth.getUser();
    return user;
}

// 세션 변경 감지
function onAuthStateChange(callback) {
    const client = getSupabase();
    if (!client) return;
    client.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', function() {
    initSupabase();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY, initSupabase, getSupabase, getCurrentUser, onAuthStateChange };
}
