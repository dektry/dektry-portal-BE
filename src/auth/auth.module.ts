import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'users/users.module';
import { usersRepository } from '../users/repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import dotEnv = require('dotenv');

dotEnv.config();
@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([usersRepository]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
