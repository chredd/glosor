export interface Word {
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

interface LoadSheetsResult {
  sheets: Sheet[];
  error?: string;
}

// Google Sheets API endpoint for the spreadsheet
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID || 'SPREADSHEET_ID_PLACEHOLDER';
const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

/**
 * Parse CSV text into rows and columns
 * @param csvText - Raw CSV text from Google Sheets
 * @returns Array of rows with each row as an array of cells
 */
const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  const lines = csvText.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const row: string[] = [];
    let insideQuote = false;
    let cell = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(cell.trim().replace(/^["']|["']$/g, ''));
        cell = '';
      } else {
        cell += char;
      }
    }
    
    if (cell) {
      row.push(cell.trim().replace(/^["']|["']$/g, ''));
    }
    
    rows.push(row);
  }
  
  return rows;
};

/**
 * Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Loads available sheets from Google Sheets
 */
export const loadAvailableSheets = async (): Promise<LoadSheetsResult> => {
  try {
    const response = await fetch(SHEETS_URL);
    if (!response.ok) {
      throw new Error(`Failed to load sheets: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText).slice(1); // Skip header row
    
    const sheets = rows.map(row => {
      const name = row[0] || 'Unknown';
      return {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name
      };
    });

    return { sheets };
  } catch (error) {
    console.error('Error loading available sheets:', error);
    return {
      sheets: [],
      error: error instanceof Error ? error.message : 'Failed to load sheets'
    };
  }
};

/**
 * Loads words from a specific sheet
 * @param sheetName - Name of the sheet to load
 */
export const loadWords = async (sheetName: string): Promise<LoadWordsResult> => {
  if (!sheetName) {
    return {
      words: [],
      error: 'No sheet name provided'
    };
  }
  
  try {
    const url = `${SHEETS_URL}&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load words: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText).slice(1); // Skip header row
    
    const words = rows
      .filter(row => row.length >= 2)
      .map(row => {
        const [swedish = '', english = '', category = ''] = row;
        return {
          swedish,
          english,
          ...(category ? { category } : {})
        };
      })
      .filter(word => word.swedish && word.english); // Filter out incomplete entries
    
    if (words.length === 0) {
      return {
        words: [],
        error: 'No words found in the spreadsheet'
      };
    }

    // Shuffle the words before returning
    return { words: shuffleArray(words) };
  } catch (error) {
    console.error('Error loading words:', error);
    return {
      words: [],
      error: error instanceof Error ? error.message : 'Failed to load words from the spreadsheet'
    };
  }
};