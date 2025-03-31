# Glosor - Swedish Vocabulary Learning App

A React application for learning Swedish vocabulary using Google Sheets as a data source.

## Features

- Load vocabulary from Google Sheets
- Interactive word learning interface
- Score tracking
- Word shuffling
- Summary view with correct/incorrect answers
- Fireworks animation for perfect scores

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   REACT_APP_SPREADSHEET_ID=your_spreadsheet_id
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Google Sheets Setup

1. Create a Google Spreadsheet with your vocabulary
2. Format your spreadsheet with columns:
   - Swedish word
   - English translation
   - Category (optional)
3. Publish the spreadsheet to the web:
   - File > Share > Publish to web
   - Choose "Entire Document" and "Comma-separated values (.csv)"
   - Click "Publish"
4. Copy the spreadsheet ID from the URL and add it to your `.env` file

## Deployment

The app is deployed to GitHub Pages. To deploy:

1. Push your changes to the main branch
2. Run:
   ```bash
   npm run deploy
   ```

## Technologies Used

- React
- TypeScript
- Google Sheets API
- CSS3

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
