# Doctor–Patient Real-Time Translation Chat

A full‑stack web application that enables seamless communication between doctors and patients who speak different languages. The app supports real‑time translation, text and audio chat, conversation storage and search, and AI-generated medical summaries.

Built with Flask (backend) and React (frontend).

---

## Features

- Doctor & Patient roles
- Real‑time multilingual translation (text)
- Text-based chat interface
- Browser audio recording and playback
- Conversation logging with timestamps
- Persistent chat history (SQLite)
- Conversation keyword search
- AI-powered medical conversation summarization

Highlights included in the AI summary:
- Symptoms
- Diagnosis
- Medications
- Follow-up actions

---

## Tech stack

- Frontend: React.js, Axios, Web Audio API, CSS (responsive)
- Backend: Flask, Flask-CORS, SQLite
- AI: OpenAI API (for translation/summarization)

---

## Project structure

doctor-patient-chat/
- backend/
  - app.py — Flask backend API
  - model.py — Database models and helpers
  - chat.db — SQLite database
  - requirements.txt — Python dependencies
  - .env — Environment variables (not tracked)
- frontend/
  - package.json — Frontend dependencies & scripts
  - public/
    - index.html — Main HTML file
  - src/
    - App.js — Main React component
    - index.js — React entry point
    - chat.js — Chat UI and message logic
    - audiorecorder.js — Audio recording functionality
    - aips.js — AI API service calls
    - index.css — Global styling

---

## Installation & setup

Prerequisites:
- Python 3.8+
- Node.js 16+ / npm or yarn

### Backend

1. Navigate to the backend folder:
   cd backend

2. Create and activate a virtual environment (recommended):
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows

3. Install Python dependencies:
   pip install -r requirements.txt

4. Create a .env file in the backend directory with:
   OPENAI_API_KEY=your_openai_api_key_here
   (Add any other required environment variables your app expects.)

5. Run the backend:
   python app.py

The backend runs by default at:
http://localhost:5000

### Frontend

1. Navigate to the frontend folder:
   cd frontend

2. Install dependencies:
   npm install

3. Start the frontend development server:
   npm start

The frontend runs by default at:
http://localhost:3000

---

## API endpoints

| Method | Endpoint     | Description                                 |
|--------|--------------|---------------------------------------------|
| POST   | /message     | Save text or audio message                   |
| GET    | /messages    | Fetch conversation history                   |
| GET    | /search      | Search conversations by keyword              |
| POST   | /translate   | Translate a message                          |
| POST   | /summary     | Generate AI medical summary for a conversation |

(Adjust endpoints as implemented in backend/app.py.)

---

## Audio support

- Uses the browser MediaRecorder API
- Records audio from the user's microphone
- Audio is stored and played back inside the chat UI

---

## Deployment

Possible deployment targets:
- Frontend: Vercel, Netlify
- Backend: Render, Railway
- Database: SQLite locally; consider migrating to a hosted DB (Postgres, MySQL) for production

Notes:
- Securely provide OPENAI_API_KEY and other secrets using environment variables in your deployment provider.
- Serve the backend over HTTPS in production and enable CORS / authentication as needed.

---

## Future enhancements

- WebSocket-based real-time messaging
- Speech-to-text transcription for audio messages
- Authentication & role management
- Downloadable conversation reports (PDF)
- Cloud audio storage (S3 or similar)
- Move from SQLite to a production-grade database
- More robust validation and input sanitization
- Logging, monitoring, and tests

---

## Disclaimer

This project is for educational and demonstration purposes only. It is not a certified medical system and should not be used as a substitute for professional medical advice, diagnosis, or treatment.

---

## Author

Balu Pemmadi  
AI & Data Science | Full‑Stack Developer

---
