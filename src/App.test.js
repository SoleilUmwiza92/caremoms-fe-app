import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";
import { Stomp } from "@stomp/stompjs";

// STOMP client instance returned from our mock
let stompMock;

beforeEach(() => {
  stompMock = {
    send: jest.fn(),
    subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
    connected: true,
  };

  Stomp.over.mockReturnValue(stompMock);
});

test("renders App and allows nickname change", () => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter your name to start chatting");
  fireEvent.change(input, { target: { value: "Alice" } });

  expect(input.value).toBe("Alice");
});

test("sends message through STOMP when Chat triggers send", async () => {
  render(<App />);

  // The Chat component renders an input + button (depends on your Chat UI)
  const messageInput = screen.getByPlaceholderText(/type a message/i);
  const sendButton = screen.getByRole("button", { name: /send/i });

  fireEvent.change(messageInput, { target: { value: "Hello world" } });

  await act(async () => {
    fireEvent.click(sendButton);
  });

  expect(stompMock.send).toHaveBeenCalledTimes(1);
  expect(stompMock.send).toHaveBeenCalledWith(
    "/app/chat",
    {},
    JSON.stringify({ nickname: "User", content: "Hello world" })
  );
});

test("does not send message if STOMP is disconnected", async () => {
  stompMock.connected = false; // simulate disconnect
  render(<App />);

  const messageInput = screen.getByPlaceholderText(/type a message/i);
  const sendButton = screen.getByRole("button", { name: /send/i });

  fireEvent.change(messageInput, { target: { value: "Test" } });

  await act(async () => {
    fireEvent.click(sendButton);
  });

  expect(stompMock.send).not.toHaveBeenCalled();
});
