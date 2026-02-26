// favorites.js
function addFavorite(section, title, content, sectionName) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Проверяем, есть ли уже такая тема (по названию и разделу)
    const exists = favorites.some(f => f.section === section && f.title === title);
    if (!exists) {
        const newItem = {
            id: Date.now() + Math.random(),
            section,
            title,
            content,
            sectionName,
            comment: ''
        };
        favorites.push(newItem);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('✅ Тема добавлена в избранное!');
    } else {
        alert('ℹ️ Эта тема уже в избранном');
    }
}

function removeFavorite(id, section) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => !(f.id == id && f.section === section));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Если мы на странице избранного, перезагружаем список
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
}

function loadFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        container.innerHTML = '<p>У вас пока нет избранных тем. Добавляйте их на страницах разделов, нажимая на звёздочку.</p>';
        return;
    }
    container.innerHTML = favorites.map((item, index) => `
        <div class="result-card" data-id="${item.id}" data-section="${item.section}">
            <h4>${item.title}</h4>
            <p>${item.content.substring(0, 200)}...</p>
            <div class="result-meta">Раздел: ${item.sectionName || item.section}</div>
            <textarea placeholder="Ваш комментарий..." class="favorite-comment" data-index="${index}" rows="2">${item.comment || ''}</textarea>
            <button class="remove-favorite" data-id="${item.id}" data-section="${item.section}">Удалить</button>
        </div>
    `).join('');

    // Сохранение комментариев
    document.querySelectorAll('.favorite-comment').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites[index].comment = e.target.value;
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

    // Удаление
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const section = e.target.dataset.section;
            removeFavorite(id, section);
        });
    });
}

// Автоматическая загрузка на странице избранного
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
});