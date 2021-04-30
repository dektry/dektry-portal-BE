import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([usersRepository])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
