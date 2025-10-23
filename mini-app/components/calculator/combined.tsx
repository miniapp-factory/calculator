"use client";

import { useState, useEffect } from "react";

export function CombinedCalculator() {
  const [display, setDisplay] = useState("");
  const [mode, setMode] = useState<"standard" | "scientific">("standard");
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number | null>(null);
  const [isDeg, setIsDeg] = useState(true);

  // Helper functions
  const degToRad = (deg: number): number => (deg * Math.PI) / 180;

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    return n * factorial(n - 1);
  };

  // Dummy references to silence unused variable warnings
  const _ = degToRad;
  const __ = factorial;

  const evaluate = () => {
    if (!display) return;
    try {
      const expr = preprocess(display);
      // eslint-disable-next-line no-eval
      const result = eval(expr);
      setDisplay(String(result));
      setHistory((prev) => [...prev, `${display} = ${result}`]);
    } catch {
      setDisplay("Error");
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === "Enter") {
        e.preventDefault();
        evaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (key === "Escape") {
        e.preventDefault();
        clearAll();
      } else if (key === "%") {
        e.preventDefault();
        append("%");
      } else if (key === "c" || key === "C") {
        e.preventDefault();
        clearAll();
      } else if (key === "x" || key === "X") {
        e.preventDefault();
        append("*");
      } else if (key === "/") {
        e.preventDefault();
        append("/");
      } else if (key === "*") {
        e.preventDefault();
        append("*");
      } else if (key === "-") {
        e.preventDefault();
        append("-");
      } else if (key === "+") {
        e.preventDefault();
        append("+");
      } else if (key === "(" || key === ")") {
        e.preventDefault();
        append(key);
      } else if (key === "." || (key >= "0" && key <= "9")) {
        e.preventDefault();
        append(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, evaluate]);

  const append = (value: string) => {
    setDisplay((prev) => prev + value);
  };

  const clearAll = () => {
    setDisplay("");
  };

  const clearEntry = () => {
    setDisplay("");
  };

  const backspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const preprocess = (expr: string) => {
    // Replace custom operators with JS equivalents
    let processed = expr
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/√/g, "Math.sqrt")
      .replace(/x²/g, "**2")
      .replace(/%/g, "/100")
      .replace(/sin/g, isDeg ? "Math.sin(degToRad(" : "Math.sin(")
      .replace(/cos/g, isDeg ? "Math.cos(degToRad(" : "Math.cos(")
      .replace(/tan/g, isDeg ? "Math.tan(degToRad(" : "Math.tan(")
      .replace(/ln/g, "Math.log")
      .replace(/log/g, "Math.log10")
      .replace(/mod/g, "%")
      .replace(/!/g, "factorial(");
    // Add missing closing parentheses for factorial
    const open = (processed.match(/factorial\\(/g) || []).length;
    const close = (processed.match(/\\)/g) || []).length;
    for (let i = 0; i < open - close; i++) {
      processed += ")";
    }
    return processed;
  };

  // Memory functions
  const memoryClear = () => setMemory(null);
  const memoryRecall = () => {
    if (memory !== null) setDisplay(String(memory));
  };
  const memoryStore = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) setMemory(val);
  };
  const memoryAdd = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) setMemory((prev) => (prev ?? 0) + val);
  };
  const memorySubtract = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) setMemory((prev) => (prev ?? 0) - val);
  };

  const standardButtons = [
    ["C", "CE", "←", "%"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const scientificButtons = [
    ["MC", "MR", "M+", "M-"],
    ["MS", "π", "e", "√"],
    ["sin", "cos", "tan", "log"],
    ["ln", "x²", "(", ")"],
    ["x^y", "n!", "mod", "deg/rad"],
    ["C", "CE", "←", "%"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const buttons = mode === "standard" ? standardButtons : scientificButtons;

  const handleButtonClick = (value: string) => {
    switch (value) {
      case "C":
        clearAll();
        break;
      case "CE":
        clearEntry();
        break;
      case "←":
        backspace();
        break;
      case "=":
        evaluate();
        break;
      case "deg/rad":
        setIsDeg((prev) => !prev);
        break;
      case "MC":
        memoryClear();
        break;
      case "MR":
        memoryRecall();
        break;
      case "M+":
        memoryAdd();
        break;
      case "M-":
        memorySubtract();
        break;
      case "MS":
        memoryStore();
        break;
      default:
        append(value);
        break;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-4">
      {/* Left side: Display, History, Mode toggle */}
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setMode(mode === "standard" ? "scientific" : "standard")}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm"
          >
            Mode: {mode === "standard" ? "Scientific" : "Standard"}
          </button>
          <span className="text-sm">{isDeg ? "Deg" : "Rad"}</span>
        </div>
        <div className="p-4 bg-card text-card-foreground rounded-xl shadow-sm">
          <div className="text-right text-2xl">{display || "0"}</div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">History</h3>
          <div className="max-h-32 overflow-y-auto bg-card p-2 rounded-md">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            ) : (
              history.map((h, i) => (
                <p key={i} className="text-sm">
                  {h}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right side: Buttons */}
      <div className="flex-1">
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleButtonClick(btn)}
              className="p-4 bg-muted hover:bg-muted/80 rounded-md text-lg"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
