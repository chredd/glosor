import React from 'react';
import './SpeechButton.css';

interface SpeechButtonProps {
  text: string;
  language: string;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ text, language }) => {
  const handleSpeak = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang === language && 
      voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => voice.lang === language);
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      className="speech-button"
      onClick={handleSpeak}
      aria-label={`Läs upp ${text}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    </button>
  );
};

export default SpeechButton; 