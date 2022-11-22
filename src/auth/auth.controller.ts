import { Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req) {
    const jwt = await this.authService.login(req.user);

    return {
      user: { ...req.user, role: { permissions: [] }, career: [] },
      jwt: jwt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async auth(@Req() request: Request) {
    const result = await this.authService.auth(
      request.headers['authorization'].split(' ')[1],
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() request: Request) {
    const currentUser = request.user;
    return currentUser;
  }
}
