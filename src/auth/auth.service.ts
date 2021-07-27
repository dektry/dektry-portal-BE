import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import * as crypto from 'crypto-js';
import { UsersService } from 'users/services/users.service';
import { RequestUser } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<RequestUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email '${email}' is not found!`);
    }
    const decryptPassword = crypto.AES.decrypt(user.password, process.env.ENCRYPT_KEY);
    const originalText = decryptPassword.toString(crypto.enc.Utf8).replace(/['"]+/g, '');
    if (pass === originalText) {
      const result = omit(user, ['password']);
      return result;
    }
    return null;
  }

  async login(user: RequestUser) {
    const payload = {
      ...user,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
