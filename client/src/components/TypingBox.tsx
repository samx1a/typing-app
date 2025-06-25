import { useEffect, useState } from "react";

const testSentence = "the quick brown fox jumps over the lazy dog";

function TypingBox() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Start timer on first keypress
    if (startTime === null && value.length === 1) {
      setStartTime(Date.now());
    }

    setInput(value);
  };

  // Calculate WPM and Accuracy whenever input changes
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
      />

      <div style={{ marginTop: "1rem" }}>
        <p>WPM: {wpm}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>
    </div>
  );
}

export default TypingBox;
