
/* =========================================
   DASHBOARD MAIN CONTROLLER
========================================= */

document.addEventListener('DOMContentLoaded', function () {

    const data = window.dashboardData || {};

    /* =====================================
       HELPER FUNCTIONS
    ===================================== */

    function getCSSVariable(name, fallback) {
        const value = getComputedStyle(document.body)
            .getPropertyValue(name)
            .trim();

        return value || fallback;
    }

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[char];
        });
    }

    /* =====================================
       RENDER STATISTICS
    ===================================== */

    function renderStatistics() {

        const statsGrid = document.querySelector('.stats-grid');

        if (!statsGrid) return;

        const statistics = Array.isArray(data.statistics)
            ? data.statistics
            : [];

        if (!statistics.length) return;

        statsGrid.innerHTML = statistics.map(stat => {

            return `
                <div class="stat-card">

                    <div class="stat-card-header">
                        <span>${escapeHTML(stat.title)}</span>

                        <div class="stat-icon ${escapeHTML(stat.color)}">
                            <i class="fa-solid ${escapeHTML(stat.icon)}" aria-hidden="true"></i>
                        </div>
                    </div>

                    <h2>${escapeHTML(stat.value)}</h2>

                    <div class="stat-footer">
                        <span class="${escapeHTML(stat.growthType)}">
                            ${escapeHTML(stat.growth)}
                        </span>

                        <span>${escapeHTML(stat.description)}</span>
                    </div>

                </div>
            `;

        }).join('');

    }

    /* =====================================
       RENDER RECENT ACTIVITIES
    ===================================== */

    function renderActivities() {

        const activityList = document.getElementById('activityList');

        if (!activityList) return;

        const activities = Array.isArray(data.activities)
            ? data.activities
            : [];

        if (!activities.length) {
            activityList.innerHTML = `
                <div class="empty-state">
                    No recent activities found.
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities.map(activity => {

            return `
                <div class="activity-item">

                    <div class="activity-icon ${escapeHTML(activity.color)}">
                        <i class="fa-solid ${escapeHTML(activity.icon)}" aria-hidden="true"></i>
                    </div>

                    <div class="activity-details">

                        <p><strong>${escapeHTML(activity.title)}</strong></p>

                        <p>${escapeHTML(activity.description)}</p>

                        <span>${escapeHTML(activity.time)}</span>

                    </div>

                </div>
            `;

        }).join('');

    }

    /* =====================================
       REVENUE CHART
    ===================================== */

    let revenueChart = null;

    const fallbackRevenue = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            income: [3200, 4200, 3800, 5100, 4700, 6200, 5800],
            expenses: [1800, 2200, 2000, 2900, 2500, 3100, 2800]
        },

        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            income: [12000, 14500, 13800, 16000, 18500, 17200,
                     21000, 22500, 20500, 24000, 26500, 29000],
            expenses: [7000, 8200, 7800, 9000, 10500, 9800,
                       11500, 12000, 11000, 13000, 14500, 15500]
        },

        yearly: {
            labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
            income: [45000, 58000, 72000, 85000, 105000, 125000],
            expenses: [25000, 32000, 41000, 48000, 62000, 70000]
        }
    };

    function getRevenueData(period) {

        const revenue = data.revenue || {};

        let chartData = revenue[period];

        // Support alternative data property names.
        if (!chartData) {
            const aliases = {
                weekly: ['week', 'Weekly'],
                monthly: ['month', 'Monthly'],
                yearly: ['year', 'Yearly']
            };

            const keys = aliases[period] || [];

            for (const key of keys) {
                if (revenue[key]) {
                    chartData = revenue[key];
                    break;
                }
            }
        }

        // Use fallback when the requested dataset is unavailable.
        if (!chartData) {
            chartData = fallbackRevenue[period];
        }

        if (
            !chartData ||
            !Array.isArray(chartData.labels) ||
            !Array.isArray(chartData.income) ||
            !Array.isArray(chartData.expenses)
        ) {
            console.error('Invalid revenue chart data:', chartData);
            return fallbackRevenue[period];
        }

        return chartData;
    }

    function renderRevenueChart(period = 'weekly') {

        const canvas = document.getElementById('revenueChart');

        if (!canvas) {
            console.error('Revenue chart canvas not found!');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded!');

            const container = canvas.parentElement;

            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        Chart.js could not be loaded. Please check your internet connection.
                    </div>
                `;
            }

            return;
        }

        const chartData = getRevenueData(period);

        if (revenueChart) {
            revenueChart.destroy();
            revenueChart = null;
        }

        const textColor = getCSSVariable('--text', '#374151');
        const mutedColor = getCSSVariable('--muted', '#6b7280');
        const borderColor = getCSSVariable('--border', '#e5e7eb');

        revenueChart = new Chart(canvas, {

            type: 'line',

            data: {

                labels: chartData.labels,

                datasets: [

                    {
                        label: 'Income',
                        data: chartData.income,
                        borderColor: '#635bff',
                        backgroundColor: 'rgba(99, 91, 255, 0.10)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#635bff'
                    },

                    {
                        label: 'Expenses',
                        data: chartData.expenses,
                        borderColor: '#16a36a',
                        backgroundColor: 'rgba(22, 163, 106, 0.08)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#16a36a'
                    }

                ]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: 'index'
                },

                animation: {
                    duration: 700
                },

                plugins: {

                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',

                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            padding: 18,
                            color: textColor,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    },

                    tooltip: {

                        backgroundColor: '#1e293b',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        padding: 12,
                        cornerRadius: 8,

                        callbacks: {

                            label: function (context) {

                                const value = Number(context.parsed.y || 0);

                                return context.dataset.label +
                                    ': $' +
                                    value.toLocaleString();

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        border: {
                            display: false
                        },

                        ticks: {
                            color: mutedColor,
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }

                    },

                    y: {

                        beginAtZero: true,

                        border: {
                            display: false
                        },

                        grid: {
                            color: borderColor,
                            drawTicks: false
                        },

                        ticks: {

                            color: mutedColor,
                            padding: 10,

                            font: {
                                family: 'Inter',
                                size: 11
                            },

                            callback: function (value) {
                                return '$' + Number(value).toLocaleString();
                            }

                        }

                    }

                }

            }

        });

        console.log('Revenue chart rendered:', period);

    }

    /* =====================================
       CHART FILTER
    ===================================== */

    const chartFilter = document.getElementById('chartFilter');

    if (chartFilter) {

        chartFilter.addEventListener('change', function () {
            renderRevenueChart(this.value);
        });

    }

    /* =====================================
       THEME CHANGE
    ===================================== */

    window.addEventListener('storage', function (event) {

        if (event.key === 'dashboardTheme') {
            renderRevenueChart(
                chartFilter ? chartFilter.value : 'weekly'
            );
        }

    });

    // Also support same-page theme changes.
    window.addEventListener('dashboardThemeChanged', function () {
        renderRevenueChart(
            chartFilter ? chartFilter.value : 'weekly'
        );
    });

    /* =====================================
       INITIALIZE DASHBOARD
    ===================================== */

    renderStatistics();

    renderActivities();

    // Wait until browser finishes layout calculation.
    requestAnimationFrame(function () {

        renderRevenueChart(
            chartFilter ? chartFilter.value : 'weekly'
        );

    });

    console.log('Dashboard initialized successfully!');

});
