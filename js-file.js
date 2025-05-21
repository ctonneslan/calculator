
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, op) {
    if (op === '\u002B') {
        return add(a, b);
    } else if (op === '\u2212') {
        return subtract(a, b);
    } else if (op === '\u00D7') {
        return multiply(a, b);
    } else if (op === '\u00F7') {
        return divide(a, b);
    }
}

let first = '';
let second = '';
let typingSecond = false;
let operator = '';
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const topDisplay = document.querySelector('.top');
const bottomDisplay = document.querySelector('.bottom');
const plusMinusButton = document.querySelector('.negate');
const percentageButton = document.querySelector('.percent')

/* Clicking a number button */
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (typingSecond && !operator) {
            first = btn.textContent;
            typingSecond = false;
            bottomDisplay.textContent = first;
            topDisplay.textContent = second;
            return
        }
        let val = !typingSecond ? first + btn.textContent : second + btn.textContent;
        if (!typingSecond) {
            first = val;
            bottomDisplay.textContent = val;
        } else {
            second = val;
            bottomDisplay.textContent += btn.textContent;
        }
    });
});

/* Clicking an operator button */
operatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        topDisplay.textContent = '';
        operator = btn.textContent;
        bottomDisplay.textContent += btn.textContent;
        typingSecond = true;
    })
});

/* Clicking equals button */
equalsButton.addEventListener('click', () => {
    let result = round(operate(parseFloat(first) || 0, parseFloat(second) || 0, operator));
    topDisplay.textContent = `${first}${operator}${second}`;
    bottomDisplay.textContent = result;
    first = result;
    second = '';
    operator = '';
});

/* Clicking plus-minus button */
plusMinusButton.addEventListener('click', () => {
    first = round(-(parseFloat(first) || 0))
    topDisplay.textContent = '';
    bottomDisplay.textContent = first;
});

/* Clicking percentage button */
percentageButton.addEventListener('click', () => {
    first = round((parseFloat(first) || 0) / 100);
    topDisplay.textContent = '';
    bottomDisplay.textContent = first;
});

/* Clicking clear button */
clearButton.addEventListener('click', () => {
    first = '';
    second = '';
    operator = '';
    typingSecond = false;
    bottomDisplay.textContent = '0';
    topDisplay.textContent = '';
});

/* Helper function to round to a fixed point for formatting */
function round(num) {
    const [integerPart, decimalPart] = num.toString().split('.');
    if (!decimalPart || decimalPart.length <= 8) {
        return num;
    }
    return parseFloat(num.toFixed(8));
}




