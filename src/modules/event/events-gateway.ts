import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtTokenService } from '../../shared/services/jwt-token.service';

@WebSocketGateway({
  pingTimeout: 60_000,
  cors: {
    origin: ['http://localhost'],
    methods: ['GET', 'POST'],
  },
})
export class EventsGateway {
  @WebSocketServer() private wss!: Server;

  constructor(private jwtTokenService: JwtTokenService) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = (client.handshake.auth.token ||
      client.handshake.headers.token) as string;

    if (!token) {
      client.disconnect();

      return;
    }

    const accessTokenPayload =
      await this.jwtTokenService.verifyAccessToken(token);

    const rooms = [accessTokenPayload.id];

    if (accessTokenPayload.companyId) {
      rooms.push(accessTokenPayload.companyId);
    }

    await client.join(rooms);
  }

  to(rooms: string[] | string) {
    return this.wss.to(rooms);
  }
}
