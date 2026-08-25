import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import "./Mworking.css";

const Working = () => {
    const [mode, setMode] = useState("time");
    const [timeLimit, setTimeLimit] = useState(15);
    const [wordCount, setWordCount] = useState(50);
    const [punctuations, setPunctuation] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [text, setText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [size, setSize] = useState(15 * 2);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [isTimeRunning, setIsTimeRunning] = useState(false);
    const [isTestOver, setIsTestOver] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [wpm, setWPM] = useState(0);
    const [mistypedWords, setMistypedWords] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.resetFromLogo) {
            const { defaultMode, defaultTimeLimit } = location.state;

            if (defaultMode) setMode(defaultMode);
            if (defaultTimeLimit) {
                setTimeLimit(defaultTimeLimit);
                setSize(defaultTimeLimit * 2);
            }

            resetParagraph();
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    
    //Reset user input on new text
    useEffect(() => {
        setUserInput("");
    },[text]);

    useEffect(() => {
        if (mode === "time") {
            setIsTestOver(false);
            setTimeLeft(timeLimit);
            setIsTimeRunning(false);
            if (punctuations && numbers) timePuncNumText();
            else if (punctuations) timePuncText();
            else if (numbers) timeNumbersText();
            else timeText();
        }

        if (mode === "words") {
            if (punctuations && numbers) wordPuncNumText();
            else if (punctuations) wordPuncText();
            else if (numbers) wordNumbersText();
            else wordText();
        }

        if (mode === "quotes") {
            quotesText();
        }

        if (mode === "custom") {
            customText();
        }
    },[mode, timeLimit, wordCount, size, punctuations, numbers]);

    useEffect(() => {
        if ((mode === "words" || mode === "quotes" || mode === "custom") && !isTestOver) {
            const originalWords = text.trim().split(" ");
            const typedWords = userInput.trim().split(" ");
    
            // End test once all words are typed (regardless of correctness)
            if (typedWords.length >= originalWords.length) {
                const lastTypedWord = typedWords[originalWords.length - 1] || "";
                const lastOriginalWord = originalWords[originalWords.length - 1] || "";
    
                if (lastTypedWord === lastOriginalWord) {
                    setIsTestOver(true);
                    calculateResults();
                }
            }
        }
    }, [userInput, text, isTestOver, mode]);
    

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;

            if (key === " ") {
                const typedWords = userInput.split(" ");
                const currentWord = typedWords[typedWords.length - 1] || "";

                if (currentWord.length === 0) {
                    e.preventDefault();
                    return;
                }
            }

            if (!isTimeRunning && mode === "time") {
                setIsTimeRunning(true);
            }

            if (key.length === 1 && (!isTestOver || mode !== "time")) {
                setUserInput((prev) => prev + key);
            }
            else if (key === "Backspace" && (!isTestOver || mode !== "time")) {
                const typedWords = userInput.trim().split(" ");
                const originalWords = text.trim().split(" ");
                const lastWordIndex = typedWords.length - 1;
                const lastTypedWord = typedWords[lastWordIndex] || "";
                const lastOriginalWord = originalWords[lastWordIndex] || "";
                const isLastWordCorrect = lastTypedWord === lastOriginalWord;

                // Prevent backspacing if all previous words are correct
                const isDeletingCorrectWordOrBefore = () => {
                    for (let i = 0; i < lastWordIndex; i++) {
                        if (typedWords[i] !== originalWords[i]) return false;
                    }
                    return isLastWordCorrect;
                };

                if (!isDeletingCorrectWordOrBefore() && !isLastWordCorrect) {
                    setUserInput((prev) => prev.slice(0, -1));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [userInput, text]);
    

    useEffect(() => {
        if ((mode === "words" || mode === "quotes" || mode === "custom") && !isTestOver) {
            const originalWords = text.trim().split(" ");
            const typedWords = userInput.trim().split(" ");

            if (typedWords.length === originalWords.length) {
                const lastTypedWord = typedWords[typedWords.length - 1];
                const lastOriginalWord = originalWords[originalWords.length - 1];

                if (lastTypedWord === lastOriginalWord) {
                    setIsTestOver(true);
                    calculateResults();
                }
            }
        }
    }, [userInput, mode, isTestOver, text]);
        

    useEffect(() => {
        if (isTimeRunning && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }

        if (timeLeft === 0 && isTimeRunning) {
            setIsTimeRunning(false);
            setIsTestOver(true);
            calculateResults();
        }
    }, [isTimeRunning, timeLeft]);
    
    // 
    const translateToEnglish = async (text) => {
        try {
            const res = await fetch("https://libretranslate.de/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: "auto",
                    target: "en",
                    format: "text",
                }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            return data.translatedText;
        }
        catch (error) {
            console.error("Translation Error:", error);
            return text;
        }
    };
    
    // Generating Random Words
    const generateRandomWords = async (count) => {
        try {
            const res = await fetch(`https://random-word-api.vercel.app/api?words=${count}`);
            const data = await res.json();
            return data.join(" ");
        } catch (error) {
            console.error("Word API Error:", error);
            return "error loading words from API.";
        }
    };
    
    
    // Adding Punctuations in Paragraph
    const addingPunctuations = (text) => {
        const words = text.split(" ");
        let result = [];
        let sentence = [];
        let wordCounter = 0;

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            wordCounter++;
            sentence.push(word);

            if (wordCounter % Math.floor(Math.random() * 3 + 7) === 0 && i !== words.length - 1) {
                sentence[sentence.length - 1] += ",";
            }

            if (wordCounter >= Math.floor(Math.random() * 5 + 10) || i === words.length - 1) {
                let lastIndex = sentence.length - 1;
                const endPunctuations = [".", "!", "?"];
                sentence[lastIndex] += endPunctuations[Math.floor(Math.random() * endPunctuations.length)];

                result.push(sentence.join(" "));
                sentence = [];
                wordCounter = 0;
            }
        }

        return result.join(" ");
    };
    
    
    // Adding Numbers in Paragraph
    const addingNumbers = (text) => {
        const words = text.split(" ");
        const result = [];

        words.forEach((word, index) => {
            result.push(word);

            // Randomly inserting number
            if (index % Math.floor(Math.random() * 3 + 6) === 0 && index !== 0) {
                const number = Math.floor(Math.random() * 100000);
                result.push(number.toString());
            }
        });
        return result.join(" ");
    };
    

    // Time Mode Options
    const timeText = async () => {
        const words = await generateRandomWords(size);
        const translated = await translateToEnglish(words);
        setText(translated);
    };
    const timePuncText = async () => {
        const words = await generateRandomWords(size);
        const withPunc = addingPunctuations(words);
        const translated = await translateToEnglish(withPunc);
        setText(translated);
    };
    const timeNumbersText = async () => {
        const words = await generateRandomWords(size);
        const withNums = addingNumbers(words);
        const translated = await translateToEnglish(withNums);
        setText(translated);
    };
    const timePuncNumText = async () => {
        const words = await generateRandomWords(size);
        const withPunc = addingPunctuations(words);
        const withNums = addingNumbers(withPunc);
        const translated = await translateToEnglish(withNums);
        setText(translated);
    };

    // Word Mode Options
    const wordText = async () => {
        const words = await generateRandomWords(wordCount);
        const translated = await translateToEnglish(words);
        setText(translated);
    };
    const wordPuncText = async () => {
        const words = await generateRandomWords(wordCount);
        const withPunc = addingPunctuations(words);
        const translated = await translateToEnglish(withPunc);
        setText(translated);
    };
    const wordNumbersText = async () => {
        const words = await generateRandomWords(wordCount);
        const withNums = addingNumbers(words);
        const translated = await translateToEnglish(withNums);
        setText(translated);
    };
    const wordPuncNumText = async () => {
        const words = await generateRandomWords(wordCount);
        const withPunc = addingPunctuations(words);
        const withNums = addingNumbers(withPunc);
        const translated = await translateToEnglish(withNums);
        setText(translated);
    };

    // Quote Mode Options
    const quotesText = async () => {
        try {
            const res = await fetch("https://type.fit/api/quotes");
            const data = await res.json();
            const randomQuote = data[Math.floor(Math.random() * data.length)];
            const translated = await translateToEnglish(randomQuote.text);
            setText(translated);
        }
        catch (err) {
            setText("Failed to load quote.");
        }
    };

    // Custom Mode
    const customText = () =>{
        const fixed = "The quick brown fox jumps over the lazy dog.";
        setText(fixed);
    }

    const resetParagraph = () => {
        setIsTestOver(false);
        setUserInput("");
        setTimeLeft(timeLimit);
        setShowResult(false);

        // Reset new paragraph based on selected mode
        if (mode === "time") {
            if (punctuations && numbers) timePuncNumText();
            else if (punctuations) timePuncText();
            else if (numbers) timeNumbersText();
            else timeText();
        }

        if (mode === "words") {
            if (punctuations && numbers) wordPuncNumText();
            else if (punctuations) wordPuncText();
            else if (numbers) wordNumbersText();
            else wordText();
        }

        if (mode === "quotes") {
            quotesText();
        }

        if (mode === "custom") {
            customText();
        }
    };
    

    // Results
    const calculateResults = () => {
        const originalWords = text.trim().split(" ");
        const typedWords = userInput.trim().split(" ");

        let correctChars = 0;
        let incorrectChars = 0;
        let extraChars = 0;
        let missedChars = 0;
        let fullyCorrectWords = 0;

        const maxWords = typedWords.length; 
        for (let i = 0; i < maxWords; i++) {
            const original = originalWords[i] || "";
            const typed = typedWords[i] || "";

            // Count fully correct words for consistency
            if (typed === original) {
                fullyCorrectWords++;
            }

            const maxLength = Math.max(original.length, typed.length);

            for (let j = 0; j < maxLength; j++) {
                const oChar = original[j];
                const tChar = typed[j];

                if (tChar && oChar) {
                    if (tChar === oChar) correctChars++;
                    else incorrectChars++;
                } else if (tChar && !oChar) {
                    extraChars++;
                } else if (!tChar && oChar) {
                    missedChars++;
                }
            }
        }

        const totalTyped = correctChars + incorrectChars + extraChars;
        const accPercent = totalTyped === 0 ? 0 : Math.round((correctChars / totalTyped) * 100);
        const consistency = typedWords.length === 0 ? 0 : Math.round((fullyCorrectWords / typedWords.length) * 100);
        const calculatedWPM = Math.round((correctChars / 5) / (timeLimit / 60));

        navigate("/result", {
            state: {
                accuracy: accPercent,
                consistency,
                wpm: calculatedWPM,
                correctChars,
                incorrectChars,
                extraChars,
                missedChars
            }
        });
    };

    return (
        <div className="Mdiv">
            <Header
                mode={mode}
                setMode={setMode}
                setSize={setSize}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
                setWordCount={setWordCount}
                punctuations={punctuations}
                setPunctuation={setPunctuation}
                numbers={numbers}
                setNumbers={setNumbers}
            />

            <h1>Typing Test</h1>
            
            {mode === "time" && (
                <div className="timer">
                    <h2>{timeLeft}</h2>
                </div>
            )}
            {isTestOver && mode === "time" && (
                <div className="times-up">
                    
                </div>
            )}

            <div className="text-box">
                {text.split(" ").map((word, wordIndex) => {
                    const typedWords = userInput.trim().split(" ");
                    const typedWord = typedWords[wordIndex] || "";
                    const maxExtraLetters = 10;
                    return (
                        <span key={wordIndex} style={{ marginRight: "8px" }}>
                            {word.split("").map((char, charIndex) => {
                                const typedChar = typedWord[charIndex];
                                let className = "pending";
                                if (typedChar !== undefined) {
                                    className = typedChar === char ? "correct" : "incorrect";
                                }
                                return (
                                    <span key={charIndex} className={className}>
                                        {char}
                                    </span>
                                );
                            })}
                            {/* Show extra characters typed within the word */}
                            {typedWord.length > word.length &&
                                [...typedWord.slice(word.length).slice(0, maxExtraLetters)].map((extraChar, i) => (
                                    <span key={`extra-${wordIndex}-${i}`} className="extra">
                                        {extraChar}
                                    </span>
                                ))}

                            <span> </span>
                        </span>
                    );
                })}
            </div>

            <div className="reset-btn-container">
                <button onClick={resetParagraph} className="reset-btn">
                    ↻
                </button>
            </div>

        </div> //Main Div
    );
};
export default Working;