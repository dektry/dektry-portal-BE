import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { requestUser } from './auth.interfaces';
import _ = require('lodash');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<requestUser> {
    const user = await this.usersService.findByEmail(email);
    if (user.password === pass) {
      const result = _.omit(user, ['password']);
      return result;
    }
    return null;
  }

  async login(user: requestUser) {
    const payload = {
      ...user,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
