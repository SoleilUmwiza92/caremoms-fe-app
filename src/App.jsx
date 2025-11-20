import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

import "./App.css";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Chat from "./components/Chat.jsx";

function App() {
  const [userName, setUserName] = useState("User");
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch messages from REST API every 2 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat/messages");
        const data = await res.json();
        setMessages(
          data.map((m) => ({
            text: m.content,
            user: m.nickname,
            timestamp: new Date(m.timestamp).toLocaleTimeString(),
          }))
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages(); // initial fetch
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, []);

  // Handle nickname change
  const handleNickNameChange = (e) => {
    const name = e.target.value;
    setNickname(name);
    if (name.trim()) setUserName(name);
  };

  // Send message to backend REST API
  const handleChatSendMessage = async (messageData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/chat/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname: messageData.user,
            content: messageData.text,
            timestamp: new Date().getTime(),
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to send message:", response.statusText);
        return false;
      }

      const savedMessage = await response.json();

      // Update UI immediately
      setMessages((prev) => [
        ...prev,
        {
          text: savedMessage.content,
          user: savedMessage.nickname,
          timestamp: new Date(savedMessage.timestamp).toLocaleTimeString(),
        },
      ]);

      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      return false;
    }
  };

  return (
    <div className="app-container">
      <Header userName={userName} />

      <div className="app-main">
        <Sidebar />

        <div className="app-content">
          <Chat
            userName={userName}
            messages={messages}
            onSendMessage={handleChatSendMessage}
          />

          <div
            className="nickname-setup"
            style={{ padding: "20px", borderTop: "1px solid #e0e0e0" }}
          >
            <TextField
              label="Set Your Name"
              variant="standard"
              value={nickname}
              onChange={handleNickNameChange}
              placeholder="Enter your name"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
