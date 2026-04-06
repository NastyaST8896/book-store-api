import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import { createServer } from 'node:http';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('new comment', (text) => {
    console.log(text);
  })
});


AppDataSource.initialize()
  .then(() => {
    server.listen(PORT, () => {
      // if (err) {
      //   console.log('>err', err);
      //   return;
      // }
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: unknown) => console.log(err));
