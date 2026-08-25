import "./Header.css";

const Header = ({ mode, setMode, setSize, setWordCount, punctuations, timeLimit, setTimeLimit,  setPunctuation, numbers, setNumbers }) => {
    return (
        <div className="middle-container">
            <div className="full-row">
                {/* Left side */}
                {(mode === "time" || mode === "words") && (
                <div className="left-group">
                    <span className={`option ${punctuations ? "active" : ""}`} onClick={() => setPunctuation(!punctuations)}>
                        Punctuation
                    </span>
                    <span className={`option ${numbers ? "active" : ""}`} onClick={() => setNumbers(!numbers)}>
                        Numbers
                    </span>
                </div>
                )}

                {/* Center */}
                <div className="center-group">
                    <span className={`option ${mode === "time" ? "active" : ""}`} onClick={() => setMode("time")}>Time</span>
                    <span className={`option ${mode === "words" ? "active" : ""}`} onClick={() => setMode("words")}>Words</span>
                    <span className={`option ${mode === "quotes" ? "active" : ""}`} onClick={() => setMode("quotes")}>Quotes</span>
                    <span className={`option ${mode === "custom" ? "active" : ""}`} onClick={() => setMode("custom")}>Custom</span>
                </div>

                {/* Right side */}
                <div className="right-group">
                    {mode === "time" && [15, 20, 30, 40].map(num => (
                        <span
                            key={num}
                            className={`option ${num === timeLimit ? "active" : ""}`}
                            onClick={() => {
                                setTimeLimit(num);  // Set the time limit
                                setSize(num * 2);   // Set the word count to double the time
                            }}
                        >
                            {num}
                        </span>
                    ))}

                    {mode === "words" && [10, 25, 50, 100].map(num => (
                        <span key={num} className="option" onClick={() => setWordCount(num)}>{num}</span>
                    ))}

                    
                </div>
            </div>
        </div>
    );
};
export default Header;