/* ========================================
   EyeChartPro - Home Page JavaScript
   ======================================== */

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initCharts();
});

/* ========================================
   Chart Initialization
   ======================================== */

/**
 * Initialize all charts on the home page
 */
function initCharts() {
    initWeeklyChart();
    initCountryChart();
}

/**
 * Initialize Weekly Orders Bar Chart
 */
function initWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                label: '주문 수',
                data: [120, 150, 180, 140, 160, 110, 80],
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                barThickness: 32,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `주문: ${context.raw}건`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        color: '#94a3b8',
                        font: { size: 12 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/**
 * Initialize Country Distribution Doughnut Chart
 */
function initCountryChart() {
    const canvas = document.getElementById('countryChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['미국', '일본', '독일', '영국', '호주', '기타'],
            datasets: [{
                data: [35, 25, 15, 12, 8, 5],
                backgroundColor: [
                    '#3b82f6',  // Blue - 미국
                    '#ef4444',  // Red - 일본
                    '#f59e0b',  // Yellow - 독일
                    '#22c55e',  // Green - 영국
                    '#a855f7',  // Purple - 호주
                    '#9ca3af'   // Gray - 기타
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

/* ========================================
   Home Page Data Functions
   ======================================== */

/**
 * Sample order data
 */
const sampleOrders = [
    {
        id: 'ORD-2024120401',
        country: 'US',
        customer: 'John Smith',
        amount: 125.00,
        currency: 'USD',
        status: 'processing'
    },
    {
        id: 'ORD-2024120402',
        country: 'JP',
        customer: '田中太郎',
        amount: 16800,
        currency: 'JPY',
        status: 'shipping'
    },
    {
        id: 'ORD-2024120403',
        country: 'DE',
        customer: 'Hans Mueller',
        amount: 89.00,
        currency: 'EUR',
        status: 'shipping'
    },
    {
        id: 'ORD-2024120404',
        country: 'UK',
        customer: 'James Wilson',
        amount: 57.50,
        currency: 'GBP',
        status: 'completed'
    }
];

/**
 * Sample marketplace data
 */
const marketplaceData = [
    { name: 'Amazon', regions: '미국, 일본, 독일', orders: 1234, change: 15 },
    { name: 'Shopify', regions: '자사몰', orders: 567, change: 8 },
    { name: 'eBay', regions: '글로벌', orders: 289, change: -3 },
    { name: 'Coupang', regions: '한국', orders: 412, change: 22 }
];

/**
 * Refresh home page data
 */
function refreshData() {
    // This function can be used to fetch fresh data from an API
    console.log('Refreshing data...');
    showToast('데이터를 새로고침했습니다.', 'success');
}

/**
 * Export data to Excel
 */
function exportToExcel() {
    console.log('Exporting to Excel...');
    showToast('엑셀 파일을 다운로드합니다.', 'info');
}

