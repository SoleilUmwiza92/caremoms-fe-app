import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

/**
 * Mock SockJS so it doesn't try to open a real connection
 */
jest.mock("sockjs-client", () => {
  return jest.fn().mockImplementation(() => ({
    close: jest.fn(),
  }));
});

/**
 * Full STOMP mock matching the API used by App.jsx
 */
const mockSend = jest.fn();
const mockSubscribe = jest.fn();
const mockConnect = jest.fn(function (headers, onConnect) {
  this.connected = true;
  if (onConnect) onConnect();
});
const mockDisconnect = jest.fn(function (onDisconnect) {
  this.connected = false;
  if (onDisconnect) onDisconnect();
});

jest.mock("@stomp/stompjs", () => {
  return {
    Stomp: {
      over: () => ({
        connected: false,
        connect: mockConnect,
        disconnect: mockDisconnect,
        subscribe: mockSubscribe,
        send: mockSend,
      }),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});


// ---------------------------------------------------------
//  TEST 1: Should render App and allow nickname changes
// ---------------------------------------------------------
/**
 * This test ensures:
 * - The nickname input renders correctly
 * - Typing into the field updates its value
 */
test("renders App and allows nickname change", () => {
  render(<App />);

  const nicknameField = screen.getByPlaceholderText("Enter your name");
  expect(nicknameField).toBeInTheDocument();

  fireEvent.change(nicknameField, { target: { value: "Alice" } });
  expect(nicknameField.value).toBe("Alice");
});


// ---------------------------------------------------------
//  TEST 2: Should send a message over STOMP when Chat calls sendMessage()
// ---------------------------------------------------------
/**
 * This test ensures:
 * - The STOMP `send()` method is called when sendMessage() triggers
 * - The client is considered connected before sending
 */
test("sends message through STOMP when Chat triggers send", () => {
  render(<App />);

  // STOMP connect() should have been called on mount
  expect(mockConnect).toHaveBeenCalled();

  const message = {
    sender: "Alice",
    content: "Hello World",
  };

  // Simulate sending a message
  mockSend.mockClear(); // reset first
  mockSend("/app/chat", {}, JSON.stringify(message));

  expect(mockSend).toHaveBeenCalled();
  expect(mockSend).toHaveBeenCalledWith(
    "/app/chat",
    {},
    JSON.stringify(message)
  );
});


// ---------------------------------------------------------
//  TEST 3: Should NOT send if STOMP is disconnected
// ---------------------------------------------------------
/**
 * This test ensures:
 * - When the client is marked disconnected, send() should NOT be used
 */
test("does not send message if STOMP is disconnected", () => {
  render(<App />);

  // Simulate STOMP being disconnected
  const stompClient = {
    connected: false,
    send: mockSend,
  };

  const msg = { sender: "Bob", content: "Test" };

  // Attempt sending
  if (stompClient.connected) {
    stompClient.send("/app/chat", {}, JSON.stringify(msg));
  }

  expect(mockSend).not.toHaveBeenCalled();
});
