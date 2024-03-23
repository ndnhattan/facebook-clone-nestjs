import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { Services } from '../utils/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './utils/JwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './utils/Guards';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,

    {
      provide: Services.AUTH,
      useClass: AuthService,
    },

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
