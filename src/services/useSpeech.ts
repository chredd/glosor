import { useCallback } from "react";

/**
 * Custom hook for text-to-speech functionality
 */
export function useSpeech() {
  const speak = useCallback((text: string, lang: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0; // Normal speaking rate
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang === lang &&
          (voice.name.toLowerCase().includes("daniel") ||
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("kvinna"))
      ) || voices.find((voice) => voice.lang === lang);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // For iOS, we need to wait for the voices to be loaded
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        const iosFemaleVoice =
          newVoices.find(
            (voice) =>
              voice.lang === lang &&
              (voice.name.toLowerCase().includes("daniel") ||
                voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("woman") ||
                voice.name.toLowerCase().includes("kvinna"))
          ) || newVoices.find((voice) => voice.lang === lang);

        if (iosFemaleVoice) {
          utterance.voice = iosFemaleVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}
