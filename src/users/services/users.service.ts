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
import { positionRepository } from '../repositories/position.repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
  ) {}

  async getAll() {
    const allUsers = await this.usersRepository.find({
      relations: ['role', 'role.permissions', 'position'],
    });
    return allUsers;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne(id, {
      relations: ['role', 'role.permissions', 'position'],
    });

    if (!found) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return found;
  }

  async findByEmail(email: string) {
    const currentUser = this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions', 'position'],
    });
    return currentUser;
  }

  async createUser(newUserProps: UserDto): Promise<UserEntity> {
    const { email, role, position, ...otherProps } = newUserProps;
    const isExist = await this.usersRepository.findOne({
      email,
    });
    if (isExist) {
      throw new ConflictException('User with this email is already exist!');
    } else {
      const newUserRole = await this.roleRepository.findOne(role);
      const newUserPosition = await this.positionRepository.findOne(position);
      if (!newUserRole) {
        throw new NotFoundException(`Role ${role} is incorrect!`);
      }
      if (!newUserPosition) {
        throw new NotFoundException(`Position ${position} is incorrect!`);
      }
      const newUser = await this.usersRepository.create({
        ...otherProps,
        email,
        role: newUserRole,
        position: newUserPosition,
      });
      return this.usersRepository.save(newUser);
    }
  }

  async updateUser(id: string, newUserProps: UserDto): Promise<UpdateResult> {
    const { role, position, ...updatedProps } = newUserProps;
    const newUserRole = await this.roleRepository.findOne(role);
    const newUserPosition = await this.positionRepository.findOne(position);
    if (!newUserRole) {
      throw new ConflictException(`Role ${role} is incorrect!`);
    }
    if (!newUserPosition) {
      throw new NotFoundException(`Position ${position} is incorrect!`);
    }
    try {
      const result = await this.usersRepository.update(
        { id },
        { role: newUserRole, position: newUserPosition, ...updatedProps },
      );
      if (!result.affected) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id): Promise<DeleteResult> {
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

  async saveUserAvatar(id, file) {
    const result = await this.usersRepository.update(
      { id },
      { avatarFileName: file.filename },
    );
    return result;
  }

  async getUserAvatar(id, res) {
    try {
      const user = await this.usersRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return res.sendFile(user.avatarFileName, { root: 'upload/img/avatars' });
    } catch (error) {
      return error;
    }
  }
}
