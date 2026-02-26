// pyodide-loader.js
let pyodideReady = false;
let pyodide;

async function loadPyodideAndRun() {
    if (!window.loadPyodide) {
        console.error('Pyodide not loaded');
        return;
    }
    pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });
    pyodideReady = true;
    const runBtn = document.getElementById('run-python');
    if (runBtn) runBtn.disabled = false;
}

// Загружаем при старте
if (document.getElementById('python-code')) {
    loadPyodideAndRun();
}

window.runPythonCode = async function(code) {
    if (!pyodideReady) {
        return 'Загрузка Python... Подождите.';
    }
    try {
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const output = pyodide.runPython('sys.stdout.getvalue()');
        return output;
    } catch (err) {
        return 'Ошибка: ' + err;
    }
};