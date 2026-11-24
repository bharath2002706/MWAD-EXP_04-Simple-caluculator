import { useEffect, useState } from 'react';
import './App.css';

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Number.parseFloat(value.toPrecision(10));
  return String(rounded);
};

function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [replaceDisplay, setReplaceDisplay] = useState(false);
  const [expression, setExpression] = useState('');

  const clear = () => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setReplaceDisplay(false);
    setExpression('');
  };

  const enterDigit = (digit) => {
    if (display === 'Error' || replaceDisplay) {
      setDisplay(digit);
      setReplaceDisplay(false);
      return;
    }
    setDisplay(display === '0' ? digit : display.length < 14 ? display + digit : display);
  };

  const enterDecimal = () => {
    if (display === 'Error' || replaceDisplay) {
      setDisplay('0.');
      setReplaceDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(`${display}.`);
    }
  };

  const calculate = (left, right, op) => {
    switch (op) {
      case '+': return left + right;
      case '−': return left - right;
      case '×': return left * right;
      case '÷': return right === 0 ? NaN : left / right;
      default: return right;
    }
  };

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') return;
    const current = Number(display);
    if (operator && !replaceDisplay) {
      const result = calculate(storedValue, current, operator);
      const formatted = formatNumber(result);
      setDisplay(formatted);
      setStoredValue(Number(formatted));
      setExpression(`${formatted} ${nextOperator}`);
    } else {
      setStoredValue(current);
      setExpression(`${display} ${nextOperator}`);
    }
    setOperator(nextOperator);
    setReplaceDisplay(true);
  };

  const equals = () => {
    if (!operator || storedValue === null || display === 'Error') return;
    const result = formatNumber(calculate(storedValue, Number(display), operator));
    setExpression(`${storedValue} ${operator} ${display} =`);
    setDisplay(result);
    setStoredValue(null);
    setOperator(null);
    setReplaceDisplay(true);
  };

  const applyAction = (action) => {
    if (/^\d$/.test(action)) return enterDigit(action);
    if (action === '.') return enterDecimal();
    if (['+', '−', '×', '÷'].includes(action)) return chooseOperator(action);
    if (action === '=') return equals();
    if (action === 'AC') return clear();
    if (action === '±') {
      if (display !== '0' && display !== 'Error') setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);
      return;
    }
    if (action === '%') {
      if (display !== 'Error') setDisplay(formatNumber(Number(display) / 100));
      return;
    }
    if (action === '⌫') {
      if (display === 'Error' || replaceDisplay) return;
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key;
      if (/^\d$/.test(key)) applyAction(key);
      else if (key === '.') applyAction('.');
      else if (key === '+') applyAction('+');
      else if (key === '-') applyAction('−');
      else if (key === '*') applyAction('×');
      else if (key === '/') { event.preventDefault(); applyAction('÷'); }
      else if (key === 'Enter' || key === '=') applyAction('=');
      else if (key === 'Backspace') applyAction('⌫');
      else if (key === 'Escape') applyAction('AC');
      else if (key === '%') applyAction('%');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const buttons = [
    { label: 'AC', style: 'utility' }, { label: '±', style: 'utility' }, { label: '%', style: 'utility' }, { label: '÷', style: 'operator' },
    { label: '7' }, { label: '8' }, { label: '9' }, { label: '×', style: 'operator' },
    { label: '4' }, { label: '5' }, { label: '6' }, { label: '−', style: 'operator' },
    { label: '1' }, { label: '2' }, { label: '3' }, { label: '+', style: 'operator' },
    { label: '⌫', style: 'utility' }, { label: '0', style: 'zero' }, { label: '.' }, { label: '=', style: 'equals' },
  ];

  return (
    <main className="page-shell">
      <section className="calculator" aria-label="Simple calculator">
        <header className="calculator-header">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></div>
          <div><p className="eyebrow">EVERYDAY TOOLS</p><h1>Calculator</h1></div>
          <span className="online-dot" aria-label="Ready" />
        </header>

        <div className="display-panel" aria-live="polite" aria-atomic="true">
          <div className="expression">{expression || ' '}</div>
          <div className={`display-value ${display.length > 10 ? 'compact' : ''}`}>{display}</div>
        </div>

        <div className="keypad">
          {buttons.map(({ label, style = '' }) => (
            <button
              key={label}
              type="button"
              className={`key ${style} ${operator === label && replaceDisplay ? 'selected' : ''}`}
              onClick={() => applyAction(label)}
              aria-label={label === '⌫' ? 'Backspace' : label === '±' ? 'Change sign' : label}
            >{label}</button>
          ))}
        </div>
        <footer className="calculator-footer"><span>Simple, by design</span><span><kbd>⌨</kbd> Keyboard supported</span></footer>
      </section>
      <p className="page-caption">A little clarity for the numbers that matter.</p>
    </main>
  );
}

export default App;
