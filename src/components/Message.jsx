import React from 'react';

const Message = ({ message, index }) => {
  return (
    <div key={index} className="message">
      <div className="message-avatar">
        {message.user?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-author">{message.user || 'User'}</span>
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
