import React from 'react';

const Message = ({ message, index, currentUserName }) => {
  const isOwnMessage = message.user === currentUserName;
  
  return (
    <div key={index} className={`message ${isOwnMessage ? 'message-own' : ''}`}>
      <div className="message-avatar">
        {message.user?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-author">
            {message.user || 'User'}
            {isOwnMessage && <span className="message-badge">You</span>}
          </span>
          <span className="message-time">
            {message.timestamp || new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="message-text">{message.text || message}</div>
      </div>
    </div>
  );
};

export default Message;
