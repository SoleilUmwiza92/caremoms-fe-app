import { useState, useEffect, useRef } from "react";

export function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text && data.user) {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      setIsConnected(false);
    };

    return () => socket.close();
  }, [url]);

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message — socket not connected.");
    }
  };

  return { messages, sendMessage, isConnected };
}

