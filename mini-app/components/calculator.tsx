"use client";

import { useState, useEffect, KeyboardEvent } from "react";

const functions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  pi: () => Math.PI,
  e: () => Math.E,
  factorial: (n: number) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  },
  mod: (a: number, b: number) => a % b,
};

const operators = ["+", "-", "*", "/", "^", "%"];

function evaluate(expr: string, radian: boolean) {
  // Replace function names with Math.* equivalents
  let replaced = expr
    .replace(/pi/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/sin/g, radian ? "Math.sin" : "Math.sin")
    .replace(/cos/g, radian ? "Math.cos" : "Math.cos")
    .replace(/tan/g, radian ? "Math.tan" : "Math.tan")
    .replace(/log/g, "Math.log10")
    .replace(/ln/g, "Math.log")
    .replace(/sqrt/g, "Math.sqrt")
    .replace(/abs/g, "Math.abs")
    .replace(/factorial/g, "functions.factorial")
    .replace(/mod/g, "functions.mod");

  // Handle exponentiation
  replaced = replaced.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, "Math.pow($1,$3)");

  // Evaluate using Function constructor
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("functions", `return ${replaced}`);
    return fn(functions);
  } catch {
    return NaN;
  }
}

export default function Calculator() {
  const [mode, setMode] = useState<"standard" | "scientific">("standard");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [radian, setRadian] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleButton = (value: string) => {
    if (value === "C") {
      setExpression("");
      setResult(null);
    } else if (value === "CE") {
      setExpression(expression.slice(0, -1));
    } else if (value === "=") {
      const res = evaluate(expression, radian);
      setResult(res.toString());
      setHistory([`${expression} = ${res}`, ...history].slice(0, 10));
    } else if (value === "⌫") {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression(expression + value);
    }
  };

  const buttonsStandard = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "%", "+"],
    ["C", "CE", "⌫", "="],
  ];

  const buttonsScientific = [
    ["sin", "cos", "tan", "π"],
    ["ln", "log", "√", "x²"],
    ["n!", "mod", "(", ")"],
    ["π", "e", "x^y", "1/x"],
    ["C", "CE", "⌫", "="],
  ];

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Enter") {
      handleButton("=");
    } else if (key === "Backspace") {
      handleButton("⌫");
    } else if (key === "Delete") {
      handleButton("C");
    } else if (key === "Escape") {
      handleButton("CE");
    } else if (operators.includes(key) || key === "." || key === "%") {
      handleButton(key);
    } else if (/\d/.test(key)) {
      handleButton(key);
    }
  };

  useEffect(() => {
    // Keep expression and result when mode changes
  }, [mode]);

  return (
    <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className={`px-3 py-1 rounded ${
            mode === "standard" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
          onClick={() => setMode("standard")}
        >
          Standard
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "scientific" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
          onClick={() => setMode("scientific")}
        >
          Scientific
        </button>
        {mode === "scientific" && (
          <label className="flex items-center space-x-2">
            <span className="text-sm">Rad</span>
            <input
              type="checkbox"
              checked={radian}
              onChange={() => setRadian(!radian)}
              className="toggle toggle-sm"
            />
            <span className="text-sm">Deg</span>
          </label>
        )}
      </div>
      <div className="bg-background p-2 rounded mb-4">
        <div className="text-right text-2xl font-mono">{expression || "0"}</div>
        {result !== null && (
          <div className="text-right text-xl font-mono text-primary">{result}</div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {(mode === "standard" ? buttonsStandard : buttonsScientific).flat().map((btn) => (
          <button
            key={btn}
            className="p-2 bg-muted hover:bg-muted-foreground text-lg rounded"
            onClick={() => handleButton(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      {history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">History</h3>
          <ul className="space-y-1 text-sm">
            {history.map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
