import React, { useState, useEffect, useRef } from "react";
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const socketRef = useRef(null);

// WebSocket connection setup
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && messageInput.trim() !== '') {
      socketRef.current.send(JSON.stringify(messageInput));
      setMessageInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
