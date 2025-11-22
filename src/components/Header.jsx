import React from 'react';
import '../styles/header.css';

const Header = ({ userName }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">💝</span>
          <h1>CareMoms</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{userName}</span>
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;