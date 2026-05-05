// lib/socket.ts
import { io } from "socket.io-client";

// export const socket = io("http://localhost:4000", {
export const socket = io(process.env.NEXT_SOCKET_SERVER_URI, {
  autoConnect: false,
});
