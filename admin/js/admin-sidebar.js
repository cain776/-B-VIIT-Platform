/* ========================================
   EyeChartPro Admin - Sidebar Component
   ======================================== */

const adminMenuData = [
    {
        id: 'home',
        label: 'HOME',
        icon: 'home',
        href: 'index.html',
        type: 'link'
    },
    {
        id: 'hospitals',
        label: '병원 관리',
        icon: 'building-2',
        href: 'hospitals.html',
        type: 'link'
    },
    {
        id: 'users',
        label: '사용자 관리',
        icon: 'users',
        href: 'users.html',
        type: 'link'
    },
    {
        id: 'subscriptions',
        label: '구독/결제',
        icon: 'credit-card',
        href: 'subscriptions.html',
        type: 'link'
    },
    {
        id: 'logs',
        label: '활동 로그',
        icon: 'file-text',
        href: 'logs.html',
        type: 'link'
    },
    {
        id: 'settings',
        label: '시스템 설정',
        icon: 'settings',
        href: 'settings.html',
        type: 'link'
    }
];

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

function adjustHref(href) {
    if (href === '#') return href;
    const basePath = getBasePath();

    if (window.location.pathname.includes('/pages/')) {
        if (href === 'index.html') {
            return '../index.html';
        }
        return href;
    } else {
        if (href !== 'index.html' && href.endsWith('.html')) {
            return 'pages/' + href;
        }
    }
    return href;
}

function isActivePage(href) {
    const currentPage = getCurrentPage();
    if (href === '#') return false;
    return href.includes(currentPage) || currentPage.includes(href.replace('.html', ''));
}

function createMenuItem(item) {
    const href = adjustHref(item.href);
    const isActive = isActivePage(item.href);
    const activeClass = isActive ? 'active' : '';

    return `
        <li>
            <a href="${href}"
                class="menu-item ${activeClass} relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                title="${item.label}">
                <i data-lucide="${item.icon}" class="w-5 h-5 flex-shrink-0"></i>
                <span class="menu-text">${item.label}</span>
            </a>
        </li>
    `;
}

function createSidebarHTML() {
    const basePath = getBasePath();
    const menuItemsHtml = adminMenuData.map(item => createMenuItem(item)).join('');
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const collapsedClass = isCollapsed ? 'collapsed' : '';

    return `
        <aside class="sidebar ${collapsedClass}">
            <!-- Logo -->
            <a href="${basePath}index.html" class="sidebar-logo">
                <span class="logo-full">🔷 VisuWorks</span>
                <span class="logo-short">👁️</span>
            </a>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1 px-3">
                    ${menuItemsHtml}
                </ul>
            </nav>

            <!-- Footer -->
            <div class="sidebar-footer p-4 border-t border-gray-100">
                <a href="${basePath}login.html" class="menu-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                    <span class="menu-text">로그아웃</span>
                </a>
            </div>
        </aside>
    `;
}

function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    container.innerHTML = createSidebarHTML();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderSidebar();
});
