import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Services } from '../../utils/constants';
import { IAuthService } from '../auth';
import { Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/interfaces/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.USERS) private readonly usersService: IUserService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const [, token] = req.headers.authorization?.split(' ') ?? [];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return this.usersService.findUser({
      username: payload.username,
    });
  }
}
