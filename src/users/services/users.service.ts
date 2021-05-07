import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entity/user.entity';
import { usersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getUserById(id: number): Promise<UserEntity> {
    const found = await this.usersRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return found;
  }

  async findByEmail(email) {
    const currentUser = this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    return currentUser;
  }

  async createUser(newUserProps: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, email, password, role } = newUserProps;
    const newUser = this.usersRepository.create({
      firstName,
      lastName,
      password,
      email,
      role,
    });
    return this.usersRepository.save(newUser);
  }

  async updateUser(newUserProps: UpdateUserDto): Promise<string> {
    const { id, ...updatedProps } = newUserProps;
    const result = await this.usersRepository.update({ id }, updatedProps);
    if (!result.affected) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return 'User updated!';
  }

  async deleteUser(userProps: DeleteUserDto): Promise<string> {
    const { id } = userProps;
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return 'User deleted!';
  }
}
