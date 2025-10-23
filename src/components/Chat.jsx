import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import Message from './Message';

const Chat = ({ socketRef, userName, messages, setMessages }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socketRef.current && messageInput.trim() !== '') {
      const messageData = {
        text: messageInput,
        user: userName,
        timestamp: new Date().toLocaleTimeString()
      };
      socketRef.current.send(JSON.stringify(messageData));
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Community Chat</h2>
        <span className="online-indicator">●</span>
        <span className="online-count">45 online</span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Welcome to CareMoms!</h3>
            <p>Start a conversation with the community</p>
          </div>
            ) : (
              messages.map((message, index) => (
                <Message key={index} message={message} index={index} />
              ))
            )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Share your thoughts with the community..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button" disabled={!messageInput.trim()}>
            <span className="send-icon">📤</span>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
