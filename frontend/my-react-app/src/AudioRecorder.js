
import { useState, useRef } from "react";
import { api } from "./api"; // Axios instance

export default function AudioRecorder({ onSend, language = "Hindi" }) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const tempId = Date.now();

        // Show temporary message while transcribing
        onSend({
          id: tempId,
          role: "Doctor",
          text: "Audio message...",
          translatedText: "Transcribing...",
          timestamp: new Date().toISOString(),
        });

        // Prepare form data
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("role", "Doctor");
        formData.append("targetLanguage", language);

        try {
          const res = await api.post("/translate", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // Replace temporary message with actual response
          onSend({ ...res.data, id: tempId });
        } catch (err) {
          console.error("Audio send error:", err);
          onSend({
            id: tempId,
            role: "Doctor",
            text: "Audio transcription failed",
            translatedText: "Error",
            timestamp: new Date().toISOString(),
          });
        }
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error("Could not start recording:", err);
    }
  };

  // Stop recording
  const stop = () => {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="audio-controls">
      {!recording ? (
        <button onClick={start}>🎙 Record</button>
      ) : (
        <button onClick={stop}>⏹ Stop</button>
      )}
    </div>
  );
}
