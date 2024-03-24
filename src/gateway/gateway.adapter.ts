import { IoAdapter } from '@nestjs/platform-socket.io';
import { getRepository } from 'typeorm';
import { AuthenticatedSocket } from '../utils/interfaces';
import { User } from '../utils/typeorm';
import * as cookie from 'cookie';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { INestApplicationContext } from '@nestjs/common';

export class WebsocketAdapter extends IoAdapter {
  private jwtService: JwtService;

  constructor(private app: INestApplicationContext) {
    super(app);
    app.resolve<JwtService>(JwtService).then((jwtService) => {
      this.jwtService = jwtService;
    });
  }

  createIOServer(port: number, options?: any) {
    const userRepository = getRepository(User);
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = await this.jwtService.verify(CHAT_APP_SESSION_ID, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await userRepository.findOne({
        where: {
          refreshToken: CHAT_APP_SESSION_ID,
        },
        relations: ['peer'],
      });
      if (!sessionDB) return next(new Error('No session found'));
      const userDB = plainToInstance(User, sessionDB);
      socket.user = userDB;
      next();
    });
    return server;
  }
}
