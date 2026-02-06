##🩺 Doctor–Patient Real-Time Translation Chat

A full-stack web application that enables seamless communication between doctors and patients speaking different languages.
The app supports real-time translation, text and audio chat, conversation storage, search, and AI-generated medical summaries.

Built with Flask (Backend) and React.js (Frontend).

##📁 Project Structure – doctor-patient-chat

doctor-patient-chat/

backend/
app.py – Flask backend API
model.py – Database models and helpers
chart.db – SQLite database
requirements.txt – Python dependencies
.env – Environment variables

frontend/
package.json – Frontend dependencies and scripts

public/
index.html – Main HTML file

src/

App.js – Main React component
index.js – React entry point
chat.js – Chat UI and message logic
audiorecorder.js – Audio recording functionality
aips.js – AI API service calls
index.css – Global styling

###✨ Features
Core Features:
Doctor & Patient roles
Real-time multilingual translation
Text-based chat interface
Browser audio recording
Audio playback inside chat
Conversation logging with timestamps
Persistent chat history (SQLite)
Conversation keyword search
AI-powered medical summary
AI Capabilities
Language translation
Medical conversation summarization

##Highlighting:
Symptoms
Diagnosis
Medications
Follow-up actions

##🧠 Tech Stack
Frontend
React.js
Axios
Web Audio API
CSS (Responsive UI)

Backend
Flask
Flask-CORS
SQLite (chart.db)

OpenAI API

⚙️ Backend Setup
1️⃣ Navigate to backend folder
cd backend

2️⃣ Install dependencies
pip install -r requirements.txt

3️⃣ Create .env file
OPENAI_API_KEY=your_openai_api_key_here

4️⃣ Run backend server
python app.py


##Backend runs on:

http://localhost:5000

🎨 Frontend Setup
1️⃣ Navigate to frontend folder
cd frontend

2️⃣ Install dependencies
npm install

3️⃣ Start React app
npm start


##Frontend runs on:

http://localhost:3000

📦 Backend Files Overview
File	Description
app.py	Flask API routes
model.py	Database models & helpers
chart.db	SQLite database
.env	Environment variables
requirements.txt	Python dependencies
🎨 Frontend Files Overview
File	Description
App.js	Main application component
chat.js	Chat UI logic
audiorecorder.js	Audio recording functionality
aips.js	AI API service calls
index.js	React entry point
index.css	Global styles
🔌 API Endpoints
Method	Endpoint	Description
POST	/message	Save text/audio message
GET	/messages	Fetch conversation history
GET	/search	Search conversations
POST	/translate	Translate message
POST	/summary	Generate AI medical summary
🎤 Audio Support

Uses browser MediaRecorder API

Records audio directly from microphone

Audio stored and played inside chat

##🚀 Deployment

You can deploy:

Frontend → Vercel / Netlify

Backend → Render / Railway

Database → Local SQLite or cloud migration

##🔒 Disclaimer

This project is for educational and demonstration purposes only.
It is not a certified medical system.

##📌 Future Enhancements

WebSocket real-time messaging

Speech-to-text support

Authentication & role management

Downloadable conversation reports

Cloud audio storage

##👤 Author

Balu Pemmadi
AI & Data Science | Full-Stack Developer
