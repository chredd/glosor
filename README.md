# Swedish Translation Practice

A simple web application for practicing Swedish to English translations. Built with React and TypeScript.

## Features

- Clean, minimalist UI
- Mobile-friendly design
- Score tracking
- Words loaded from Google Sheets
- No autocomplete to ensure proper learning
- Swedish interface

## Setup

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/chredd/glosor.git
cd glosor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Google Sheets configuration:
```
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

### Google Sheets Setup

1. Create a Google Spreadsheet with the following format:
   - Column A: Swedish words/phrases
   - Column B: English translations
   - Column C: Category (optional)
   - First row should be headers

2. Get your Google Sheets API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Create credentials (API key)
   - (Recommended) Restrict the API key to your domain

3. Get your Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

To deploy manually:
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 