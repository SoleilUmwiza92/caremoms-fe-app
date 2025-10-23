import React, { useState, useEffect, useRef } from "react";
import './App.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';

function App() {
  const [userName, setUserName] = useState('User');
  const [messages, setMessages] = useState([]);
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

  return (
    <div className="App">
      <Header userName={userName} />
      <div className="main-container">
        <Sidebar />
        <Chat socketRef={socketRef} userName={userName} messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
}

export default App;
