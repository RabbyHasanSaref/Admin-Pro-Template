
/* =========================================
   MODERN SAAS ADMIN DASHBOARD
   MAIN APPLICATION CONTROLLER
========================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================
       APPLICATION INITIALIZATION
    ===================================== */

    console.log('Admin Dashboard Application Started!');

    /* =====================================
       CURRENT YEAR
    ===================================== */

    const currentYear = new Date().getFullYear();

    const yearElements = document.querySelectorAll('.current-year');

    yearElements.forEach(element => {
        element.textContent = currentYear;
    });


/* =====================================
   NOTIFICATION CENTER
===================================== */

const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const notificationList = document.getElementById('notificationList');
const notificationCount = document.getElementById('notificationCount');
const notificationSubtitle = document.getElementById('notificationSubtitle');
const markAllReadBtn = document.getElementById('markAllRead');

if (notificationBtn && notificationPanel && notificationList) {

    const NOTIFICATION_KEY = 'adminProNotifications';

    const defaultNotifications = [
        {
            id: 1,
            title: 'New User Registration',
            message: 'A new user has registered in your system.',
            icon: 'fa-user-plus',
            time: 'Just now',
            read: false
        },
        {
            id: 2,
            title: 'New Order Received',
            message: 'You have received a new order.',
            icon: 'fa-box',
            time: '10 minutes ago',
            read: false
        },
        {
            id: 3,
            title: 'Monthly Report Ready',
            message: 'Your monthly report is ready to view.',
            icon: 'fa-chart-column',
            time: '1 hour ago',
            read: false
        },
        {
            id: 4,
            title: 'System Update',
            message: 'Your system is running normally.',
            icon: 'fa-gear',
            time: 'Yesterday',
            read: true
        }
    ];

    let notifications = [];

    let currentFilter = 'all';

    try {
        const saved = localStorage.getItem(NOTIFICATION_KEY);
        notifications = saved === null
            ? defaultNotifications
            : JSON.parse(saved);

        if (!Array.isArray(notifications)) {
            notifications = defaultNotifications;
        }
    } catch (error) {
        notifications = defaultNotifications;
    }

    function saveNotifications() {
        localStorage.setItem(
            NOTIFICATION_KEY,
            JSON.stringify(notifications)
        );
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function renderNotifications() {

        const unreadCount = notifications.filter(
            item => !item.read
        ).length;

        notificationCount.textContent =
            unreadCount > 99 ? '99+' : unreadCount;

        notificationCount.dataset.count = unreadCount;

        notificationCount.classList.toggle('hidden', unreadCount === 0);

        notificationSubtitle.textContent =
            unreadCount > 0
                ? `${unreadCount} unread notification(s)`
                : 'You are all caught up!';

        const filtered = notifications.filter(item => {
            return currentFilter === 'all' || !item.read;
        });

        notificationList.innerHTML = '';

        if (filtered.length === 0) {
            notificationList.appendChild(
                createElement(
                    'div',
                    'notification-empty',
                    'No notifications found.'
                )
            );

            return;
        }

        filtered.forEach(item => {

            const row = createElement(
                'div',
                'notification-item' + (!item.read ? ' unread' : '')
            );

            const icon = createElement('div', 'notification-item-icon');
            const iconName = /^fa-[a-z0-9-]+$/.test(item.icon)
                ? item.icon
                : 'fa-bell';
            const iconElement = createElement('i');
            iconElement.className = `fa-solid ${iconName}`;
            iconElement.setAttribute('aria-hidden', 'true');
            icon.appendChild(iconElement);

            const content = createElement(
                'div',
                'notification-item-content'
            );

            content.appendChild(
                createElement('h4', '', item.title)
            );

            content.appendChild(
                createElement('p', '', item.message)
            );

            content.appendChild(
                createElement('small', '', item.time || '')
            );

            const actions = createElement(
                'div',
                'notification-item-actions'
            );

            if (!item.read) {
                const readBtn = createElement(
                    'button',
                    '',
                    'Mark read'
                );

                readBtn.type = 'button';

                readBtn.addEventListener('click', () => {
                    item.read = true;
                    saveNotifications();
                    renderNotifications();
                });

                actions.appendChild(readBtn);
            }

            const deleteBtn = createElement(
                'button',
                '',
                'Delete'
            );

            deleteBtn.type = 'button';

            deleteBtn.addEventListener('click', () => {
                notifications = notifications.filter(
                    notification => notification.id !== item.id
                );

                saveNotifications();
                renderNotifications();
            });

            actions.appendChild(deleteBtn);

            row.append(icon, content, actions);

            notificationList.appendChild(row);
        });
    }

    // Open / Close Notification Panel
    notificationBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        const isOpen = notificationPanel.classList.toggle('show');

        notificationBtn.setAttribute(
            'aria-expanded',
            String(isOpen)
        );
    });

    // Outside click closes panel
    document.addEventListener('click', function (event) {
        if (
            !notificationPanel.contains(event.target) &&
            !notificationBtn.contains(event.target)
        ) {
            notificationPanel.classList.remove('show');
            notificationBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Escape key closes panel
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            notificationPanel.classList.remove('show');
            notificationBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // All / Unread filter
    document.querySelectorAll('.notification-tab').forEach(tab => {

        tab.addEventListener('click', function () {

            document.querySelectorAll('.notification-tab')
                .forEach(button => button.classList.remove('active'));

            this.classList.add('active');

            currentFilter = this.dataset.filter;

            renderNotifications();
        });
    });

    // Mark all notifications as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function () {

            notifications = notifications.map(item => ({
                ...item,
                read: true
            }));

            saveNotifications();
            renderNotifications();
        });
    }

    // Initial render
    saveNotifications();
    renderNotifications();
}


    /* =====================================
       IMAGE FALLBACK
    ===================================== */

    document.addEventListener('error', function (event) {
        const image = event.target;

        if (
            image instanceof HTMLImageElement &&
            !image.dataset.fallbackApplied
        ) {
            image.dataset.fallbackApplied = 'true';
            image.src = 'https://placehold.co/100x100?text=User';
        }
    });

    /* =====================================
       PREVENT EMPTY LINKS
    ===================================== */

    document.querySelectorAll('a[href="#"]').forEach(link => {

        link.addEventListener('click', function (event) {

            event.preventDefault();

        });

    });

    /* =====================================
       GLOBAL ALERT FUNCTION
    ===================================== */

    window.dashboardAlert = function (message) {

        alert(message);

    };

    /* =====================================
       GLOBAL CONFIRM FUNCTION
    ===================================== */

    window.dashboardConfirm = function (message) {

        return confirm(message);

    };

    function initializeProfilePage() {
        const profileForm = document.getElementById('profileForm');
        const passwordForm = document.getElementById('passwordForm');

        if (!profileForm || !passwordForm) return;

        const profileFields = [
            'fullName',
            'email',
            'phone',
            'designation',
            'country',
            'website',
            'bio'
        ];

        const defaultProfile = {
            fullName: 'Admin User',
            email: 'admin@example.com',
            phone: '+880 1700-000000',
            designation: 'System Administrator',
            country: 'Bangladesh',
            website: '',
            bio: 'I am a system administrator responsible for managing this workspace.'
        };

        function showProfileMessage(id, message, type) {
            const element = document.getElementById(id);
            element.textContent = message;
            element.className = 'profile-message ' + type;
        }

        function getInitials(name) {
            return name.trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(word => word.charAt(0).toUpperCase())
                .join('') || 'AD';
        }

        function updateOverview(profile) {
            document.getElementById('overviewName').textContent = profile.fullName;
            document.getElementById('overviewEmail').textContent = profile.email;
            document.getElementById('profileAvatar').textContent = getInitials(profile.fullName);
        }

        function loadProfile() {
            let saved = {};

            try {
                saved = JSON.parse(localStorage.getItem('adminProfile') || '{}');
            } catch (error) {
                console.error('Profile loading error:', error);
            }

            const profile = { ...defaultProfile, ...saved };

            profileFields.forEach(id => {
                document.getElementById(id).value = profile[id] ?? '';
            });

            updateOverview(profile);
        }

        profileForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const profile = {};
            profileFields.forEach(id => {
                profile[id] = document.getElementById(id).value.trim();
            });

            if (!profile.fullName || !profile.email) {
                showProfileMessage('profileMessage', 'Name and email are required.', 'error');
                return;
            }

            try {
                localStorage.setItem('adminProfile', JSON.stringify(profile));
                updateOverview(profile);
                showProfileMessage('profileMessage', 'Profile updated successfully!', 'success');
            } catch (error) {
                showProfileMessage('profileMessage', 'Unable to save profile.', 'error');
            }
        });

        profileForm.addEventListener('reset', function () {
            setTimeout(() => {
                loadProfile();
                document.getElementById('profileMessage').className = 'profile-message';
            }, 0);
        });

        document.getElementById('editProfileBtn').addEventListener('click', function () {
            profileForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('fullName').focus({ preventScroll: true });
        });

        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', function () {
                const input = document.getElementById(this.dataset.target);
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fa-regular fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fa-regular fa-eye';
                }
            });
        });

        passwordForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const current = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;

            if (!current) {
                showProfileMessage('passwordMessage', 'Enter your current password.', 'error');
                return;
            }

            if (newPass.length < 8) {
                showProfileMessage('passwordMessage', 'Password must be at least 8 characters.', 'error');
                return;
            }

            if (newPass === current) {
                showProfileMessage('passwordMessage', 'New password must be different.', 'error');
                return;
            }

            if (newPass !== confirm) {
                showProfileMessage('passwordMessage', 'Passwords do not match.', 'error');
                return;
            }

            showProfileMessage(
                'passwordMessage',
                'Validation successful. Connect a backend API to change your actual password.',
                'success'
            );
            passwordForm.reset();
        });

        loadProfile();
    }

    function initializeSettingsPage() {
        const message = document.getElementById('settingsMessage');
        if (!message) return;

        const settingsFields = [
            'siteName',
            'siteEmail',
            'siteUrl',
            'timezone',
            'language',
            'darkModeSetting',
            'emailNotifications',
            'newUserAlerts',
            'securityAlerts',
            'marketingUpdates',
            'twoFactor',
            'loginAlerts'
        ];

        const checkboxFields = [
            'darkModeSetting',
            'emailNotifications',
            'newUserAlerts',
            'securityAlerts',
            'marketingUpdates',
            'twoFactor',
            'loginAlerts'
        ];

        const defaultSettings = {
            siteName: 'Admin Pro',
            siteEmail: 'admin@example.com',
            siteUrl: 'https://example.com',
            timezone: 'Asia/Dhaka',
            language: 'en',
            darkModeSetting: false,
            emailNotifications: true,
            newUserAlerts: true,
            securityAlerts: true,
            marketingUpdates: false,
            twoFactor: false,
            loginAlerts: true
        };

        function getSettings() {
            try {
                const saved = JSON.parse(localStorage.getItem('adminSettings'));
                const settings = saved && typeof saved === 'object'
                    ? { ...defaultSettings, ...saved }
                    : { ...defaultSettings };

                settings.darkModeSetting =
                    window.dashboardTheme?.getCurrent() === 'dark';

                return settings;
            } catch (error) {
                console.error('Settings loading error:', error);
                return {
                    ...defaultSettings,
                    darkModeSetting: window.dashboardTheme?.getCurrent() === 'dark'
                };
            }
        }

        function showSettingsMessage(text, type = 'success') {
            message.textContent = text;
            message.className = 'settings-message ' + type;

            window.clearTimeout(showSettingsMessage.timer);
            showSettingsMessage.timer = window.setTimeout(() => {
                message.className = 'settings-message';
                message.textContent = '';
            }, 3500);
        }

        function applyTheme(isDark) {
            if (isDark && typeof window.dashboardTheme?.setDark === 'function') {
                window.dashboardTheme.setDark();
            } else if (!isDark && typeof window.dashboardTheme?.setLight === 'function') {
                window.dashboardTheme.setLight();
            }
        }

        function loadSettings() {
            const settings = getSettings();

            settingsFields.forEach(id => {
                const field = document.getElementById(id);
                if (!field) return;

                if (checkboxFields.includes(id)) {
                    field.checked = Boolean(settings[id]);
                } else {
                    field.value = settings[id] ?? defaultSettings[id];
                }
            });
        }

        function saveSettings() {
            const settings = {};

            settingsFields.forEach(id => {
                const field = document.getElementById(id);
                if (!field) return;

                settings[id] = checkboxFields.includes(id)
                    ? field.checked
                    : field.value.trim();
            });

            if (!settings.siteName) {
                showSettingsMessage('Application name is required.', 'error');
                document.getElementById('siteName').focus();
                return;
            }

            const emailField = document.getElementById('siteEmail');
            if (!emailField.checkValidity()) {
                showSettingsMessage('Please enter a valid contact email.', 'error');
                emailField.focus();
                return;
            }

            try {
                localStorage.setItem('adminSettings', JSON.stringify(settings));
                applyTheme(settings.darkModeSetting);
                showSettingsMessage('Settings saved successfully!');
            } catch (error) {
                showSettingsMessage('Unable to save settings in this browser.', 'error');
            }
        }

        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('resetSettings').addEventListener('click', function () {
            if (!confirm('Are you sure you want to reset all settings to default?')) return;

            localStorage.removeItem('adminSettings');
            applyTheme(defaultSettings.darkModeSetting);
            loadSettings();
            showSettingsMessage('Settings restored to default successfully!');
        });

        document.getElementById('darkModeSetting').addEventListener('change', function () {
            applyTheme(this.checked);
        });

        window.addEventListener('dashboardThemeChanged', function () {
            document.getElementById('darkModeSetting').checked =
                window.dashboardTheme?.getCurrent() === 'dark';
        });

        loadSettings();
    }

    function initializeProfileMenu() {
        const toggle = document.querySelector('.profile-menu-toggle');
        const panel = document.querySelector('.profile-menu-panel');

        if (!toggle || !panel) return;

        function closeMenu() {
            panel.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function (event) {
            event.stopPropagation();
            const isOpen = panel.classList.toggle('show');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        panel.addEventListener('click', function (event) {
            const logoutLink = event.target.closest('[data-logout]');
            if (logoutLink) {
                try {
                    localStorage.removeItem('adminDemoSession');
                } catch (error) {
                    console.error('Unable to clear the demo session.', error);
                }
            }
        });

        document.addEventListener('click', function (event) {
            if (!panel.contains(event.target) && !toggle.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenu();
                toggle.focus();
            }
        });
    }

    function initializeUsersPage() {
        const form = document.getElementById('userForm');
        const tableBody = document.getElementById('usersTableBody');
        const message = document.getElementById('usersFormMessage');
        const storageMessage = document.getElementById('usersStorageMessage');
        const userIdField = document.getElementById('userId');
        const saveButton = document.getElementById('saveUserBtn');
        const cancelButton = document.getElementById('cancelUserEdit');

        if (!form || !tableBody || !message || !storageMessage) return;

        const storageKey = 'adminUsers';
        const demoUsers = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Administrator', status: 'Active' },
            { id: 2, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'Editor', status: 'Active' },
            { id: 3, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Author', status: 'Pending' },
            { id: 4, name: 'Daniel Wilson', email: 'daniel.wilson@example.com', role: 'Viewer', status: 'Inactive' }
        ];
        const validRoles = ['Administrator', 'Editor', 'Author', 'Viewer'];
        const validStatuses = ['Active', 'Pending', 'Inactive'];
        let users = demoUsers.map(user => ({ ...user }));

        function showMessage(element, text, type = '') {
            element.textContent = text;
            element.className = `users-form-message${type ? ` ${type}` : ''}`;
        }

        function escapeHTML(value) {
            return String(value).replace(/[&<>"']/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                }[char];
            });
        }

        function persist(nextUsers) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(nextUsers));
                users = nextUsers;
                renderUsers();
                return true;
            } catch (error) {
                console.error('Unable to save users in this browser.', error);
                showMessage(storageMessage, 'Changes could not be saved in this browser.', 'error');
                return false;
            }
        }

        function renderUsers() {
            document.getElementById('usersCount').textContent =
                `${users.length} user${users.length === 1 ? '' : 's'}`;

            if (!users.length) {
                tableBody.innerHTML = '<tr><td class="users-table-empty" colspan="4">No users found. Add a user using the form above.</td></tr>';
                return;
            }

            tableBody.innerHTML = users.map(user => {
                const statusClass = user.status.toLowerCase();
                return `
                    <tr>
                        <td class="users-table-person">
                            <strong>${escapeHTML(user.name)}</strong>
                            <span>${escapeHTML(user.email)}</span>
                        </td>
                        <td>${escapeHTML(user.role)}</td>
                        <td><span class="users-table-status ${statusClass}">${escapeHTML(user.status)}</span></td>
                        <td>
                            <div class="users-table-actions">
                                <button type="button" data-action="edit" data-user-id="${user.id}" aria-label="Edit ${escapeHTML(user.name)}" title="Edit user">
                                    <i class="fa-solid fa-pen" aria-hidden="true"></i>
                                </button>
                                <button type="button" data-action="delete" data-user-id="${user.id}" aria-label="Delete ${escapeHTML(user.name)}" title="Delete user">
                                    <i class="fa-solid fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        try {
            const savedUsers = localStorage.getItem(storageKey);

            if (savedUsers === null) {
                persist(users);
                showMessage(storageMessage, 'Demo users loaded. Changes are saved in this browser.');
            } else {
                const parsedUsers = JSON.parse(savedUsers);
                const isValid = Array.isArray(parsedUsers) && parsedUsers.every(user =>
                    user &&
                    Number.isSafeInteger(user.id) &&
                    typeof user.name === 'string' &&
                    typeof user.email === 'string' &&
                    validRoles.includes(user.role) &&
                    validStatuses.includes(user.status)
                );

                if (!isValid) {
                    throw new Error('Stored user data has an unexpected format.');
                }

                users = parsedUsers;
                showMessage(storageMessage, 'Changes are saved in this browser.');
            }
        } catch (error) {
            console.error('Unable to load saved users.', error);
            showMessage(storageMessage, 'Saved user data could not be loaded. Demo users are shown; changes may not persist.', 'error');
        }

        renderUsers();

        function resetForm() {
            form.reset();
            userIdField.value = '';
            saveButton.innerHTML = '<i class="fa-solid fa-user-plus" aria-hidden="true"></i> Add user';
            cancelButton.hidden = true;
            document.getElementById('userFormTitle').textContent = 'Add a user';
            showMessage(message, '');
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const isEditing = Boolean(userIdField.value);
            const id = isEditing ? Number(userIdField.value) : Date.now();
            const user = {
                id,
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                role: document.getElementById('userRole').value,
                status: document.getElementById('userStatus').value
            };

            const duplicateEmail = users.some(existing =>
                existing.email.toLowerCase() === user.email.toLowerCase() && existing.id !== id
            );

            if (duplicateEmail) {
                showMessage(message, 'A user with this email address already exists.', 'error');
                document.getElementById('userEmail').focus();
                return;
            }

            const nextUsers = userIdField.value
                ? users.map(existing => existing.id === id ? user : existing)
                : [...users, user];

            if (persist(nextUsers)) {
                resetForm();
                showMessage(message, isEditing ? 'User updated successfully.' : 'User added successfully.', 'success');
                showMessage(storageMessage, 'Changes are saved in this browser.');
            }
        });

        cancelButton.addEventListener('click', resetForm);

        tableBody.addEventListener('click', function (event) {
            const actionButton = event.target.closest('button[data-action]');
            if (!actionButton) return;

            const id = Number(actionButton.dataset.userId);
            const user = users.find(item => item.id === id);
            if (!user) return;

            if (actionButton.dataset.action === 'edit') {
                userIdField.value = String(user.id);
                document.getElementById('userName').value = user.name;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userStatus').value = user.status;
                saveButton.innerHTML = '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save changes';
                cancelButton.hidden = false;
                document.getElementById('userFormTitle').textContent = 'Edit user';
                showMessage(message, '');
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.getElementById('userName').focus({ preventScroll: true });
                return;
            }

            if (actionButton.dataset.action === 'delete' && confirm(`Delete ${user.name}?`)) {
                const nextUsers = users.filter(item => item.id !== id);
                if (persist(nextUsers)) {
                    showMessage(storageMessage, 'User deleted. Changes are saved in this browser.', 'success');
                }
            }
        });
    }

    function initializeLoginPage() {
        const form = document.getElementById('loginForm');
        const message = document.getElementById('loginMessage');
        if (!form || !message) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (email !== 'admin@example.com' || password !== 'Admin123!') {
                message.textContent = 'Email or password is incorrect. Use the demo credentials shown below.';
                return;
            }

            try {
                localStorage.setItem('adminDemoSession', 'active');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Unable to start a demo session.', error);
                message.textContent = 'Could not start a demo session in this browser.';
            }
        });
    }

    initializeProfileMenu();
    initializeUsersPage();
    initializeLoginPage();
    initializeProfilePage();
    initializeSettingsPage();

    /* =====================================
       APPLICATION READY
    ===================================== */

    document.body.classList.add('app-ready');

    console.log('Dashboard application initialized successfully!');

});
