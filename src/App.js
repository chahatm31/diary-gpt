import React, { useState } from "react";
import "./App.css";

// Sample user for login authentication
const userCredentials = {
  username: "testuser",
  password: "password123",
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [newEntryText, setNewEntryText] = useState("");
  const [newEntryTags, setNewEntryTags] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Handles login validation
  const handleLogin = () => {
    if (
      username === userCredentials.username &&
      password === userCredentials.password
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials, try again.");
    }
  };

  // Handle adding a new diary entry
  const handleAddEntry = () => {
    if (newEntryText.trim() === "") {
      alert("Diary entry cannot be empty!");
      return;
    }

    const newEntry = {
      text: newEntryText,
      tags: newEntryTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    if (editingIndex !== null) {
      // Edit existing entry
      const updatedEntries = [...diaryEntries];
      updatedEntries[editingIndex] = newEntry;
      setDiaryEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      // Add new entry
      setDiaryEntries([...diaryEntries, newEntry]);
    }

    setNewEntryText("");
    setNewEntryTags("");
  };

  // Handle delete entry
  const handleDeleteEntry = (index) => {
    const updatedEntries = diaryEntries.filter((_, i) => i !== index);
    setDiaryEntries(updatedEntries);
  };

  // Handle edit entry
  const handleEditEntry = (index) => {
    setNewEntryText(diaryEntries[index].text);
    setNewEntryTags(diaryEntries[index].tags.join(", "));
    setEditingIndex(index);
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // Authenticated private space (Diary Management)
  return (
    <div className="app-container">
      <h2>Your Diary</h2>

      {/* Form to create or edit diary entries */}
      <div className="diary-entry-form">
        <textarea
          placeholder="Write your diary entry here..."
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Add tags (comma-separated)"
          value={newEntryTags}
          onChange={(e) => setNewEntryTags(e.target.value)}
        />
        <button onClick={handleAddEntry}>
          {editingIndex !== null ? "Update Entry" : "Add Entry"}
        </button>
      </div>

      {/* List of diary entries */}
      <div className="diary-entries">
        {diaryEntries.length === 0 ? (
          <p>No diary entries yet. Start writing!</p>
        ) : (
          diaryEntries.map((entry, index) => (
            <div key={index} className="diary-entry">
              <p>{entry.text}</p>
              <p className="tags">
                Tags:{" "}
                {entry.tags.length > 0 ? entry.tags.join(", ") : "No tags"}
              </p>
              <button onClick={() => handleEditEntry(index)}>Edit</button>
              <button onClick={() => handleDeleteEntry(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
