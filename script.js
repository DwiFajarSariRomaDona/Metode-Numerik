function parseInput(input) {
    return input.split(',').map(Number);
}

function newtonGregoryForward(x, y) {
    let n = y.length;
    let diff = Array.from(Array(n), () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        diff[i][0] = y[i];
    }
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diff[i][j] = diff[i + 1][j - 1] - diff[i][j - 1];
        }
    }
    return diff[0];
}

function evaluateNewtonGregory(x, diff, value) {
    let n = diff.length;
    let result = diff[0];
    let product = 1.0;
    for (let i = 1; i < n; i++) {
        product *= (value - x[i - 1]);
        result += diff[i] * product / factorial(i);
    }
    return result;
}

function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}

function linearRegression(x, y) {
    let n = x.length;
    let x_mean = x.reduce((a, b) => a + b, 0) / n;
    let y_mean = y.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
        num += (x[i] - x_mean) * (y[i] - y_mean);
        den += (x[i] - x_mean) ** 2;
    }
    let b1 = num / den;
    let b0 = y_mean - b1 * x_mean;
    return { b0, b1 };
}

function formatNumber(num) {
    return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
}

function calculateNewtonGregory() {
    let x = parseInput(document.getElementById('xValues').value);
    let y = parseInput(document.getElementById('yValues').value);
    let value = parseFloat(document.getElementById('interpolationValue').value);

    if (x.length !== y.length) {
        alert("Jumlah x dan y harus sama.");
        return;
    }

    let diff = newtonGregoryForward(x, y);
    let result = evaluateNewtonGregory(x, diff, value);
    document.getElementById('resultNG').innerText = `Hasil interpolasi: ${formatNumber(result)}`;
}

function calculateLinearRegression() {
    let x = parseInput(document.getElementById('xValues').value);
    let y = parseInput(document.getElementById('yValues').value);

    if (x.length !== y.length) {
        alert("Jumlah x dan y harus sama.");
        return;
    }

    let { b0, b1 } = linearRegression(x, y);
    document.getElementById('resultLR').innerText = `Persamaan regresi: y = ${formatNumber(b1)}x + ${formatNumber(b0)}`;
}
