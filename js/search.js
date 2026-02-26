async function loadAllTheory() {
    const sections = ['discrete', 'calculus', 'programming', 'english', 'history'];
    const allTopics = [];

    for (const section of sections) {
        try {
            const response = await fetch(`data/theory/${section}.json`);
            const data = await response.json();
            data.topics.forEach(topic => {
                topic.section = section;
                const sectionNames = {
                    discrete: 'Дискретная математика',
                    calculus: 'Математический анализ',
                    programming: 'Программирование',
                    english: 'Английский язык',
                    history: 'История России'
                };
                topic.sectionName = sectionNames[section] || section;
                allTopics.push(topic);
            });
        } catch (e) {
            console.warn(`Не удалось загрузить раздел ${section}`);
        }
    }
    return allTopics;
}

function searchTopics(topics, query) {
    query = query.toLowerCase();
    return topics.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query) ||
        (topic.keywords && topic.keywords.some(kw => kw.toLowerCase().includes(query)))
    );
}

function displayResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;
    if (results.length === 0) {
        container.innerHTML = '<p>Ничего не найдено</p>';
        return;
    }

    container.innerHTML = results.map(topic => `
        <div class="result-card">
            <h4>${topic.title}</h4>
            <p>${topic.content.substring(0, 200)}...</p>
            <div class="result-meta">Раздел: ${topic.sectionName}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const topics = await loadAllTheory();
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            displayResults([]);
            return;
        }
        const results = searchTopics(topics, query);
        displayResults(results);
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Если есть параметр q в URL (из OCR)
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        searchInput.value = q;
        performSearch();
    }
});