import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../users/interfaces/user';
import { Services } from '../utils/constants';
import { compareHash } from '../utils/helpers';
import { ValidateUserDetails } from '../utils/types';
import { IAuthService } from './auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findUser(
      { username: userDetails.username },
      { selectAll: true },
    );
    console.log(user);
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    console.log(isPasswordValid);
    return isPasswordValid ? user : null;
  }

  async login(userCredentials: ValidateUserDetails) {
    const user = await this.validateUser(userCredentials);
    if (!user) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      username: user.username,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '1m',
    });
    await this.userService.updateUser(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (!user)
        throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
      const payload = {
        username: user.username,
        sub: user.sub,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30s',
      });
      return { accessToken };
    } catch (error) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(id: number) {
    await this.userService.updateUser(id, null);
  }
}
