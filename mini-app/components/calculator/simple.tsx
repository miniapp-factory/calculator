"use client";

import { useState } from "react";

export function SimpleCalculator() {
  const [display, setDisplay] = useState("");

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setDisplay("");
    } else if (value === "=") {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(display);
        setDisplay(String(result));
      } catch {
        setDisplay("Error");
      }
    } else {
      setDisplay(display + value);
    }
  };

  const buttons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "C", "+"],
    ["="],
  ];

  return (
    <div className="w-full max-w-xs">
      <div className="mb-4 p-4 bg-card text-card-foreground rounded-xl shadow-sm">
        <div className="text-right text-2xl">{display || "0"}</div>
      </div>
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
  );
}
