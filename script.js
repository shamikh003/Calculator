document.addEventListener('DOMContentLoaded', () => {

    const display = document.querySelector('.display');
    const buttons = document.querySelector('.buttons');
    const themeToggleCheckbox = document.querySelector('#theme-toggle-checkbox');
    const modeToggleBtn = document.querySelector('#mode-toggle');

    let isDegrees = true;

    // --- 1. Mouse Click Logic ---
    buttons.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const value = e.target.dataset.value;
            handleInput(value);
        }
    });

    // --- 2. Keyboard Logic (Yahan Naya Code Hai) ---
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // Numbers aur Operators ke liye
        if ("0123456789/*-+.()".includes(key)) {
            handleInput(key);
        }
        // Enter button (Calculation ke liye)
        else if (key === 'Enter' || key === '=') {
            e.preventDefault(); // Browser ka default kaam roknay ke liye
            handleInput('=');
        }
        // Backspace (Delete ke liye)
        else if (key === 'Backspace') {
            handleInput('DEL');
        }
        // Escape (All Clear ke liye)
        else if (key === 'Escape') {
            handleInput('AC');
        }
        // Shortcuts for sin, cos, tan
        else if (key === 's') { handleInput('sin('); }
        else if (key === 'c') { handleInput('cos('); }
        else if (key === 't') { handleInput('tan('); }
        else if (key === 'p') { handleInput('π'); }
    });

    // --- Common Input Handler (Dono Mouse aur Keyboard isay use karenge) ---
    function handleInput(value) {
        if (!value) return;

        if (value === '=') {
            calculate();
        } else if (value === 'AC') {
            display.value = '';
        } else if (value === 'DEL') {
            display.value = display.value.slice(0, -1);
        } else {
            if (display.value === 'Error') {
                display.value = '';
            }
            display.value += value;
        }
    }

    // --- Calculate Function ---
    function calculate() {
        try {
            let expression = display.value;

            const openBrackets = (expression.match(/\(/g) || []).length;
            const closeBrackets = (expression.match(/\)/g) || []).length;
            if (openBrackets > closeBrackets) {
                expression += ')'.repeat(openBrackets - closeBrackets);
            }

            expression = expression.replace(/π/g, 'Math.PI');

            if (isDegrees) {
                expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
                expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
                expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
            } else {
                expression = expression.replace(/sin\(/g, 'Math.sin(');
                expression = expression.replace(/cos\(/g, 'Math.cos(');
                expression = expression.replace(/tan\(/g, 'Math.tan(');
            }

            let result = eval(expression);

            if (String(result).includes('.')) {
                result = parseFloat(result.toFixed(10));
            }

            display.value = result;

        } catch (error) {
            display.value = 'Error';
        }
    }

    // --- Toggles ---
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    if (modeToggleBtn) {
        modeToggleBtn.addEventListener('click', () => {
            isDegrees = !isDegrees;
            modeToggleBtn.textContent = isDegrees ? 'DEG' : 'RAD';
        });
    }
});