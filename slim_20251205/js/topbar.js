/* ========================================
   EyeChartPro - TopBar Component
   상단바(헤더)를 동적으로 생성하는 컴포넌트
   ======================================== */

/**
 * 현재 페이지 타이틀 가져오기
 */
function getPageTitle() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const titleMap = {
        'index.html': 'HOME',
        'dashboard-surgery.html': '전체 수술실적',
        'dashboard-doctor.html': '원장단 수술실적',
        'dashboard-marketing.html': '마케팅 대시보드',
        'marketing-channel.html': '채널 상세',
        'marketing-viral.html': '바이럴',
        'marketing-global.html': '해외 마케팅',
        'marketing-customer.html': '고객 유입유형',
        'channel-care.html': '채널 케어',
        'account-management.html': '계정 관리',
        'subscription.html': '구독/결제'
    };

    return titleMap[filename] || 'EyeChartPro';
}

/**
 * TopBar HTML 생성
 */
function createTopBarHTML() {
    const pageTitle = getPageTitle();

    // localStorage에서 사이드바 접힘 상태 확인
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const collapsedClass = isCollapsed ? 'collapsed' : '';
    const toggleIcon = isCollapsed ? 'panel-left-open' : 'panel-left-close';

    return `
    <header class="top-bar">
        <!-- 로고 영역 (사이드바 너비와 동일) -->
        <div class="top-bar-brand ${collapsedClass}"></div>

        <!-- 메인 영역 (컨텐츠와 정렬) -->
        <div class="top-bar-main">
            <div class="top-bar-left">
                <button class="top-bar-toggle" onclick="toggleSidebar()" title="사이드바 토글">
                    <i data-lucide="${toggleIcon}" class="w-5 h-5" id="sidebar-toggle-icon"></i>
                </button>
                <div class="top-bar-divider"></div>
                <span class="top-bar-title">${pageTitle}</span>
                <span
                    style="margin-left: 12px; padding: 4px 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 11px; font-weight: 500; border-radius: 4px; letter-spacing: 0.02em;">비앤빛
                    강남본점</span>
            </div>

            <div class="top-bar-center">
                <div class="top-bar-search">
                    <i data-lucide="search" class="search-icon w-4 h-4"></i>
                    <input type="text" placeholder="환자 검색...">
                </div>
            </div>

            <div class="top-bar-right">
                <button class="top-bar-icon" title="알림">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    <span class="badge-dot"></span>
                </button>
                <button class="top-bar-icon" title="설정">
                    <i data-lucide="settings" class="w-5 h-5"></i>
                </button>
                <button class="top-bar-icon" title="도움말">
                    <i data-lucide="help-circle" class="w-5 h-5"></i>
                </button>
                <div class="top-bar-divider"></div>
                <button class="top-bar-icon" onclick="toggleFullscreen()" title="전체화면" id="fullscreenBtn">
                    <i data-lucide="maximize" class="w-5 h-5" id="fullscreenIcon"></i>
                </button>
                <div class="language-select">
                    <button class="top-bar-icon" onclick="toggleLanguageMenu()" title="언어선택" id="langBtn">
                        <span class="lang-code">KO</span>
                    </button>
                    <div class="language-dropdown" id="languageDropdown">
                        <button class="language-option active" onclick="selectLanguage('ko', 'KO')">
                            <span>🇰🇷</span> 한국어
                        </button>
                        <button class="language-option" onclick="selectLanguage('en', 'EN')">
                            <span>🇺🇸</span> English
                        </button>
                        <button class="language-option" onclick="selectLanguage('vi', 'VN')">
                            <span>🇻🇳</span> Tiếng Việt
                        </button>
                    </div>
                </div>
                <div class="top-bar-divider"></div>
                <div class="user-menu">
                    <button class="user-info" onclick="toggleUserMenu()" id="userBtn">
                        <div class="top-bar-avatar" style="background: #2563eb; color: white;">김</div>
                        <span class="user-name" style="margin-left: 8px;">김승욱</span>
                        <span style="background: #2563eb; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px; margin-left: 8px;">병원관리자</span>
                        <i data-lucide="chevron-down" class="w-4 h-4" style="margin-left: 6px; color: #9ca3af;"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-header">
                            <div class="top-bar-avatar" style="background: #2563eb; color: white; width: 40px; height: 40px; font-size: 16px;">김</div>
                            <div class="user-dropdown-info">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="user-dropdown-name">김승욱</span>
                                    <span style="background: #2563eb; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px;">병원관리자</span>
                                </div>
                                <span style="font-size: 11px; color: #6b7280; margin-top: 4px;">Director · DX팀</span>
                            </div>
                        </div>
                        <div class="user-dropdown-divider"></div>
                        <button class="user-dropdown-item" onclick="goToMyPage()">
                            <i data-lucide="user" class="w-4 h-4"></i>
                            내 정보
                        </button>
                        <button class="user-dropdown-item" onclick="goToSettings()">
                            <i data-lucide="settings" class="w-4 h-4"></i>
                            설정
                        </button>
                        <div class="user-dropdown-divider"></div>
                        <button class="user-dropdown-item" onclick="goToSolutionList()">
                            <i data-lucide="layout-grid" class="w-4 h-4"></i>
                            솔루션 목록 보기
                        </button>
                        <button class="user-dropdown-item" onclick="goToAdmin()">
                            <i data-lucide="shield" class="w-4 h-4"></i>
                            어드민으로 가기
                        </button>
                        <div class="user-dropdown-divider"></div>
                        <button class="user-dropdown-item text-red-500" onclick="logout()">
                            <i data-lucide="log-out" class="w-4 h-4"></i>
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;
}

/**
 * TopBar 렌더링
 */
function renderTopBar() {
    const container = document.getElementById('topbar-container');
    if (!container) {
        console.error('TopBar container not found. Add <div id="topbar-container"></div> to your HTML.');
        return;
    }

    // 헤더 삽입
    container.innerHTML = createTopBarHTML();

    // 아이콘 초기화
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// DOM 로드 시 자동 렌더링
document.addEventListener('DOMContentLoaded', function () {
    renderTopBar();
});

// 솔루션 목록으로 이동
function goToSolutionList() {
    window.location.href = '../landing.html';
}

// 어드민으로 이동
function goToAdmin() {
    window.location.href = '../../admin_20250108/pages/hospitals.html';
}
