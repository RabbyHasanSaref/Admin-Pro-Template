
/* =========================================
   MODERN SAAS ADMIN DASHBOARD
   DEMO DATA
========================================= */

const dashboardData = {

    /* =====================================
       DASHBOARD STATISTICS
    ===================================== */

    statistics: [
        {
            id: 'totalUsers',
            title: 'Total Users',
            value: '12,450',
            icon: 'fa-users',
            color: 'purple',
            growth: '+12.5%',
            growthType: 'positive',
            description: 'Compared to last month'
        },
        {
            id: 'totalRevenue',
            title: 'Total Revenue',
            value: '$45,250',
            icon: 'fa-dollar-sign',
            color: 'green',
            growth: '+8.2%',
            growthType: 'positive',
            description: 'Compared to last month'
        },
        {
            id: 'totalOrders',
            title: 'Total Orders',
            value: '8,540',
            icon: 'fa-box',
            color: 'orange',
            growth: '-2.4%',
            growthType: 'negative',
            description: 'Compared to last month'
        },
        {
            id: 'activeUsers',
            title: 'Active Users',
            value: '9,280',
            icon: 'fa-chart-line',
            color: 'blue',
            growth: '+18.7%',
            growthType: 'positive',
            description: 'Compared to last month'
        }
    ],

    /* =====================================
       REVENUE CHART DATA
    ===================================== */

    revenue: {
        weekly: {
            labels: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            income: [1200, 1900, 1500, 2500, 2200, 3100, 2800],
            expenses: [800, 1100, 900, 1400, 1200, 1700, 1500]
        },

        monthly: {
            labels: [
                'Jan', 'Feb', 'Mar', 'Apr',
                'May', 'Jun', 'Jul', 'Aug',
                'Sep', 'Oct', 'Nov', 'Dec'
            ],
            income: [
                12000, 15000, 13500, 18000,
                21000, 19500, 24000, 22500,
                26000, 28000, 31000, 35000
            ],
            expenses: [
                7000, 8500, 7800, 9500,
                11000, 10500, 13000, 12000,
                14000, 15000, 16500, 18000
            ]
        },

        yearly: {
            labels: [
                '2021', '2022', '2023', '2024', '2025', '2026'
            ],
            income: [
                85000, 120000, 155000,
                190000, 250000, 320000
            ],
            expenses: [
                45000, 65000, 85000,
                105000, 135000, 175000
            ]
        }
    },

    /* =====================================
       RECENT ACTIVITIES
    ===================================== */

    activities: [
        {
            id: 1,
            title: 'New user registered',
            description: 'Sarah Johnson created a new account.',
            time: '2 minutes ago',
            icon: 'fa-user-plus',
            color: 'purple'
        },
        {
            id: 2,
            title: 'Payment received',
            description: 'Payment of $250 was received.',
            time: '15 minutes ago',
            icon: 'fa-dollar-sign',
            color: 'green'
        },
        {
            id: 3,
            title: 'New order placed',
            description: 'Order #ORD-2026-105 was placed.',
            time: '35 minutes ago',
            icon: 'fa-box',
            color: 'orange'
        },
        {
            id: 4,
            title: 'Report generated',
            description: 'Monthly sales report was generated.',
            time: '1 hour ago',
            icon: 'fa-chart-column',
            color: 'blue'
        },
        {
            id: 5,
            title: 'User profile updated',
            description: 'Michael Brown updated his profile.',
            time: '3 hours ago',
            icon: 'fa-user-pen',
            color: 'purple'
        }
    ]
};

/* =========================================
   GLOBAL DATA ACCESS
========================================= */

window.dashboardData = dashboardData;

console.log('Dashboard demo data loaded successfully!');
