import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const {
    accuracy = 0,
    wpm = 0,
    consistency = 0,
    correctChars = 0,
    incorrectChars = 0,
    extraChars = 0,
    missedChars = 0
  } = location.state || {};

  useEffect(() => {
    if (userInfo && userInfo.token) {
      const saveStats = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          await axios.put(
            "/api/users/stats",
            { wpm, accuracy },
            config
          );
        } catch (error) {
          console.error("Error saving stats:", error);
        }
      };
      saveStats();
    }
  }, [wpm, accuracy, userInfo]);

  const handleReset = () => {
    navigate("/working", {
      state: {
        resetFromLogo: true,
        defaultMode: "time",
        defaultTimeLimit: 15,
      },
    });
  };

  return (
    <div className="result-page">
      <h2>Your Typing Results</h2>
      
      <div className="main-stats">
        <div className="stat-card">
          <h3>WPM</h3>
          <p className="stat-value">{wpm}</p>
        </div>
        
        <div className="stat-card">
          <h3>Accuracy</h3>
          <p className="stat-value">{accuracy}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Consistency</h3>
          <p className="stat-value">{consistency}%</p>
        </div>
      </div>

      <div className="char-breakdown">
        <h3>Character Breakdown</h3>
        <div className="breakdown-grid">
          <div className="breakdown-item correct">
            <span>Correct</span>
            <span>{correctChars}</span>
          </div>
          <div className="breakdown-item incorrect">
            <span>Incorrect</span>
            <span>{incorrectChars}</span>
          </div>
          <div className="breakdown-item extra">
            <span>Extra</span>
            <span>{extraChars}</span>
          </div>
          <div className="breakdown-item missed">
            <span>Missed</span>
            <span>{missedChars}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="reset-btn" onClick={handleReset}>
          Try Again
        </button>
        <button 
          className="history-btn"
          onClick={() => navigate("/profile")}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default Result;