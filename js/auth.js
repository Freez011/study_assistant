async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const publicPages = ['index.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (!publicPages.includes(currentPage) && !currentUser) {
        window.location.href = 'index.html';
    }
}

checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    if (!loginForm) return;

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;

        if (password !== confirm) {
            registerError.textContent = 'Пароли не совпадают';
            return;
        }

        const users = getUsers();
        if (users.find(u => u.login === username)) {
            registerError.textContent = 'Пользователь уже существует';
            return;
        }

        const hash = await hashPassword(password);
        users.push({ login: username, passwordHash: hash });
        saveUsers(users);
        registerError.textContent = '';
        alert('Регистрация успешна! Теперь войдите.');
        loginTab.click();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const users = getUsers();
        const user = users.find(u => u.login === username);
        if (!user) {
            loginError.textContent = 'Пользователь не найден';
            return;
        }

        const hash = await hashPassword(password);
        if (user.passwordHash !== hash) {
            loginError.textContent = 'Неверный пароль';
            return;
        }

        localStorage.setItem('currentUser', username);
        window.location.href = 'dashboard.html';
    });
});