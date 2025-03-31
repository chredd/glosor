import React, { useState, useEffect } from 'react';
import './App.css';
import { loadWords } from './services/sheets';
import Fireworks from './components/Fireworks';

interface Word {
  swedish: string;
  english: string;
  category?: string;
}

interface TranslationAttempt {
  word: Word;
  userAnswer: string;
  isCorrect: boolean;
}

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<TranslationAttempt[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [userInput, setUserInput] = useState('');

  const fetchWords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await loadWords();
      if (result.error) {
        setError(result.error);
        return;
      }
      setWords(result.words);
      setCurrentIndex(0);
      setShowAnswer(false);
      setScore(0);
      setTranslations([]);
      setShowSummary(false);
      setUserInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda orden');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = userInput.toLowerCase().trim() === words[currentIndex].english.toLowerCase().trim();
    if (isCorrect) {
      setScore(score + 1);
    }
    setTranslations(prev => [...prev, {
      word: words[currentIndex],
      userAnswer: userInput,
      isCorrect
    }]);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setUserInput('');
    
    // Check if we've completed all words
    if (currentIndex + 1 >= words.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswerFeedback = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }
    setTranslations(prev => [...prev, {
      word: words[currentIndex],
      userAnswer: '',
      isCorrect: correct
    }]);
    handleNext();
  };

  const handleShuffle = () => {
    setWords(prevWords => {
      const shuffled = [...prevWords];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore(0);
    setTranslations([]);
    setShowSummary(false);
    setUserInput('');
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
          <button onClick={fetchWords}>Försök igen</button>
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
          <button onClick={fetchWords}>Försök igen</button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const isPerfectScore = score === words.length;
    return (
      <div className="container">
        {isPerfectScore && <Fireworks />}
        <div className="summary">
          <h2>Sammanfattning</h2>
          <div className="summary-score">
            <p>Poäng denna runda: {score} av {words.length}</p>
            <p>Procent: {Math.round((score / words.length) * 100)}%</p>
            {isPerfectScore && <p className="perfect-score">Perfekt! 🎉</p>}
          </div>
          <div className="translations-list">
            {translations.map((translation, index) => (
              <div key={index} className={`translation-item ${translation.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="translation-word">
                  <span className="swedish">{translation.word.swedish}</span>
                  <span className="english">{translation.word.english}</span>
                </div>
                {translation.userAnswer && (
                  <p className="user-answer">Ditt svar: {translation.userAnswer}</p>
                )}
                {translation.word.category && <p className="category">{translation.word.category}</p>}
              </div>
            ))}
          </div>
          <div className="summary-buttons">
            <button onClick={handleShuffle}>Blanda om</button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="container">
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
            {currentIndex + 1} / {words.length}
          </span>
        </div>
      </div>
      <div className="card">
        <h2>{currentWord.swedish}</h2>
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
              <button type="submit">Kontrollera</button>
            </form>
            <div className="or-divider">
              <span>eller</span>
            </div>
            <button onClick={() => setShowAnswer(true)}>Visa svar</button>
          </div>
        )}
        {showAnswer && (
          <div className="answer">
            {userInput && (
              <div className={`user-answer ${userInput.toLowerCase().trim() === currentWord.english.toLowerCase().trim() ? 'correct' : 'incorrect'}`}>
                Ditt svar: {userInput}
              </div>
            )}
            <p className="correct-answer">{currentWord.english}</p>
            {currentWord.category && <p className="category">{currentWord.category}</p>}
            <div className="buttons">
              {userInput ? (
                <button onClick={handleNext}>
                  {currentIndex + 1 === words.length ? 'Visa sammanfattning' : 'Nästa ord'}
                </button>
              ) : (
                <>
                  <button onClick={() => handleAnswerFeedback(false)}>Fel</button>
                  <button onClick={() => handleAnswerFeedback(true)}>Rätt</button>
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
    </div>
  );
}

export default App; 