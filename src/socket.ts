import { Socket } from 'socket.io';
import { DefaultEventsMap, Server } from 'socket.io';
import http from 'http';

export let io: Server | null = null;

export class ConnectionManager {
  private static io: Server | null = null;
  private static activeSockets = new Map();

  public static createConnection(srv: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    this.io = new Server(srv, {
      cors: {
        origin: `${process.env.BASE_CLIENT_URL}`,
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    return this.io;
  }

  public static setActiveSocket(
    userId: number | number[],
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    this.activeSockets.set(userId, socket);
  }

  public static deleteActiveSocket(userId: number | number[]) {
    this.activeSockets.delete(userId);
  }

  public static getActiveSocket() {
    return this.activeSockets;
  }

  public static getSocketByUserId(userId: number) {
    return this.activeSockets.get(userId);
  }
}
