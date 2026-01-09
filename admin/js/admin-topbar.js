/* ========================================
   EyeChartPro Admin - TopBar Component
   ======================================== */

function getPageTitle() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const titleMap = {
        'index.html': 'HOME',
        'hospitals.html': '병원 관리',
        'users.html': '사용자 관리',
        'subscriptions.html': '구독/결제',
        'logs.html': '활동 로그',
        'settings.html': '시스템 설정'
    };

    return titleMap[filename] || 'EyeChartPro Admin';
}

function createTopBarHTML() {
    const pageTitle = getPageTitle();
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const collapsedClass = isCollapsed ? 'collapsed' : '';
    const toggleIcon = isCollapsed ? 'panel-left-open' : 'panel-left-close';

    return `
    <header class="top-bar">
        <div class="top-bar-brand ${collapsedClass}"></div>

        <div class="top-bar-main">
            <div class="top-bar-left">
                <button class="top-bar-toggle" onclick="toggleSidebar()" title="사이드바 토글">
                    <i data-lucide="${toggleIcon}" class="w-5 h-5" id="sidebar-toggle-icon"></i>
                </button>
                <div class="top-bar-divider"></div>
                <span class="top-bar-title">${pageTitle}</span>
            </div>

            <div class="top-bar-center">
                <div class="top-bar-search">
                    <i data-lucide="search" class="search-icon w-4 h-4"></i>
                    <input type="text" placeholder="검색...">
                </div>
            </div>

            <div class="top-bar-right">
                <button class="top-bar-icon" title="알림">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                </button>
                <div class="top-bar-divider"></div>
                <div class="user-menu">
                    <button class="user-info" onclick="toggleUserMenu()" id="userBtn">
                        <div class="top-bar-avatar" style="background: #4f46e5; color: white;">김</div>
                        <span class="user-name" style="margin-left: 8px;">김승욱</span>
                        <span style="background: #4f46e5; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px; margin-left: 8px;">슈퍼유저</span>
                        <i data-lucide="chevron-down" class="w-4 h-4" style="margin-left: 6px; color: #9ca3af;"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-header">
                            <div class="top-bar-avatar" style="background: #4f46e5; color: white; width: 40px; height: 40px; font-size: 16px;">김</div>
                            <div class="user-dropdown-info">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="user-dropdown-name">김승욱</span>
                                    <span style="background: #4f46e5; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px;">슈퍼유저</span>
                                </div>
                                <span style="font-size: 11px; color: #6b7280; margin-top: 4px;">Director · DX팀</span>
                            </div>
                        </div>
                        <div class="user-dropdown-divider"></div>
                        <button class="user-dropdown-item" onclick="goToSettings()">
                            <i data-lucide="settings" class="w-4 h-4"></i>
                            설정
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

function renderTopBar() {
    const container = document.getElementById('topbar-container');
    if (!container) return;

    container.innerHTML = createTopBarHTML();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const topBarBrand = document.querySelector('.top-bar-brand');
    const mainContent = document.querySelector('.main-content');
    const icon = document.getElementById('sidebar-toggle-icon');

    if (!sidebar) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);

    if (topBarBrand) topBarBrand.classList.toggle('collapsed', isCollapsed);
    if (mainContent) mainContent.classList.toggle('collapsed', isCollapsed);

    if (icon) {
        icon.setAttribute('data-lucide', isCollapsed ? 'panel-left-open' : 'panel-left-close');
        lucide.createIcons();
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

function logout() {
    window.location.href = getBasePath() + 'login.html';
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '../';
    return '';
}

document.addEventListener('click', function (e) {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userBtn && userDropdown && !userBtn.contains(e.target)) {
        userDropdown.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    renderTopBar();
});
