// Открываем (или создаём) базу данных IndexedDB
const DB_NAME = 'StudyNotes';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Создаём хранилище для изображений с автогенерацией ключа
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

// Сохранить изображение в БД
async function saveImage(file, caption = '') {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result; // Это DataURL (base64)
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const imageData = {
                dataUrl: dataUrl,
                name: file.name,
                caption: caption || file.name,
                timestamp: Date.now(),
                size: file.size,
                type: file.type
            };
            const request = store.add(imageData);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

// Получить все изображения
function getAllImages() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (err) => reject(err);
    });
}

// Удалить изображение по id
function deleteImage(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (err) => reject(err);
    });
}

// Отобразить галерею
async function displayGallery() {
    const gallery = document.getElementById('gallery');
    try {
        const images = await getAllImages();
        if (images.length === 0) {
            gallery.innerHTML = '<p>У вас пока нет сохранённых конспектов. Загрузите первый!</p>';
            return;
        }
        // Сортируем по времени (новые сверху)
        images.sort((a, b) => b.timestamp - a.timestamp);
        gallery.innerHTML = images.map(img => `
            <div class="gallery-item" data-id="${img.id}">
                <img src="${img.dataUrl}" alt="${img.name}" onclick="openModal('${img.dataUrl}', '${img.caption}')">
                <div class="caption">${img.caption}</div>
                <button class="delete-btn" onclick="deleteImageHandler(event, ${img.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    } catch (error) {
        gallery.innerHTML = '<p>Ошибка загрузки конспектов.</p>';
        console.error(error);
    }
}

// Обработчик удаления
window.deleteImageHandler = async (event, id) => {
    event.stopPropagation();
    if (confirm('Удалить этот конспект?')) {
        try {
            await deleteImage(id);
            await displayGallery(); // обновить галерею
        } catch (error) {
            alert('Не удалось удалить');
            console.error(error);
        }
    }
};

// Открыть модальное окно
window.openModal = (src, caption) => {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('modal-caption');
    modal.style.display = 'block';
    modalImg.src = src;
    captionText.textContent = caption;
};

// Закрыть модальное окно
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };
});

// Загрузка файлов
document.addEventListener('DOMContentLoaded', async () => {
    await openDB();
    await displayGallery();

    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });

    uploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFiles(files);
        }
    });

    fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            await handleFiles(e.target.files);
        }
    });

    async function handleFiles(files) {
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                // Можно спросить подпись, но для простоты используем имя файла
                const caption = prompt('Введите название для этого конспекта (или оставьте имя файла):', file.name);
                await saveImage(file, caption || file.name);
            }
        }
        await displayGallery(); // обновляем галерею
    }
});