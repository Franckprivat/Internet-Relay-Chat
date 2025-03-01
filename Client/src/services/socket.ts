// src/services/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:8007", {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
});

export default socket;
