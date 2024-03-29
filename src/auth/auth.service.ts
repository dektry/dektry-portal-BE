import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { comparePassword } from '../../utils/hashPassword';
import { UsersService } from 'users/services/users.service';
import { RequestUser, IAuthUser } from './auth.interfaces';

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

  async auth(token: string): Promise<any> {
    const { email } = <RequestUser>this.jwtService.decode(token);
    const user = await this.usersService.findByEmail(email);

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

    return { payload, jwt: { access_token: this.jwtService.sign(payload) } };
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
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
