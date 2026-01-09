/* ========================================
   EyeChartPro - Sidebar Component
   사이드바를 동적으로 생성하는 컴포넌트
   ======================================== */

/**
 * 메뉴 데이터 구조
 */
const menuData = [
    {
        id: 'home',
        label: 'HOME',
        icon: 'home',
        href: 'index.html',
        type: 'link'
    },
    {
        id: 'patient',
        label: '환자 관리',
        icon: 'users',
        type: 'submenu',
        items: [
            { label: '환자 목록', href: 'patient-list.html' },
            { label: '환자 등록', href: 'patient-register.html' },
            { label: 'VIP 관리', href: 'patient-vip.html' }
        ]
    },
    {
        id: 'reservation',
        label: '예약 관리',
        icon: 'calendar',
        type: 'submenu',
        items: [
            { label: '예약 현황', href: 'reservation-status.html' },
            { label: '예약 등록', href: 'reservation-register.html' },
            { label: '예약 설정', href: 'reservation-settings.html' }
        ]
    },
    {
        id: 'reception',
        label: '접수 & 진료',
        icon: 'clipboard-list',
        type: 'submenu',
        items: [
            { label: '접수 대기', href: 'reception-waiting.html' },
            { label: '진료 차트', href: 'reception-chart.html' },
            { label: '수납 처리', href: 'reception-payment.html' }
        ]
    },
    {
        id: 'surgery',
        label: '수술 관리',
        icon: 'activity',
        type: 'submenu',
        items: [
            { label: '수술 스케줄', href: 'surgery-schedule.html' },
            { label: '수술 기록', href: 'surgery-record.html' },
            { label: '경과 관찰', href: 'surgery-followup.html' }
        ]
    },
    {
        id: 'examination',
        label: '검사 관리',
        icon: 'scan',
        type: 'submenu',
        items: [
            { label: '검사 대기', href: 'exam-waiting.html' },
            { label: '검사 결과', href: 'exam-result.html' },
            { label: '장비 연동', href: 'exam-device.html' }
        ]
    },
    {
        id: 'crm',
        label: 'CRM',
        icon: 'heart',
        type: 'submenu',
        items: [
            { label: '소개환자 관리', href: 'crm-referral.html' },
            { label: '마케팅', href: 'crm-marketing.html' },
            { label: '만족도 조사', href: 'crm-survey.html' }
        ]
    },
    {
        id: 'channel-care',
        label: '채널 케어',
        icon: 'message-square',
        href: 'channel-care.html',
        type: 'link',
        badge: '3'
    },
    {
        id: 'marketing',
        label: '마케팅',
        icon: 'trending-up',
        type: 'submenu',
        items: [
            { label: '마케팅 대시보드', href: 'dashboard-marketing.html' },
            { label: '채널 상세', href: 'marketing-channel.html' },
            { label: '바이럴', href: 'marketing-viral.html' },
            { label: '해외 마케팅', href: 'marketing-global.html' },
            { label: '고객 유입유형', href: 'marketing-customer.html' }
        ]
    },
    {
        id: 'analytics',
        label: '대시보드 & 분석',
        icon: 'bar-chart-2',
        type: 'submenu',
        items: [
            { label: '전체 수술실적', href: 'dashboard-surgery.html' },
            { label: '원장단 수술실적', href: 'dashboard-doctor.html' }
        ]
    },
    {
        id: 'operations',
        label: '운영 관리',
        icon: 'shield',
        type: 'submenu',
        items: [
            { label: '계정 관리', href: 'account-management.html' },
            { label: '구독/결제', href: 'subscription.html' }
        ]
    },
    {
        id: 'settings',
        label: '설정',
        icon: 'settings',
        type: 'submenu',
        items: [
            { label: '병원 설정', href: 'settings-hospital.html' },
            { label: '사용자 관리', href: 'settings-users.html' },
            { label: '보안 설정', href: 'settings-security.html' },
            { label: '연동 설정', href: 'settings-integration.html' }
        ]
    },
    {
        id: 'support',
        label: '고객센터',
        icon: 'help-circle',
        type: 'submenu',
        items: [
            { label: '공지사항', href: 'support-notice.html' },
            { label: '도움말', href: 'support-help.html' }
        ]
    }
];

/**
 * 현재 페이지 경로 가져오기
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
}

/**
 * 상대 경로 계산 (pages 폴더 내에서 호출 시)
 */
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

/**
 * 페이지 경로에 맞게 href 조정
 */
function adjustHref(href) {
    if (href === '#') return href;

    const basePath = getBasePath();
    const currentPage = getCurrentPage();

    // 이미 pages/ 안에 있으면
    if (window.location.pathname.includes('/pages/')) {
        // index.html로 가려면 ../index.html
        if (href === 'index.html') {
            return '../index.html';
        }
        // 다른 pages 파일이면 그대로
        if (href.endsWith('.html') && !href.includes('/')) {
            return href;
        }
    } else {
        // index.html에서 pages로 가려면 pages/ 추가
        if (href !== 'index.html' && href.endsWith('.html')) {
            return 'pages/' + href;
        }
    }

    return href;
}

/**
 * 현재 페이지에 해당하는 메뉴인지 확인
 */
function isActivePage(href) {
    const currentPage = getCurrentPage();
    if (href === '#') return false;
    return href.includes(currentPage) || currentPage.includes(href.replace('.html', ''));
}

