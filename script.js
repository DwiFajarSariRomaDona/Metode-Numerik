// Function to parse input string into array of numbers
function parseInput(input) {
    return input.split(',').map(Number);
}

// Function to compute forward Newton-Gregory difference table
function newtonGregoryForward(x, y) {
    let n = y.length;
    let diff = Array.from(Array(n), () => Array(n).fill(0));
    
    // Initialize the first column with y values
    for (let i = 0; i < n; i++) {
        diff[i][0] = y[i];
    }
    
    // Compute the rest of the difference table
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diff[i][j] = diff[i + 1][j - 1] - diff[i][j - 1];
        }
    }
    
    return diff;
}

// Function to evaluate Newton-Gregory forward interpolation
function evaluateNewtonGregory(x, diff, value) {
    let n = diff.length;
    let result = diff[0][0];
    let product = 1.0;
    
    for (let i = 1; i < n; i++) {
        product *= (value - x[i - 1]);
        result += diff[0][i] * product / factorial(i);
    }
    
    return result;
}

// Function to compute backward Newton-Gregory difference table
function newtonGregoryBackward(x, y) {
    let n = y.length;
    let diff = Array.from(Array(n), () => Array(n).fill(0));
    
    // Initialize the first column with y values
    for (let i = 0; i < n; i++) {
        diff[i][0] = y[i];
    }
    
    // Compute the rest of the difference table
    for (let j = 1; j < n; j++) {
        for (let i = n - 1; i >= j; i--) {
            diff[i][j] = diff[i][j - 1] - diff[i - 1][j - 1];
        }
    }
    
    return diff;
}

// Function to evaluate Newton-Gregory backward interpolation
function evaluateNewtonGregoryBackward(x, diff, value) {
    let n = diff.length;
    let result = diff[n - 1][0];
    let product = 1.0;
    
    for (let i = 1; i < n; i++) {
        product *= (value - x[n - i]);
        result += diff[n - 1][i] * product / factorial(i);
    }
    
    return result;
}

// Function to compute factorial
function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}

// Function to compute linear regression
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

// Function to format number output
function formatNumber(num) {
    return num % 1 === 0 ? num.toString() : num.toFixed(5).replace(/\.?0+$/, '');
}

// Function to create HTML table for difference table
function createTable(diff, id, title, x) {
    let table = `<h3>${title}</h3><table class="table table-bordered"><thead><tr><th>X</th><th>f(X)</th><th>Af</th><th>Δ² f</th><th>Δ³ f</th></tr></thead><tbody>`;

    for (let i = 0; i < diff.length; i++) {
        table += `<tr><td>${x[i]}</td><td>${diff[i][0]}</td><td>${diff[i][1] || ''}</td><td>${diff[i][2] || ''}</td><td>${diff[i][3] || ''}</td></tr>`;
    }

    table += '</tbody></table>';
    document.getElementById(id).innerHTML = table;
}

// Function to handle button click event for calculating Newton-Gregory forward interpolation
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
    
    document.getElementById('resultNG').innerText = `Hasil interpolasi maju untuk x = ${value}: ${formatNumber(result)}`;
    createTable(diff, 'tableNG', 'Tabel Beda Maju', x);
}

// Function to handle button click event for calculating Newton-Gregory backward interpolation
function calculateNewtonGregoryBackward() {
    let x = parseInput(document.getElementById('xValues').value);
    let y = parseInput(document.getElementById('yValues').value);
    let value = parseFloat(document.getElementById('interpolationValue').value);

    if (x.length !== y.length) {
        alert("Jumlah x dan y harus sama.");
        return;
    }

    let diff = newtonGregoryBackward(x, y);
    let result = evaluateNewtonGregoryBackward(x, diff, value);
    
    document.getElementById('resultNGB').innerText = `Hasil interpolasi mundur untuk x = ${value}: ${formatNumber(result)}`;
    createTable(diff, 'tableNGB', 'Tabel Beda Mundur', x);
}

// Function to handle button click event for calculating linear regression
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

// Event listeners for the buttons
document.getElementById('calculateNG').addEventListener('click', calculateNewtonGregory);
document.getElementById('calculateNGB').addEventListener('click', calculateNewtonGregoryBackward);
document.getElementById('calculateLR').addEventListener('click', calculateLinearRegression);
