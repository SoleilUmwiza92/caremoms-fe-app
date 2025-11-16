export const Stomp = {
  over: jest.fn(() => ({
    connect: jest.fn((headers, onConnect) => {
      onConnect(); // simulate immediate success
    }),
    subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
    send: jest.fn(),
    disconnect: jest.fn((callback) => callback && callback()),
    connected: true,
  })),
};

