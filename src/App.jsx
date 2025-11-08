import React, { useState, useEffect, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, TextField, Button } from "@mui/material";

import './App.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';

const SOCKET_URL = "http://localhost:8080/ws";  // Spring Boot WebSocket endpoint

function App() {
   const [userName, setUserName] = useState('User');
   const [messages, setMessages] = useState([]);
   const [nickname, setNickname] = useState("");
   const [stompClient, setStompClient] = useState(null);
   const stompClientRef = useRef(null);
   const [message, setMessage] = useState("");
   const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);

    client.connect(
      {},
      () => {
        setIsConnected(true);
        setStompClient(client);
        stompClientRef.current = client;
        client.subscribe("/topic/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          // Transform message format to work with Chat component
          const formattedMessage = {
            text: receivedMessage.content || receivedMessage.text,
            user: receivedMessage.nickname || receivedMessage.user || userName,
            timestamp: receivedMessage.timestamp || new Date().toLocaleTimeString()
          };
          setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        });
      },
      () => {
        setIsConnected(false);
      }
    );

    return () => {
      try {
        if (client && client.connected) {
          client.disconnect(() => setIsConnected(false));
        }
      } catch (_) {}
    };
  }, []);

  const handleNickNameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    if (newNickname.trim()) {
      setUserName(newNickname);
    }
  };
  const handleMessageChange = (e) => setMessage(e.target.value);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!stompClient || !stompClient.connected || !isConnected) return;
    const chatMessage = { nickname: userName || nickname, content: message };
    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    setMessage("");
  };

  // Handler for Chat component to send messages via Stomp
  const handleChatSendMessage = (messageData) => {
    if (!stompClient || !stompClient.connected || !isConnected) return;
    const chatMessage = { 
      nickname: userName || messageData.user, 
      content: messageData.text 
    };
    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
  };

  return (
    <div className="app-container">
      <Header userName={userName} />
      <div className="app-main">
        <Sidebar />
        <div className="app-content">
          <Chat 
            socketRef={stompClientRef} 
            userName={userName} 
            messages={messages} 
            setMessages={setMessages}
            onSendMessage={handleChatSendMessage}
          />
          <div className="nickname-setup" style={{ padding: "20px", borderTop: "1px solid #e0e0e0" }}>
            <TextField 
              label="Set Your Name" 
              variant="standard" 
              value={nickname} 
              onChange={handleNickNameChange}
              placeholder="Enter your name to start chatting"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;