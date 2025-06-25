import { useState, useRef, useEffect } from "react";

function TypingBoxV2() {
  // === State variables to track input, time, performance ===
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null); // For focusing input on reset

  const testSentence = "The quick brown fox jumps over the lazy dog";
  const isComplete = input === testSentence; 

  // === Reset handler ===
  const handleReset = () => {
    setInput("");            // Clears the text input
    setStartTime(null);      // Resets timer
    setWpm(0);               // Resets WPM display
    setAccuracy(100);        // Resets accuracy to 100%
    inputRef.current?.focus(); // Refocus the input box
  };

  // === Input change handler ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (startTime === null && value.length === 1) {
      setStartTime(Date.now());  // Start timer on first keypress
    }

    setInput(value); // Update state with current input
  };

  // === Effect to calculate WPM and Accuracy whenever input changes ===
  useEffect(() => {
    if (!startTime) return;

    const now = Date.now();
    const minutes = (now - startTime) / 1000 / 60;

    const wordsTyped = input.length / 5;
    const newWpm = Math.round(wordsTyped / minutes);

    let correct = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === testSentence[i]) correct++;
    }

    const acc = input.length === 0 ? 100 : Math.round((correct / input.length) * 100);

    setWpm(newWpm);
    setAccuracy(acc);
  }, [input, startTime]);

  // === Render Section ===
  return (
    <div>
      <h2>Typing Test</h2>

      <p>
        {testSentence.split("").map((char, idx) => {
          let color = "gray";
          if (idx < input.length) {
            color = input[idx] === char ? "green" : "red";
          }

          return (
            <span key={idx} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Start typing..."
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          marginTop: "1rem",
        }}
        disabled={isComplete}
      />

      <div style={{ marginTop: "1rem" }}>
        <p>WPM: {wpm}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>

      <button onClick={handleReset} style={{ marginTop: "1rem" }}>
        Reset
      </button>
    </div>
  );
}

export default TypingBoxV2;
