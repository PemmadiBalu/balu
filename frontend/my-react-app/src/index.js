
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";   // Global styles
import App from "./App"; // Main App component

// Create React root and attach it to the HTML root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component into the DOM
root.render(<App />);
