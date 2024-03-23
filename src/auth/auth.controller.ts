import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { IUserService } from '../users/interfaces/user';
import { Routes, Services } from '../utils/constants';
import { AuthenticatedRequest, ValidateUserDetails } from '../utils/types';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { JwtAuthGuard } from './utils/Guards';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private userService: IUserService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(await this.userService.createUser(createUserDto));
  }

  @Post('login')
  login(@Body() userCredentials: ValidateUserDetails) {
    return this.authService.login(userCredentials);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
