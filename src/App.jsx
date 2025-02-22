import { useState, useEffect, useRef } from "react";
import "animate.css/animate.min.css";

const sampleTexts = [
  "React is a JavaScript library for building user interfaces.",
  "The quick brown fox jumps over the lazy dog.",
  "Coding is an essential skill in today's digital world.",
  "JavaScript is a versatile language used in web development.",
  "Practice makes perfect, keep typing to improve your speed!",
  "Web development combines creativity and logic for amazing results."
];

function App() {
  const [sampleText, setSampleText] = useState(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  const [userInput, setUserInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState(0);
  const [mistake, setMistake] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now());
      setTimeLeft(timeLimit);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCompleted(true);
            calculateResults();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    if (userInput === sampleText) {
      calculateResults();
      setCompleted(true);
    }
  }, [userInput]);

  const handleChange = (e) => {
    if (completed) return;
    const value = e.target.value;
    setUserInput(value);
    let errors = 0;
    value.split("").forEach((char, index) => {
      if (char !== sampleText[index]) errors++;
    });
    setErrorCount(errors);
    setMistake(errors > 0 ? "You made a mistake!" : "You are on the right path!");
  };

  const calculateResults = () => {
    const timeTaken = (Date.now() - startTime) / 1000;
    setTimeTaken(timeTaken.toFixed(2));
    const wordsTyped = sampleText.split(" ").length;
    const calculatedWpm = Math.round((wordsTyped / timeTaken) * 60);
    setWpm(calculatedWpm > 0 ? calculatedWpm : 0);
    const correctChars = userInput.split("").filter((char, index) => char === sampleText[index]).length;
    setAccuracy(((correctChars / sampleText.length) * 100).toFixed(2));
  };

  const resetTest = () => {
    setSampleText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setUserInput("");
    setCompleted(false);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setTimeLeft(timeLimit);
    setMistake("");
    setErrorCount(0);
    setTimeTaken(0);
    inputRef.current.focus();
  };

  return (
    <div className={`container flex flex-col items-center justify-center min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>

      <h1 className="text-3xl font-bold mb-6 animate__animated animate__fadeInDown text-center">Typing Speed Test</h1>
      <button onClick={() => setDarkMode(!darkMode)} className="mb-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">{darkMode ? "Light Mode" : "Dark Mode"}</button>
      <div className="flex gap-4 mb-6">
        {[15, 30, 60].map((time) => (
          <button
            key={time}
            onClick={() => setTimeLimit(time)}
            className={`px-6 py-2 ${timeLimit === time ? "bg-blue-700" : "bg-blue-500"} text-white rounded hover:bg-blue-700`}
          >
            {time} sec
          </button>
        ))}
      </div>
      <div className={`w-full max-w-2xl text-center p-8 rounded shadow-2xl border animate__animated animate__fadeInUp ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}>
        <p className="text-lg font-semibold">{sampleText}</p>
      </div>
      <p className="mt-4 text-red-500 font-semibold animate__animated animate__shakeX text-center">{mistake}</p>
      <p className="mt-4 text-lg font-bold text-center">Time Left: {timeLeft}s</p>
      <progress className="w-full max-w-lg mt-4" value={userInput.length} max={sampleText.length}></progress>
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleChange}
        className={`w-full max-w-lg p-4 border rounded mt-6 text-center ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        placeholder="Start typing here..."
        disabled={completed}
      />
      {completed && (
        <div className={`mt-6 text-center p-8 rounded shadow-2xl border animate__animated animate__fadeIn w-full max-w-lg ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}>
          <h2 className="text-2xl font-bold">Test Completed!</h2>
          <p className="text-lg font-semibold mt-2">Words Per Minute (WPM): {wpm}</p>
          <p className="text-lg font-semibold">Accuracy: {accuracy}%</p>
          <p className="text-lg font-semibold">Errors Made: {errorCount}</p>
          <p className="text-lg font-semibold">Time Taken: {timeTaken}s</p>
        </div>
      )}
      <button
        onClick={resetTest}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 animate__animated animate__pulse"
      >
        Restart
      </button>
    </div>
  );
}

export default App;
