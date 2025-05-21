
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
    return null;
}

let first = '';
let second = '';
let typingSecond = false;
let hasDecimal = false;
let operator = '';
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const displayContainer = document.querySelector('.display')
const topDisplay = document.querySelector('.top');
const bottomDisplay = document.querySelector('.bottom');
const plusMinusButton = document.querySelector('.negate');
const percentageButton = document.querySelector('.percent')
const decimalButton = document.querySelector('.decimal');
const deleteButton = document.querySelector('.delete');

/* Clicking a number button */
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (typingSecond && !operator) {
            first = btn.textContent;
            typingSecond = false;
            bottomDisplay.textContent = first;
            topDisplay.textContent = second;
            resizeTextToFit(bottomDisplay);
            resizeTextToFit(topDisplay);
            return
        }
        let val = !typingSecond ? first + btn.textContent : second + btn.textContent;
        if (!typingSecond) {
            first = val;
            bottomDisplay.textContent = formatNumber(parseFloat(val));
            resizeTextToFit(bottomDisplay);
        } else {
            second = val;
            bottomDisplay.textContent += btn.textContent;
            resizeTextToFit(bottomDisplay);
        }
    });
});

/* Clicking an operator button */
operatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (operator && second.length) {
            let result = formatNumber(operate(parseFloat(first) || 0, parseFloat(second) || 0, operator));
            bottomDisplay.textContent = `${result}`;
            resizeTextToFit(bottomDisplay);
            first = `${result}`;
            second = '';
        } else if (operator) {
            operator = btn.textContent;
            bottomDisplay.textContent = bottomDisplay.textContent.slice(0, -1) + btn.textContent;
            resizeTextToFit(bottomDisplay);
            return;
        }
        topDisplay.textContent = '';
        operator = btn.textContent;
        bottomDisplay.textContent += btn.textContent;
        resizeTextToFit(bottomDisplay);
        typingSecond = true;
        hasDecimal = false;
    })
});

/* Clicking equals button */
equalsButton.addEventListener('click', () => {
    if (!operator || !second.length) {
        return;
    }
    let result = formatNumber(operate(parseFloat(first) || 0, parseFloat(second) || 0, operator));
    topDisplay.textContent = `${first}${operator}${second}`;
    bottomDisplay.textContent = result;
    first = `${result}`;
    second = '';
    operator = '';
    hasDecimal = false;
    typingSecond = false;
});

/* Clicking plus-minus button */
plusMinusButton.addEventListener('click', () => {
    if (operator && !second.length) return;
    if (operator && second.length) {
        let result = -formatNumber(operate(parseFloat(first) || 0, parseFloat(second) || 0, operator));
        topDisplay.textContent = `-(${first}${operator}${second})`;
        bottomDisplay.textContent = result;
        resizeTextToFit(bottomDisplay);
        resizeTextToFit(topDisplay);
        first = `${result}`;
        second = '';
        operator = '';
        hasDecimal = false;
    } else {
        first = `${formatNumber(-(parseFloat(first) || 0))}`;
        topDisplay.textContent = '';
        bottomDisplay.textContent = first;
        resizeTextToFit(bottomDisplay);
    }
});

/* Clicking percentage button */
percentageButton.addEventListener('click', () => {
    if (operator && second.length) {
        let result = formatNumber(operate(parseFloat(first) || 0, parseFloat(second) || 0, operator) / 100);
        topDisplay.textContent = `(${first}${operator}${second})%`;
        bottomDisplay.textContent = result;
        resizeTextToFit(bottomDisplay);
        resizeTextToFit(topDisplay);
        first = `${result}`;
        second = '';
        operator = '';
        hasDecimal = true;
        return;
    }
    first = `${formatNumber((parseFloat(first) || 0) / 100)}`;
    second = '';
    topDisplay.textContent = '';
    bottomDisplay.textContent = first;
    resizeTextToFit(bottomDisplay);
    hasDecimal = true;
    typingSecond = true;
    operator = '';
});

/* Clicking clear button */
clearButton.addEventListener('click', () => {
    first = '';
    second = '';
    operator = '';
    typingSecond = false;
    hasDecimal = false;
    bottomDisplay.textContent = '0';
    topDisplay.textContent = '';
});

/* Helper function to format a number */
function formatNumber(num) {
    if (num == null || isNaN(num)) {
        return 0;
    } else if (Math.abs(num) >= 1e9 || (Math.abs(num) > 0 && Math.abs(num) < 1e-6)) {
        return num.toExponential(6);
    }
    const [integerPart, decimalPart] = num.toString().split('.');
    if (!decimalPart || decimalPart.length <= 6) {
        return num;
    }
    return parseFloat(num.toFixed(6));
}

/* Clicking decimal point button */
decimalButton.addEventListener('click', () => {
    if (hasDecimal) {
        return;
    } else if ((topDisplay.textContent) || (typingSecond && !operator)) {
        first = '.';
        second = '';
        typingSecond = false;
        bottomDisplay.textContent = first;
        resizeTextToFit(bottomDisplay);
        topDisplay.textContent = ''
    } else {
        let val = !typingSecond ? first + '.' : second + '.';
        if (!typingSecond) {
            first = val;
            bottomDisplay.textContent = val;
            resizeTextToFit(bottomDisplay);
        } else {
            second = val;
            bottomDisplay.textContent += '.';
            resizeTextToFit(bottomDisplay);
        }
    }
    hasDecimal = true;
});

/* Clicking delete button */
deleteButton.addEventListener('click', () => {
    if (topDisplay.textContent) {
        return;
    } else if (first.length && !operator) {
        if (first.at(-1) === '.') {
            hasDecimal = false;
        } 
        first = first.slice(0, -1);
        bottomDisplay.textContent = first;
        resizeTextToFit(bottomDisplay);
    } else if (operator && !second.length) {
        operator = '';
        typingSecond = false;
        bottomDisplay.textContent = bottomDisplay.textContent.slice(0, -1);
        resizeTextToFit(bottomDisplay);
    } else if (second.length) {
        if (second.at(-1) === '.') {
            hasDecimal = false;
        }
        second = second.slice(0, -1);
        bottomDisplay.textContent = bottomDisplay.textContent.slice(0, -1);
        resizeTextToFit(bottomDisplay);
    }
});

/* Resize text to fit inside display */
function resizeTextToFit(display) {
    const maxFontSize = 36;
    const minFontSize = 14;
    let fontSize = maxFontSize;

    display.style.fontSize = fontSize + 'px';
    while (display.scrollWidth > display.parentElement.clientWidth && fontSize > minFontSize) {
        fontSize -= 1;
        display.style.fontSize = fontSize + 'px';
    }
}



