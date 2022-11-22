import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { comparePassword } from '../../utils/hashPassword';
import { usersRepository } from '../users/repositories/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestUser } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  private async findByEmail(email: string) {
    const currentUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (!currentUser) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }
    return currentUser;
  }

  async validateUser(email: string, pass: string): Promise<RequestUser> {
    const user = await this.findByEmail(email);
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
    const user = await this.findByEmail(email);

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return { payload, jwt: { access_token: this.jwtService.sign(payload) } };
  }

  async login(user: RequestUser) {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: { permissions: [] },
      career: [],
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
