import { Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';

import { Request } from 'express';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

import { AuthLoginDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: AuthLoginDto })
  async login(@Req() req) {
    const jwt = await this.authService.login(req.user);

    return {
      user: { ...req.user, role: { permissions: [] }, career: [] },
      jwt: jwt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiBearerAuth()
  async auth(@Req() request: Request) {
    const result = await this.authService.auth(
      request.headers['authorization'].split(' ')[1],
    );
    return result;
  }
}
