/* ========================================
   EyeChartPro - Common Components
   ======================================== */

/**
 * Floating Select Component
 * 플로팅 라벨이 적용된 셀렉트 박스 생성
 * 
 * @param {Object} options - 설정 옵션
 * @param {string} options.id - 셀렉트 박스 ID
 * @param {string} options.label - 라벨 텍스트
 * @param {Array} options.items - 옵션 아이템 배열 [{value, text}]
 * @param {string} options.width - 너비 (기본값: '200px')
 * @param {boolean} options.clearable - X 버튼 표시 여부 (기본값: true)
 * @param {Function} options.onChange - 변경 시 콜백 함수
 * @returns {string} HTML 문자열
 */
function createFloatingSelect(options) {
    const {
        id,
        label,
        items = [],
        width = '200px',
        clearable = true,
        onChange = null
    } = options;

    const optionsHtml = items.map(item =>
        `<option value="${item.value}">${item.text}</option>`
    ).join('');

    const clearBtn = clearable ? `
        <span class="floating-select-clear" onclick="clearSelect('${id}')">
            <i data-lucide="x" class="w-3 h-3 text-gray-500"></i>
        </span>
    ` : '';

    return `
        <div class="floating-select" style="min-width: ${width}">
            <select id="${id}" onchange="handleFloatingSelectChange(this${onChange ? `, ${onChange.name}` : ''})">
                <option value=""></option>
                ${optionsHtml}
            </select>
            <label for="${id}">${label}</label>
            ${clearBtn}
            <i data-lucide="chevron-down" class="floating-select-arrow w-4 h-4"></i>
        </div>
    `;
}

/**
 * Handle floating select change
 */
