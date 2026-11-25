
/* =========================================
   DASHBOARD NAVIGATION SYSTEM
========================================= */

document.addEventListener('DOMContentLoaded', function () {

    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const mainContent = document.querySelector('.main-content');

    if (!sidebar || !mainContent) {
        console.warn('Navigation elements not found.');
        return;
    }

    /* =====================================
       SIDEBAR TOGGLE
    ===================================== */

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            if (window.innerWidth <= 992) {
                sidebar.classList.toggle('mobile-open');
            }
        });
    }

    /* =====================================
       ACTIVE NAVIGATION MENU
    ===================================== */

    const navLinks = document.querySelectorAll('.sidebar a.nav-link:not(.submenu-toggle)');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    function setActiveMenu() {

        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        navLinks.forEach(link => {

            const linkPath = link.getAttribute('href');

            if (!linkPath) return;

            const linkPage = linkPath.split('/').pop();

            link.classList.toggle(
                'active',
                linkPage === currentPage
            );

        });

    }

    setActiveMenu();

    document.querySelectorAll('.nav-group').forEach(group => {
        const hasActiveLink = group.querySelector('.nav-link.active');

        if (hasActiveLink) {
            group.classList.add('open');
            group.querySelector('.submenu-toggle')
                ?.setAttribute('aria-expanded', 'true');
        }
    });

    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            const group = this.closest('.nav-group');
            const isOpen = group.classList.toggle('open');
            this.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* =====================================
       CLOSE SIDEBAR ON MOBILE CLICK
    ===================================== */

    navLinks.forEach(link => {

        link.addEventListener('click', function () {

            if (window.innerWidth <= 992) {
                sidebar.classList.remove('mobile-open');
            }

        });

    });

    /* =====================================
       CLOSE SIDEBAR OUTSIDE CLICK
    ===================================== */

    document.addEventListener('click', function (event) {

        if (
            window.innerWidth <= 992 &&
            sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(event.target) &&
            !(menuToggle && menuToggle.contains(event.target))
        ) {

            sidebar.classList.remove('mobile-open');

        }

    });

    /* =====================================
       WINDOW RESIZE HANDLING
    ===================================== */

    window.addEventListener('resize', function () {

        if (window.innerWidth > 992) {

            sidebar.classList.remove('mobile-open');

        } else {

            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');

        }

    });

    /* =====================================
       NAVIGATION LINK CLICK EFFECT
    ===================================== */

    navLinks.forEach(link => {

        link.addEventListener('click', function () {

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            this.classList.add('active');

        });

    });

    console.log('Navigation system initialized successfully!');

});
