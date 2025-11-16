import React, { useState } from "react";
import "../styles/chat.css";

function Chat({ messages, userName, onSendMessage }) {
  const [messageInput, setMessageInput] = useState("");

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const messageData = {
      text: messageInput,
      user: userName,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Use parent send ONLY
    if (onSendMessage) {
      const ok = onSendMessage(messageData);
      if (!ok) return; // do NOT clear input if sending failed
    }

    setMessageInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-message ${
              m.user === userName ? "my-message" : "other-message"
            }`}
          >
            <strong>{m.user}:</strong> {m.text}
            <div className="chat-timestamp">{m.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
