import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

function Chat({ nickname, messages, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const ok = await onSend(input);
    if (ok) setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Logged in as: <strong>{nickname}</strong></div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-message ${
              m.nickname === nickname ? "my-message" : "other-message"
            }`}
          >
            <div className="chat-nickname">{m.nickname}</div>
            <div>{m.content}</div>
            <div className="chat-timestamp">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
