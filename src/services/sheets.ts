interface Word {
  swedish: string;
  english: string;
  category?: string;
}

interface LoadWordsResult {
  words: Word[];
  error?: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1aFac2n1Jf7JtDAR2x8h3XS-0xzI7Job3V40X2x8O5uw/export?format=csv';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const loadWords = async (): Promise<LoadWordsResult> => {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Kunde inte ladda orden: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
    
    // Parse CSV (skip header row)
    const rows = csvText.split('\n').slice(1);
    const words = rows
      .filter(row => row.trim()) // Skip empty rows
      .map(row => {
        const [swedish, english, category] = row.split(',').map(cell => cell.trim());
        return {
          swedish,
          english,
          ...(category && { category })
        };
      });

    if (words.length === 0) {
      return {
        words: [],
        error: 'Inga ord hittades i kalkylbladet'
      };
    }

    // Shuffle the words before returning
    return { words: shuffleArray(words) };
  } catch (error) {
    console.error('Fel vid laddning av ord:', error);
    return {
      words: [],
      error: error instanceof Error ? error.message : 'Kunde inte ladda orden från kalkylbladet'
    };
  }
}; 