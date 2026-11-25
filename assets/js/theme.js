
/* =========================================
   DASHBOARD THEME SYSTEM
   Dark Mode / Light Mode
========================================= */

document.addEventListener('DOMContentLoaded', function () {

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');

    if (!themeToggle) {
        console.warn('Theme toggle button not found.');
        return;
    }

    /* =====================================
       APPLY THEME
    ===================================== */

    function applyTheme(theme) {

        if (theme === 'dark') {

            document.body.classList.add('dark-theme');

            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            themeToggle.setAttribute('title', 'Switch to Light Mode');

        } else {

            document.body.classList.remove('dark-theme');

            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            themeToggle.setAttribute('title', 'Switch to Dark Mode');

        }

        localStorage.setItem('dashboardTheme', theme);
        window.dispatchEvent(new CustomEvent('dashboardThemeChanged'));

    }

    /* =====================================
       LOAD SAVED THEME
    ===================================== */

    const savedTheme = localStorage.getItem('dashboardTheme') || 'light';

    applyTheme(savedTheme);

    /* =====================================
       THEME TOGGLE
    ===================================== */

    themeToggle.addEventListener('click', function () {

        const isDarkMode = document.body.classList.contains('dark-theme');

        if (isDarkMode) {

            applyTheme('light');

        } else {

            applyTheme('dark');

        }

    });

    /* =====================================
       PUBLIC THEME FUNCTION
    ===================================== */

    window.dashboardTheme = {

        setDark: function () {
            applyTheme('dark');
        },

        setLight: function () {
            applyTheme('light');
        },

        getCurrent: function () {
            return document.body.classList.contains('dark-theme')
                ? 'dark'
                : 'light';
        }

    };

    console.log('Theme system initialized successfully!');

});
