// Применяем сохранённую тему при загрузке страницы
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme !== 'light') {
        document.body.classList.add(savedTheme);
    }
})();