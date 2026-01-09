/* ========================================
   EyeChartPro Admin - TopBar Component
   Dynamic User Profile from Supabase
   ======================================== */

// Global user data
let currentUser = {
    name: '사용자',
    initial: '?',
    role: 'hospital_staff',
    roleName: '스태프',
    department: '',
    jobTitle: ''
};

function getPageTitle() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const titleMap = {
        'index.html': 'HOME',
        'hospitals.html': '병원 관리',
        'users.html': '회원 관리',
        'subscriptions.html': '구독/결제',
        'logs.html': '활동 로그',
        'settings.html': '시스템 설정'
    };

    return titleMap[filename] || 'EyeChartPro Admin';
}

function getRoleDisplayName(role) {
    const roleMap = {
        'super_admin': '슈퍼유저',
        'admin_master': '마스터',
        'admin_staff': '스태프',
        'hospital_master': '병원장',
        'hospital_staff': '스태프'
    };
    return roleMap[role] || role;
}

function createTopBarHTML() {
    const pageTitle = getPageTitle();
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const collapsedClass = isCollapsed ? 'collapsed' : '';
    const toggleIcon = isCollapsed ? 'panel-left-open' : 'panel-left-close';
    
    const positionInfo = [currentUser.jobTitle, currentUser.department].filter(Boolean).join(' · ');

    return `
    <header class="top-bar">
        <div class="top-bar-brand ${collapsedClass}"></div>

        <div class="top-bar-main">
            <div class="top-bar-left">
                <button class="top-bar-toggle" onclick="toggleSidebar()" title="사이드바 토글">
                    <i data-lucide="${toggleIcon}" class="w-5 h-5" id="sidebar-toggle-icon"></i>
                </button>
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
                        <div class="top-bar-avatar" style="background: #4f46e5; color: white;">${currentUser.initial}</div>
                        <span class="user-name" style="margin-left: 8px;">${currentUser.name}</span>
                        <span style="background: #4f46e5; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px; margin-left: 8px;">${currentUser.roleName}</span>
                        <i data-lucide="chevron-down" class="w-4 h-4" style="margin-left: 6px; color: #9ca3af;"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-header">
                            <div class="top-bar-avatar" style="background: #4f46e5; color: white; width: 40px; height: 40px; font-size: 16px;">${currentUser.initial}</div>
                            <div class="user-dropdown-info">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="user-dropdown-name">${currentUser.name}</span>
                                    <span style="background: #4f46e5; color: white; font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 4px;">${currentUser.roleName}</span>
                                </div>
                                ${positionInfo ? `<span style="font-size: 11px; color: #6b7280; margin-top: 4px;">${positionInfo}</span>` : ''}
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

// Load current user profile from Supabase
async function loadCurrentUserProfile() {
    try {
        // Check if supabaseClient exists
        if (typeof supabaseClient === 'undefined' || !supabaseClient) {
            console.log('Supabase client not initialized yet');
            return;
        }

        // Get current user from auth
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            console.log('No authenticated user');
            return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('name, role, department, job_title')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            return;
        }

        if (profile) {
            currentUser = {
                name: profile.name || user.email.split('@')[0],
                initial: (profile.name || user.email)[0].toUpperCase(),
                role: profile.role,
                roleName: getRoleDisplayName(profile.role),
                department: profile.department || '',
                jobTitle: profile.job_title || ''
            };
            
            // Re-render topbar with updated user info
            renderTopBar();
        }
    } catch (err) {
        console.error('Error loading user profile:', err);
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
    if (mainContent) mainContent.classList.toggle('expanded', isCollapsed);

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
    // Clear Supabase session if available
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.auth.signOut();
    }
    window.location.href = getBasePath() + 'login.html';
}

function goToSettings() {
    // Navigate to settings page
    const basePath = getBasePath();
    window.location.href = basePath + 'pages/settings.html';
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
    
    // Try to load user profile after a short delay (to ensure supabaseClient is ready)
    setTimeout(() => {
        loadCurrentUserProfile();
    }, 500);
});
