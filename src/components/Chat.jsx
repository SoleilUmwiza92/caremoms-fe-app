import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat.css';
import Message from './Message';

const Chat = ({ socketRef, userName, messages, setMessages, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const [showOnlyMyMessages, setShowOnlyMyMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Filter messages based on showOnlyMyMessages
  const displayedMessages = showOnlyMyMessages 
    ? messages.filter(msg => msg.user === userName)
    : messages;

  const myMessagesCount = messages.filter(msg => msg.user === userName).length;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const messageData = {
        text: messageInput,
        user: userName,
        timestamp: new Date().toLocaleTimeString()
      };
      
      // Use custom send handler if provided (for Stomp), otherwise use WebSocket
      if (onSendMessage) {
        onSendMessage(messageData);
      } else if (socketRef.current) {
        socketRef.current.send(JSON.stringify(messageData));
      }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <button 
            onClick={() => setShowOnlyMyMessages(!showOnlyMyMessages)}
            className={`filter-button ${showOnlyMyMessages ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #667eea',
              borderRadius: '8px',
              background: showOnlyMyMessages ? '#667eea' : 'transparent',
              color: showOnlyMyMessages ? 'white' : '#667eea',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {showOnlyMyMessages ? 'Show All' : `My Messages (${myMessagesCount})`}
          </button>
          <span className="online-indicator">●</span>
          <span className="online-count">45 online</span>
        </div>
      </div>

      <div className="chat-messages">
        {displayedMessages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>
              {showOnlyMyMessages 
                ? "You haven't sent any messages yet" 
                : "Welcome to CareMoms!"}
            </h3>
            <p>
              {showOnlyMyMessages 
                ? "Start chatting to see your messages here" 
                : "Start a conversation with the community"}
            </p>
          </div>
            ) : (
              displayedMessages.map((message, index) => (
                <Message 
                  key={index} 
                  message={message} 
                  index={index} 
                  currentUserName={userName}
                />
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
