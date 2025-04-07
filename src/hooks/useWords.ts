import { useState, useEffect, useCallback } from 'react';
import { loadWords } from '../services/sheets';

export interface Word {
  swedish: string;
  english: string;
  category?: string;
}

export interface TranslationAttempt {
  word: Word;
  userAnswer: string;
  isCorrect: boolean;
}

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<TranslationAttempt[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const fetchWords = useCallback(async (sheetName: string = 'Sheet1') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await loadWords(sheetName);
      if (result.error) {
        setError(result.error);
        return;
      }
      setWords(result.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda orden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleNext = useCallback((userAnswer: string, isCorrect: boolean) => {
    // Add current attempt to translations
    setTranslations(prev => [...prev, {
      word: words[currentIndex],
      userAnswer,
      isCorrect
    }]);
    
    // Update score if correct
    if (isCorrect) {
      setScore(score => score + 1);
    }
    
    setShowAnswer(false);
    
    // Check if we've completed all words
    if (currentIndex + 1 >= words.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, words]);

  const handleShuffle = useCallback(() => {
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
  }, []);

  return {
    words,
    currentIndex,
    currentWord: words[currentIndex],
    showAnswer,
    setShowAnswer,
    score,
    isLoading,
    error,
    translations,
    showSummary,
    progress: words.length ? ((currentIndex + 1) / words.length) * 100 : 0,
    totalWords: words.length,
    fetchWords,
    handleNext,
    handleShuffle,
  };
}