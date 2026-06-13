import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
