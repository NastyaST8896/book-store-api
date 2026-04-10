import { Server } from 'socket.io';

export let io: Server | null = null;

export const createConnection = (svr) => {
  io = new Server(svr, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  return io;
}
