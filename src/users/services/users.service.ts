import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';
import { usersRepository } from '../repositories/users.repository';
import { roleRepository } from '../repositories/role.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
  ) {}

  async getAll() {
    const allUsers = await this.usersRepository.find({
      relations: ['role', 'role.permissions'],
    });
    return allUsers;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne({
      relations: ['role', 'role.permissions'],
    });

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

  async createUser(newUserProps: UserDto): Promise<UserEntity> {
    const { firstName, lastName, email, password, role } = newUserProps;
    const isExist = await this.usersRepository.findOne({
      email,
    });
    if (isExist) {
      throw new ConflictException('User is already exist!');
    } else {
      const newUserRole = await this.roleRepository.findOne({ name: role });
      if (!newUserRole) {
        throw new NotFoundException(`Role ${role} is incorrect!`);
      }
      const newUser = await this.usersRepository.create({
        firstName,
        lastName,
        password,
        email,
        role: newUserRole,
      });
      return this.usersRepository.save(newUser);
    }
  }

  async updateUser(id: string, newUserProps: UserDto): Promise<any> {
    const { role, ...updatedProps } = newUserProps;
    const newUserRole = await this.roleRepository.findOne({ name: role });
    if (!newUserRole) {
      throw new ConflictException(`Role ${role} is incorrect!`);
    }
    try {
      const result = await this.usersRepository.update(
        { id },
        { role: newUserRole, ...updatedProps },
      );
      if (!result.affected) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id): Promise<any> {
    try {
      const result = await this.usersRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
