import React, { useState } from "react";
import "../styles/chat.css";

function Chat({ messages, userName, onSendMessage }) {
  const [messageInput, setMessageInput] = useState("");

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const messageData = {
      nickname: userName,
      content: messageInput,
      timestamp: new Date().toISOString(),
    };

    if (onSendMessage) {
      const ok = await onSendMessage(messageData);
      if (!ok) return;
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
              m.nickname === userName ? "my-message" : "other-message"
            }`}
          >
            <strong>{m.nickname || "Anonymous"}:</strong> {m.content}
            <div className="chat-timestamp">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
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