/**
 * 메뉴 아이템 HTML 생성
 */
function createMenuItem(item) {
    const currentPage = getCurrentPage();

    if (item.type === 'link') {
        const href = adjustHref(item.href);
        const isActive = isActivePage(item.href);
        const activeClass = isActive ? 'active' : '';
        const badgeHtml = item.badge
            ? `<span class="ml-auto flex-shrink-0 flex items-center justify-center w-5 h-5 aspect-square bg-red-500 text-white text-xs font-semibold rounded-full">${item.badge}</span>`
            : '';

        return `
            <li>
                <a href="${href}"
                    class="menu-item ${activeClass} relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                    title="${item.label}">
                    <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0"></i>
                    <span class="menu-text">${item.label}</span>
                    ${badgeHtml}
                </a>
            </li>
        `;
    }

    if (item.type === 'submenu') {
        // 서브메뉴 중 현재 페이지가 있는지 확인
        const hasActivePage = item.items.some(subItem => isActivePage(subItem.href));
        const savedStates = JSON.parse(localStorage.getItem('submenuStates') || '{}');
        const isOpen = savedStates[item.id] || hasActivePage;
        // open과 show 클래스를 개별적으로 관리하여 토글 시 일관성 보장
        const openClass = isOpen ? 'open' : '';
        const showClass = isOpen ? 'show' : '';
        const arrowRotate = isOpen ? 'style="transform: rotate(180deg)"' : '';

        const subItemsHtml = item.items.map(subItem => {
            const subHref = adjustHref(subItem.href);
            const isSubActive = isActivePage(subItem.href);
            const subActiveClass = isSubActive
                ? 'text-blue-600 font-medium bg-blue-50'
                : 'text-gray-600 hover:text-blue-600';

            return `
                <li><a href="${subHref}"
                        class="block py-2 px-3 text-sm ${subActiveClass} rounded">${subItem.label}</a>
                </li>
            `;
        }).join('');

        return `
            <li>
                <button onclick="toggleSubmenu('${item.id}')"
                    class="menu-item relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                    title="${item.label}">
                    <div class="flex items-center gap-3">
                        <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0"></i>
                        <span class="menu-text">${item.label}</span>
                    </div>
                    <i data-lucide="chevron-down" class="w-4 h-4 transition-transform menu-arrow"
                        id="${item.id}-arrow" ${arrowRotate}></i>
                </button>
                <ul id="${item.id}" class="submenu pl-11 space-y-1 mt-1 ${openClass} ${showClass}">
                    ${subItemsHtml}
                </ul>
            </li>
        `;
    }

    return '';
}

/**
 * 전체 사이드바 HTML 생성
 */
function createSidebarHTML() {
    const basePath = getBasePath();
    const menuItemsHtml = menuData.map(item => createMenuItem(item)).join('');

    // localStorage에서 사이드바 접힘 상태 확인
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const collapsedClass = isCollapsed ? 'collapsed' : '';

    return `
        <aside class="sidebar ${collapsedClass}">
            <!-- Logo -->
            <a href="${basePath}index.html" class="sidebar-logo" onclick="closeAllSubmenus()">
                <span class="logo-full">👁️ EyeChartPro</span>
                <span class="logo-short">👁️</span>
            </a>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1 px-3">
                    ${menuItemsHtml}
                </ul>
            </nav>

            <!-- Footer -->
            <div class="sidebar-footer p-4 border-t border-gray-100 text-xs text-gray-400">
                <span>© 2026 B&VIIT Group</span>
            </div>
        </aside>
    `;
}

/**
 * 사이드바 렌더링
 */
function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) {
        console.error('Sidebar container not found. Add <div id="sidebar-container"></div> to your HTML.');
        return;
    }

    // transition 비활성화 (깜빡임 방지)
    const style = document.createElement('style');
    style.id = 'sidebar-no-transition';
    style.textContent = '.submenu { transition: none !important; }';
    document.head.appendChild(style);

    // 사이드바 삽입
    container.innerHTML = createSidebarHTML();

    // 아이콘 초기화
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // transition 다시 활성화 (약간의 딜레이 후)
    setTimeout(() => {
        const noTransition = document.getElementById('sidebar-no-transition');
        if (noTransition) {
            noTransition.remove();
        }
    }, 100);
}

/**
 * 사이드바 상태 복원 (main.js의 기존 함수와 호환)
 */
function restoreSubmenuStatesOnLoad() {
    const savedStates = localStorage.getItem('submenuStates');
    if (!savedStates) return;

    try {
        const states = JSON.parse(savedStates);

        Object.keys(states).forEach(id => {
            const submenu = document.getElementById(id);
            const arrow = document.getElementById(id + '-arrow');

            if (submenu && states[id]) {
                submenu.classList.add('open');
                submenu.classList.add('show');
                if (arrow) {
                    arrow.style.transform = 'rotate(180deg)';
                }
            }
        });
    } catch (e) {
        console.error('Error restoring submenu states:', e);
    }
}

// DOM 로드 시 자동 렌더링
document.addEventListener('DOMContentLoaded', function () {
    renderSidebar();
    // restoreSubmenuStatesOnLoad()는 main.js의 restoreSubmenuStates()와 충돌하므로 제거
    // 상태 복원은 createMenuItem()에서 이미 처리됨
});
