import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entity/user.entity';
import { usersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getUserById(id: number): Promise<Users> {
    const found = await this.usersRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return found;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    return this.usersRepository.createUser(createUserDto);
  }
}
