import { Socket } from 'socket.io';
import { DefaultEventsMap, Server } from 'socket.io';

export let io: Server | null = null;

export class ConnectionManager {
  private static io: Server | null = null;
  private static activeSockets = new Map();

  public static createConnection(svr) {
    this.io = new Server(svr, {
      cors: {
        origin: `${process.env.BASE_CLIENT_URL}`,
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    return this.io;
  }

  public static setActiveSocket(
    userId: string | string[],
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    this.activeSockets.set(userId, socket);
  }

  public static deleteActiveSocket(userId: string | string[]) {
    this.activeSockets.delete(userId);
  }

  public static getActiveSocket() {
    return this.activeSockets;
  }

  public static getSocketByUserId(userId: string) {
    return this.activeSockets.get(userId);
  }
}
