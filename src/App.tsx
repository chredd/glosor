import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchWords } from './sheets';

interface Word {
  swedish: string;
  english: string;
  category?: string;
}

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const fetchedWords = await fetchWords();
        setWords(fetchedWords);
      } catch (err) {
        setError('Kunde inte ladda orden. Försök igen senare.');
        console.error('Error loading words:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWords();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = userInput.toLowerCase().trim() === words[currentIndex].english.toLowerCase().trim();
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    setShowAnswer(false);
    setUserInput('');
  };

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Översättningsövning</h1>
        </header>
        <main>
          <div className="word-card">
            <p>Laddar ord...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Översättningsövning</h1>
        </header>
        <main>
          <div className="word-card">
            <p className="error">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Översättningsövning</h1>
        <p>Poäng: {score}</p>
      </header>
      <main>
        <div className="word-card">
          <h2>{words[currentIndex].swedish}</h2>
          {words[currentIndex].category && (
            <p className="category">{words[currentIndex].category}</p>
          )}
          {!showAnswer ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Skriv den engelska översättningen"
                autoFocus
                autoComplete="off"
              />
              <button type="submit">Kontrollera</button>
            </form>
          ) : (
            <div className="answer-section">
              <p className={userInput.toLowerCase().trim() === words[currentIndex].english.toLowerCase().trim() ? 'correct' : 'incorrect'}>
                {userInput.toLowerCase().trim() === words[currentIndex].english.toLowerCase().trim() ? 'Rätt!' : 'Fel'}
              </p>
              <p>Rätt svar är: {words[currentIndex].english}</p>
              <button onClick={handleNext}>Nästa ord</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 