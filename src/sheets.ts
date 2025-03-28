interface Word {
  swedish: string;
  english: string;
  category?: string;
}

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

if (!SPREADSHEET_ID || !API_KEY) {
  console.error('Missing required environment variables for Google Sheets configuration');
}

export async function fetchWords(): Promise<Word[]> {
  if (!SPREADSHEET_ID || !API_KEY) {
    console.error('Cannot fetch words: Missing Google Sheets configuration');
    return [];
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A2:B?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }

    const data = await response.json();
    return data.values.map((row: string[]) => ({
      swedish: row[0],
      english: row[1],
      category: row[2] || undefined
    }));
  } catch (error) {
    console.error('Error fetching words:', error);
    // Return default words if fetch fails
    return [
      { swedish: 'hej', english: 'hello' },
      { swedish: 'tack', english: 'thank you' },
      { swedish: 'god morgon', english: 'good morning' }
    ];
  }
} 