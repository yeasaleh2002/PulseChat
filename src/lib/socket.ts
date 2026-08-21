import { io, Socket } from "socket.io-client";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  "https://frontend-task-chatapp.onrender.com";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
