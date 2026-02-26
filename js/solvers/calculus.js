function calculateDerivative() {
    const expr = document.getElementById('calc-expr').value;
    const variable = document.getElementById('calc-var').value || 'x';
    try {
        const deriv = nerdamer.diff(expr, variable);
        document.getElementById('calc-result').textContent = `Производная: ${deriv.toString()}`;
    } catch (e) {
        document.getElementById('calc-result').textContent = 'Ошибка в выражении';
    }
}

function calculateIntegral() {
    const expr = document.getElementById('calc-expr').value;
    const variable = document.getElementById('calc-var').value || 'x';
    try {
        const integral = nerdamer.integrate(expr, variable);
        document.getElementById('calc-result').textContent = `Интеграл: ${integral.toString()} + C`;
    } catch (e) {
        document.getElementById('calc-result').textContent = 'Ошибка в выражении';
    }
}