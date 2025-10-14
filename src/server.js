const http = require('http');
const WebSocketServer = require('websocket').server;

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket server is running");
});

// Attach a WebSocket server to the HTTP server
const wsServer = new WebSocketServer({
  httpServer: server,
});

// Handle WebSocket connections
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  console.log('Client connected');

  // Handle messages from the client
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      console.log('📩 Received message:', message.utf8Data);
    }
  });

  // Handle disconnections
  connection.on('close', (reasonCode, description) => {
    console.log('Client disconnected');
  });
});

// Start listening
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running at ws://localhost:${PORT}`);
});
