interface Word {
  swedish: string;
  english: string;
  category?: string;
}

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

console.log('Environment variables check:');
console.log('SPREADSHEET_ID:', SPREADSHEET_ID ? 'Present' : 'Missing');
console.log('API_KEY:', API_KEY ? 'Present' : 'Missing');

if (!SPREADSHEET_ID || !API_KEY) {
  console.error('Missing required environment variables for Google Sheets configuration');
  console.log('SPREADSHEET_ID:', SPREADSHEET_ID ? 'Present' : 'Missing');
  console.log('API_KEY:', API_KEY ? 'Present' : 'Missing');
}

export async function fetchWords(): Promise<Word[]> {
  if (!SPREADSHEET_ID || !API_KEY) {
    console.error('Cannot fetch words: Missing Google Sheets configuration');
    return [];
  }

  try {
    console.log('Fetching from spreadsheet:', SPREADSHEET_ID);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A2:B?key=${API_KEY}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch words:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`Failed to fetch words: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data:', data);
    
    if (!data.values || !Array.isArray(data.values)) {
      console.error('Invalid data format received:', data);
      throw new Error('Invalid data format received from Google Sheets');
    }

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