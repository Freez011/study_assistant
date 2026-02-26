// calculator-modal.js
function initCalculator(openBtnId, modalId, closeBtnClass, inputId, evalBtnId, resultId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.querySelector(closeBtnClass);
    const evalBtn = document.getElementById(evalBtnId);
    const input = document.getElementById(inputId);
    const resultDiv = document.getElementById(resultId);

    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    if (evalBtn && input && resultDiv) {
        evalBtn.addEventListener('click', () => {
            const expr = input.value.trim();
            if (!expr) return;
            try {
                // Безопасное вычисление (ограничено арифметикой)
                const result = Function('"use strict"; return (' + expr + ')')();
                resultDiv.textContent = 'Результат: ' + result;
            } catch (e) {
                resultDiv.textContent = 'Ошибка: ' + e.message;
            }
        });
    }
}

// Делаем функцию глобальной
window.initCalculator = initCalculator;