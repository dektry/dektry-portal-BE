import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { comparePassword } from '../../utils/hashPassword';
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
    const isMatch = await comparePassword(pass, user.password);
    if (isMatch) {
      const result = _.omit(user, ['password']);
      return result;
    }
    return null;
  }

  async login(user: RequestUser) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: {
        id: user.role.id,
        permissions: user.role.permissions,
        name: user.role.name,
      },
      career: [],
    };
    console.log(user);
    console.log(user.role, 444444);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
