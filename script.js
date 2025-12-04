document.addEventListener('DOMContentLoaded', () => {

    const display = document.querySelector('.display');
    const buttons = document.querySelector('.buttons');
    const themeToggleCheckbox = document.querySelector('#theme-toggle-checkbox');
    const modeToggleBtn = document.querySelector('#mode-toggle');

    let isDegrees = true; // Default mode: Degrees

    // --- 1. MOUSE CLICK HANDLER ---
    buttons.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const value = e.target.dataset.value;
            handleInput(value);
        }
    });

    // --- 2. KEYBOARD HANDLER ---
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // Numbers aur basic operators
        if ("0123456789/*-+.()".includes(key)) {
            handleInput(key);
        }
        // Enter = Calculate
        else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            handleInput('=');
        }
        // Backspace = Delete
        else if (key === 'Backspace') {
            handleInput('DEL');
        }
        // Escape = All Clear
        else if (key === 'Escape') {
            handleInput('AC');
        }
        // Shortcuts for scientific functions
        else if (key === 's') { handleInput('sin('); }
        else if (key === 'c') { handleInput('cos('); }
        else if (key === 't') { handleInput('tan('); }
        else if (key === 'p') { handleInput('π'); }
    });

    // --- MAIN INPUT LOGIC ---
    function handleInput(value) {
        if (!value) return;

        if (value === '=') {
            calculate();
        } else if (value === 'AC') {
            display.value = '';
        } else if (value === 'DEL') {
            display.value = display.value.slice(0, -1);
        } else {
            // Agar pehle Error likha tha, toh usay hata do
            if (display.value === 'Error') {
                display.value = '';
            }
            display.value += value;
        }
    }

    // --- CALCULATION LOGIC ---
    function calculate() {
        try {
            let expression = display.value;
            
            // Khali expression ko handle karna
            if (expression.trim() === '') return;

            // 1. Missing brackets fix karna
            const openBrackets = (expression.match(/\(/g) || []).length;
            const closeBrackets = (expression.match(/\)/g) || []).length;
            if (openBrackets > closeBrackets) {
                expression += ')'.repeat(openBrackets - closeBrackets);
            }

            // 2. Pi replace karna
            expression = expression.replace(/π/g, 'Math.PI');

            // 3. DEG/RAD Logic
            if (isDegrees) {
                // Degree mode logic: pehle angle ko radians mein convert karo
                expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
                expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
                expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
            } else {
                // Radian mode logic: direct math functions
                expression = expression.replace(/sin\(/g, 'Math.sin(');
                expression = expression.replace(/cos\(/g, 'Math.cos(');
                expression = expression.replace(/tan\(/g, 'Math.tan(');
            }

            // 4. Final Calculation
            let result = eval(expression);

            // Floating point errors fix (jaise 0.1 + 0.2)
            if (String(result).includes('.')) {
                // Maximum 10 decimal places tak dikhana, aur aakhir ke zero hatana
                result = parseFloat(result.toFixed(10));
            }

            display.value = result;

        } catch (error) {
            display.value = 'Error';
        }
    }

    // --- THEME TOGGLE (Dark/Light) ---
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // --- MODE TOGGLE (DEG/RAD) ---
    if (modeToggleBtn) {
        modeToggleBtn.addEventListener('click', () => {
            isDegrees = !isDegrees;
            modeToggleBtn.textContent = isDegrees ? 'DEG' : 'RAD';
        });
    }
});