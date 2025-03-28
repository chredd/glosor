interface Word {
  swedish: string;
  english: string;
  category?: string;
}

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // You'll need to replace this
const API_KEY = 'YOUR_API_KEY'; // You'll need to replace this

export async function fetchWords(): Promise<Word[]> {
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