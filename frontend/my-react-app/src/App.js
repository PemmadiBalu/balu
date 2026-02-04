
import Chat from "./Chat";

// Main application component
export default function App() {
  return (
    <div className="app-container">
      {/* App title */}
      <h2 className="title">Doctor–Patient Translation</h2>

      {/* Chat component for conversation */}
      <Chat />
    </div>
  );
}
