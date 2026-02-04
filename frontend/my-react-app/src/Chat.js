import { useEffect, useState } from "react";
import { api } from "./api";
import AudioRecorder from "./AudioRecorder";

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const AUTO_DELETE_MS = 15000; // 15 seconds auto-delete

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    // Auto-delete after delay
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    }, AUTO_DELETE_MS);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      role: "Doctor",
      text,
      translatedText: "Translating...",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      setLoading(true);
      const res = await api.post("/translate", {
        text,
        role: "Doctor",
        targetLanguage: language,
      });

      // Replace temp message with actual response
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? res.data : m))
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, translatedText: "Error sending message" }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAudioMessage = async (audioBlob) => {
    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      role: "Doctor",
      text: "Audio message...",
      translatedText: "Transcribing...",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("role", "Doctor");
      formData.append("targetLanguage", language);

      const res = await api.post("/translate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? res.data : m))
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, translatedText: "Error sending audio" }
            : m
        )
      );
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/history");
        // Only add messages if not empty
        if (res.data?.length) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="chat-container">
      {/* Language Selector */}
      <div className="language-select">
        <label>Select Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
          <option value="Telugu">Telugu</option>
          <option value="Tamil">Tamil</option>
          <option value="German">German</option>
        </select>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role.toLowerCase()}`}>
            <b>{m.role}</b>
            <p>
              <i>Original:</i> {m.text}
            </p>
            <p>
              <i>Translated:</i> {m.translatedText}
            </p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        <AudioRecorder onSend={handleAudioMessage} language={language} />
      </div>
    </div>
  );
}
