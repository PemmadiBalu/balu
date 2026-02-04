
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
import sqlite3
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# OpenAI client
client = OpenAI(api_key=GEMINI_API_KEY)

# Flask app
app = Flask(__name__)
CORS(app)

# Database
DB_NAME = "chat.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT,
            text TEXT,
            translated_text TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Cleanup old messages (optional)
def cleanup_old_messages(hours=1):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
        cursor.execute(
            "DELETE FROM messages WHERE timestamp <= ?",
            (cutoff.isoformat(),)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print("Cleanup error:", e)

# Gemini API call
def call_gemini_api(prompt, model="gpt-4"):
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        # Access content safely
        return response.choices[0].message["content"].strip()
    except Exception as e:
        return f"Error: {str(e)}"

# Audio transcription
def transcribe_audio(audio_path):
    try:
        transcription = client.audio.transcriptions.create(
            file=open(audio_path, "rb"),
            model="whisper-1"
        )
        return transcription.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

# Home
@app.route("/")
def home():
    return "Backend is running"

# Translate text/audio
@app.route("/translate", methods=["POST"])
def translate():
    try:
        cleanup_old_messages()  # optional cleanup

        text = None
        target_lang = None
        role = "user"

        # Text request
        if request.is_json:
            data = request.get_json()
            text = data.get("text")
            target_lang = data.get("targetLanguage")
            role = data.get("role", "user")

        # Audio request
        elif "audio" in request.files:
            audio_file = request.files["audio"]
            if not audio_file:
                return jsonify({"error": "No audio file found"}), 400

            os.makedirs("uploads", exist_ok=True)
            filename = secure_filename(audio_file.filename)
            audio_path = os.path.join("uploads", filename)
            audio_file.save(audio_path)

            # Transcribe audio
            text = transcribe_audio(audio_path)
            target_lang = request.form.get("targetLanguage")
            role = request.form.get("role", "user")
        else:
            return jsonify({"error": "No text or audio provided"}), 400

        if not text or not target_lang:
            return jsonify({"error": "Text and targetLanguage are required"}), 400

        # Skip translation if transcription failed
        if text.startswith("Error:"):
            translated = text
        else:
            translated = call_gemini_api(f"Translate to {target_lang}: {text}")

        # Save to DB
        timestamp = datetime.now(timezone.utc).isoformat()
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO messages (role, text, translated_text, timestamp) VALUES (?, ?, ?, ?)",
            (role, text, translated, timestamp)
        )
        conn.commit()
        message_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "id": message_id,
            "role": role,
            "text": text,
            "translatedText": translated,
            "timestamp": timestamp
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Chat history
@app.route("/history", methods=["GET"])
def history():
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, role, text, translated_text, timestamp FROM messages ORDER BY id ASC"
        )
        rows = cursor.fetchall()
        conn.close()
        return jsonify([
            {"id": row[0], "role": row[1], "text": row[2], "translatedText": row[3], "timestamp": row[4]}
            for row in rows
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete chat history manually
@app.route("/history", methods=["DELETE"])
def delete_history():
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages")
        conn.commit()
        conn.close()
        return jsonify({"message": "Chat history cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Summary
@app.route("/summary", methods=["POST"])
def summary():
    try:
        cleanup_old_messages()
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT text FROM messages")
        texts = cursor.fetchall()
        conn.close()

        if not texts:
            return jsonify({"summary": "No conversation available"})

        combined_text = "\n".join(t[0] for t in texts)
        summary_text = call_gemini_api(
            f"Summarize medical conversation including symptoms, diagnosis, medicines, follow-up:\n{combined_text}"
        )
        return jsonify({"summary": summary_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run server
if __name__ == "__main__":
    app.run(port=5000, debug=True)