function handleFloatingSelectChange(select, callback) {
    if (select.value) {
        select.classList.add('has-value');
    } else {
        select.classList.remove('has-value');
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    if (typeof callback === 'function') {
        callback(select.value);
    }
}

/**
 * Clear select value
 */
function clearSelect(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
        select.value = '';
        select.classList.remove('has-value');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

/**
 * Initialize all floating selects on the page
 */
function initFloatingSelects() {
    document.querySelectorAll('.floating-select select').forEach(select => {
        if (select.value) {
            select.classList.add('has-value');
        }
    });
}


/* ========================================
   Button Components
   ======================================== */

/**
 * Button Types
 */
const ButtonTypes = {
    PRIMARY: 'primary',      // 파란색 메인 버튼
    SECONDARY: 'secondary',  // 흰색 테두리 버튼
    SUCCESS: 'success',      // 녹색 버튼
    DANGER: 'danger',        // 빨간색 버튼
    WARNING: 'warning'       // 노란색 버튼
};

/**
 * Create Button Component
 * 
 * @param {Object} options - 설정 옵션
 * @param {string} options.text - 버튼 텍스트
 * @param {string} options.type - 버튼 타입 (primary, secondary, success, danger, warning)
 * @param {string} options.icon - Lucide 아이콘 이름
 * @param {string} options.onClick - 클릭 핸들러 함수명
 * @param {string} options.id - 버튼 ID (선택)
 * @returns {string} HTML 문자열
 */
function createButton(options) {
    const {
        text,
        type = 'primary',
        icon = null,
        onClick = null,
        id = null
    } = options;

    const typeClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
        warning: 'btn-warning'
    };

    const iconHtml = icon ? `<i data-lucide="${icon}" class="w-4 h-4"></i>` : '';
    const idAttr = id ? `id="${id}"` : '';
    const onClickAttr = onClick ? `onclick="${onClick}"` : '';

    return `
        <button ${idAttr} ${onClickAttr} class="btn ${typeClasses[type]}">
            ${iconHtml}
            ${text}
        </button>
    `;
}

/**
 * Create Icon Button (아이콘만 있는 버튼)
 */
function createIconButton(options) {
    const {
        icon,
        type = 'secondary',
        onClick = null,
        id = null,
        title = ''
    } = options;

    const typeClasses = {
        primary: 'btn-icon-primary',
        secondary: 'btn-icon-secondary'
    };

    const idAttr = id ? `id="${id}"` : '';
    const onClickAttr = onClick ? `onclick="${onClick}"` : '';
    const titleAttr = title ? `title="${title}"` : '';

    return `
        <button ${idAttr} ${onClickAttr} ${titleAttr} class="btn-icon ${typeClasses[type]}">
            <i data-lucide="${icon}" class="w-5 h-5"></i>
        </button>
    `;
}


/* ========================================
   File Input Component
   ======================================== */

/**
 * Create File Input Component
 * 
 * @param {Object} options - 설정 옵션
 * @param {string} options.id - input ID
 * @param {string} options.accept - 허용 파일 타입
 * @param {string} options.buttonText - 버튼 텍스트
 * @param {string} options.placeholder - 파일 미선택 시 텍스트
 * @returns {string} HTML 문자열
 */
function createFileInput(options) {
    const {
        id = 'fileInput',
        accept = '.xlsx,.xls,.csv',
        buttonText = '파일선택',
        placeholder = '선택된 파일 없음'
    } = options;

    return `
        <div class="file-input-group">
            <div class="file-input-wrapper">
                <button class="btn btn-secondary">
                    <i data-lucide="folder-open" class="w-4 h-4"></i>
                    ${buttonText}
                </button>
                <input type="file" id="${id}" accept="${accept}" onchange="handleFileInputChange(this)">
            </div>
            <span id="${id}FileName" class="file-input-name">${placeholder}</span>
        </div>
    `;
}

/**
 * Handle file input change
 */
function handleFileInputChange(input) {
    const fileNameSpan = document.getElementById(input.id + 'FileName');
    if (fileNameSpan) {
        fileNameSpan.textContent = input.files[0] ? input.files[0].name : '선택된 파일 없음';
    }
}

/**
 * Reset file input
 */
function resetFileInput(inputId) {
    const input = document.getElementById(inputId);
    const fileNameSpan = document.getElementById(inputId + 'FileName');

    if (input) {
        input.value = '';
    }
    if (fileNameSpan) {
        fileNameSpan.textContent = '선택된 파일 없음';
    }
}


/* ========================================
   Filter Bar Component
   ======================================== */

/**
 * Create Filter Bar
 * 페이지 상단 필터 바 생성
 * 
 * @param {Object} options - 설정 옵션
 * @param {Array} options.leftItems - 왼쪽 아이템 HTML 배열
 * @param {Array} options.rightItems - 오른쪽 아이템 HTML 배열
 * @returns {string} HTML 문자열
 */
function createFilterBar(options) {
    const {
        leftItems = [],
        rightItems = []
    } = options;

    return `
        <div class="filter-bar">
            <div class="filter-bar-left">
                ${leftItems.join('')}
            </div>
            <div class="filter-bar-right">
                ${rightItems.join('')}
            </div>
        </div>
    `;
}


/* ========================================
   Common Action Buttons
   ======================================== */

/**
 * Create Reset Button (초기화 버튼)
 */
function createResetButton(onClick = 'resetForm()') {
    return createButton({
        text: '초기화',
        type: 'secondary',
        icon: 'refresh-cw',
        onClick: onClick
    });
}

/**
 * Create Excel Upload Button (엑셀 등록 버튼)
 */
function createExcelUploadButton(onClick = 'uploadExcel()') {
    return createButton({
        text: '엑셀 등록',
        type: 'primary',
        icon: 'upload',
        onClick: onClick
    });
}

/**
 * Create Sample Download Button (샘플파일 다운로드 버튼)
 */
function createSampleDownloadButton(onClick = 'downloadSample()') {
    return createButton({
        text: '샘플파일 다운로드',
        type: 'success',
        icon: 'download',
        onClick: onClick
    });
}

/**
 * Create Search Button (검색 버튼)
 */
function createSearchButton(onClick = 'search()') {
    return createButton({
        text: '검색',
        type: 'primary',
        icon: 'search',
        onClick: onClick
    });
}


/* ========================================
   Initialize Components
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    initFloatingSelects();
});

