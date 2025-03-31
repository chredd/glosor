interface Word {
  swedish: string;
  english: string;
  category?: string;
}

export interface Sheet {
  id: string;
  name: string;
}

interface LoadWordsResult {
  words: Word[];
  error?: string;
}

// Google Sheets API endpoint for the spreadsheet
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID || 'SPREADSHEET_ID_PLACEHOLDER';
const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const loadAvailableSheets = async (): Promise<Sheet[]> => {
  try {
    const response = await fetch(SHEETS_URL);
    if (!response.ok) {
      throw new Error(`Kunde inte ladda tillgängliga listor: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
    
    // Parse CSV to get sheet names
    const sheetNames = csvText
      .split('\n')
      .slice(1) // Skip header row
      .filter(row => row.trim()) // Skip empty rows
      .map(row => {
        const [name] = row.split(',').map(cell => cell.trim());
        return {
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name
        };
      });

    return sheetNames;
  } catch (error) {
    console.error('Fel vid laddning av tillgängliga listor:', error);
    return [];
  }
};

export const loadWords = async (sheetName: string): Promise<LoadWordsResult> => {
  try {
    const response = await fetch(`${SHEETS_URL}&sheet=${encodeURIComponent(sheetName)}`);
    if (!response.ok) {
      throw new Error(`Kunde inte ladda orden: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
    
    // Parse CSV (skip header row)
    const rows = csvText.split('\n').slice(1);
    const words = rows
      .filter(row => row.trim()) // Skip empty rows
      .map(row => {
        const [swedish, english, category] = row.split(',').map(cell => 
          // Remove quotes and trim whitespace
          cell.trim().replace(/^["']|["']$/g, '')
        );
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