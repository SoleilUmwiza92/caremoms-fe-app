import React, { useState, useEffect, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { TextField } from "@mui/material";

import "./App.css";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Chat from "./components/Chat.jsx";

// WebSocket endpoint (docker or local)
const SOCKET_URL =
  process.env.REACT_APP_WS_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? `http://localhost:8080/ws`
    : `${window.location.protocol}//${window.location.hostname}:8080/ws`);

function App() {
  const [userName, setUserName] = useState("User");
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // STOMP connection state
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isConnectingRef = useRef(false); // prevents duplicate connections


  // WebSocket + STOMP Initialization
  useEffect(() => {
    // Guard prevents duplicate connections
    if (isConnectingRef.current || (stompClientRef.current && stompClientRef.current.connected)) {
      console.log("STOMP already initialized or connecting — skipping setup.");
      return;
    }
    isConnectingRef.current = true;

    console.log("🔌 Initializing WebSocket connection to:", SOCKET_URL);

    // Create SockJS instance first, then wrap with Stomp
    const socket = new SockJS(SOCKET_URL);
    const client = Stomp.over(socket);

    client.debug = (str) => console.log("[STOMP DEBUG]", str);

    // Disable auto-reconnect to prevent duplicate connections
    client.reconnectDelay = 0;
    client.heartbeatIncoming = 4000;
    client.heartbeatOutgoing = 4000;

    client.onStompError = (frame) => {
      console.error("STOMP protocol error:", frame);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      console.warn("WebSocket closed.");
      setIsConnected(false);
    };

    client.onWebSocketError = () => {
      console.error("WebSocket error.");
      setIsConnected(false);
    };


    // Connect to backend
    client.connect(
      {},
      () => {
        console.log("✅ Connected to WebSocket");
        stompClientRef.current = client;
        setIsConnected(true);


        // Subscribe ONCE - check if already subscribed
        if (subscriptionRef.current) {
          console.log("⚠️ Subscription already exists, skipping");
          return;
        }

        const sub = client.subscribe("/topic/messages", (msg) => {
          try {
            const body = JSON.parse(msg.body);
            const formatted = {
              text: body.content,
              user: body.nickname || "Anonymous",
              timestamp:
                body.timestamp || new Date().toLocaleTimeString(),
            };

            console.log("📨 Received message:", formatted);
            // Use functional update to prevent duplicate messages
            setMessages((prev) => {
              // Check if message already exists (prevent duplicates)
              const messageId = `${formatted.user}-${formatted.text}-${formatted.timestamp}`;
              const exists = prev.some(
                (m) => `${m.user}-${m.text}-${m.timestamp}` === messageId
              );
              if (exists) {
                console.log("⚠️ Duplicate message detected, skipping");
                return prev;
              }
              return [...prev, formatted];
            });
          } catch (err) {
            console.error("Error parsing incoming message:", err);
          }
        });

        subscriptionRef.current = sub;
        console.log("📡 Subscribed to /topic/messages");
      },

      (error) => {
        console.error("❌ STOMP connection failed:", error);
        console.error("Failed to connect to:", SOCKET_URL);
        setIsConnected(false);
        isConnectingRef.current = false; // Reset on error to allow retry
      }
    );

    // Cleanup (component unmount)
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      isConnectingRef.current = false;

      try {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }

        if (stompClientRef.current) {
          if (stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
              console.log("🔌 Disconnected cleanly");
            });
          }
          stompClientRef.current = null;
        }
      } catch (err) {
        console.error("Cleanup error:", err);
      } finally {
        setIsConnected(false);
      }
    };
  }, []);

  // Nickname handling

  const handleNickNameChange = (e) => {
    const name = e.target.value;
    setNickname(name);
    if (name.trim()) setUserName(name);
  };

  // Safe send function (used by Chat.jsx)
  const handleChatSendMessage = (messageData) => {
    const client = stompClientRef.current;

    if (!client || !client.connected) {
      console.warn("Cannot send, STOMP not connected");
      alert("Not connected to server. Try again.");
      return false;
    }

    const outgoing = {
      nickname: userName,
      content: messageData.text,
    };

    try {
      client.send("/app/chat", {}, JSON.stringify(outgoing));
      console.log("📤 Sent message:", outgoing);
      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      return false;
    }
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

          <div
            className="nickname-setup"
            style={{
              padding: "20px",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <TextField
              label="Set Your Name"
              variant="standard"
              value={nickname}
              onChange={handleNickNameChange}
              placeholder="Enter your name"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
