import React, { useState } from "react";
import "./App.css";
import StarRain from "./components/StarRain";
import SpeechButton from "./components/SpeechButton";
import { useWords, TranslationAttempt } from "./hooks/useWords";
import { useSpeech } from "./services/useSpeech";

function App() {
  const {
    words,
    currentWord,
    currentIndex,
    showAnswer,
    setShowAnswer,
    score,
    isLoading,
    error,
    translations,
    showSummary,
    progress,
    totalWords,
    handleNext,
    handleShuffle,
  } = useWords();

  const [userInput, setUserInput] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const { speak } = useSpeech();

  // Auto speak effects
  React.useEffect(() => {
    if (autoSpeak && words.length > 0 && currentWord) {
      speak(currentWord.swedish, "sv-SE");
    }
  }, [currentIndex, words, autoSpeak, currentWord, speak]);

  React.useEffect(() => {
    if (autoSpeak && showAnswer && currentWord) {
      speak(currentWord.english, "en-GB");
    }
  }, [showAnswer, currentWord, autoSpeak, speak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAnswer(true);
  };

  const handleNextWord = () => {
    const isCorrect =
      userInput.toLowerCase().trim() ===
      currentWord?.english.toLowerCase().trim();
    handleNext(userInput, isCorrect);
    setUserInput("");
  };

  const handleAnswerFeedback = (correct: boolean) => {
    handleNext("", correct);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Laddar ord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h2>Fel</h2>
          <p>{error}</p>
          <button onClick={() => handleNext("", false)}>Försök igen</button>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="container">
        <div className="error">
          <h2>Inga ord tillgängliga</h2>
          <p>Kontrollera kalkylbladet och försök igen.</p>
          <button onClick={() => handleNext("", false)}>Försök igen</button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const isPerfectScore = score === totalWords;
    return (
      <div className="container">
        {isPerfectScore && <StarRain />}
        <div className="summary">
          <h2>Sammanfattning</h2>
          <div className="summary-score">
            <p>
              Poäng denna runda: {score} av {totalWords}
            </p>
            <p>Procent: {Math.round((score / totalWords) * 100)}%</p>
            {isPerfectScore && <p className="perfect-score">Perfekt! 🎉</p>}
          </div>
          <div className="translations-list">
            {translations.map((translation, index) => (
              <TranslationItem key={index} translation={translation} />
            ))}
          </div>
          <div className="summary-buttons">
            <button onClick={handleShuffle}>Börja om</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>Pys glosor</h1>
      </header>
      <div className="header">
        <div className="score">Poäng: {score}</div>
        <div className="progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {currentIndex + 1} / {totalWords}
          </span>
        </div>
      </div>
      <div className="card">
        <h2>
          {currentWord?.swedish}
          <SpeechButton text={currentWord?.swedish || ""} language="sv-SE" />
        </h2>
        {!showAnswer && (
          <div className="input-section">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Skriv den engelska översättningen"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                inputMode="text"
                name="translation"
                data-lpignore="true"
                data-form-type="other"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
              />
              <button type="submit">Rätta</button>
            </form>
            <div className="or-divider">
              <span>eller</span>
            </div>
            <button onClick={() => setShowAnswer(true)}>Visa svar</button>
          </div>
        )}
        {showAnswer && currentWord && (
          <div className="answer">
            {userInput && (
              <div
                className={`user-answer ${
                  userInput.toLowerCase().trim() ===
                  currentWord.english.toLowerCase().trim()
                    ? "correct"
                    : "incorrect"
                }`}
              >
                Ditt svar: {userInput}
              </div>
            )}
            <div className="correct-answer">
              {currentWord.english}
              <SpeechButton text={currentWord.english} language="en-GB" />
            </div>
            {currentWord.category && (
              <p className="category">{currentWord.category}</p>
            )}
            <div className="buttons">
              {userInput ? (
                <button onClick={handleNextWord}>
                  {currentIndex + 1 === totalWords
                    ? "Visa sammanfattning"
                    : "Nästa ord"}
                </button>
              ) : (
                <>
                  <button onClick={() => handleAnswerFeedback(false)}>
                    Fel
                  </button>
                  <button onClick={() => handleAnswerFeedback(true)}>
                    Rätt
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {currentIndex === 0 && !showAnswer && (
        <button className="shuffle-button" onClick={handleShuffle}>
          Blanda ord
        </button>
      )}
      <div className="settings">
        <label className="auto-speak-label">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
          />
          Läs upp ord automatiskt
        </label>
      </div>
    </div>
  );
}

// Extracted component for translation items in the summary
function TranslationItem({ translation }: { translation: TranslationAttempt }) {
  // Show words where you typed an answer
  if (translation.userAnswer) {
    return (
      <div
        className={`translation-item ${
          translation.isCorrect ? "correct" : "incorrect"
        }`}
      >
        <div className="translation-word">
          <span className="swedish">{translation.word.swedish}</span>
          <span className="english">{translation.word.english}</span>
        </div>
        <p className="user-answer">Ditt svar: {translation.userAnswer}</p>
        {translation.word.category && (
          <p className="category">{translation.word.category}</p>
        )}
      </div>
    );
  }
  // Show words where you chose Right/Wrong
  return (
    <div
      className={`translation-item ${
        translation.isCorrect ? "correct" : "incorrect"
      }`}
    >
      <div className="translation-word">
        <span className="swedish">{translation.word.swedish}</span>
        <span className="english">{translation.word.english}</span>
      </div>
      {translation.word.category && (
        <p className="category">{translation.word.category}</p>
      )}
    </div>
  );
}

export default App;
