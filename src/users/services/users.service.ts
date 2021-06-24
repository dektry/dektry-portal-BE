import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';
import { usersRepository } from '../repositories/users.repository';
import { careerRepository } from '../repositories/career.repository';
import { roleRepository } from '../repositories/role.repository';
import { positionRepository } from '../repositories/position.repository';
import { DeleteResult } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
    @InjectRepository(careerRepository)
    private careerRepository: careerRepository,
  ) {}

  async getAll() {
    const allUsers = await this.usersRepository.find({
      relations: ['role', 'role.permissions', 'career', 'career.position'],
    });
    return allUsers;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const found = await this.usersRepository.findOne(id, {
      relations: ['role', 'role.permissions', 'career', 'career.position'],
    });

    if (!found) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return found;
  }

  async findByEmail(email: string) {
    const currentUser = this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions', 'career', 'career.position'],
    });
    return currentUser;
  }

  async createUser(newUserProps: UserDto): Promise<UserEntity> {
    const { email, role, ...otherProps } = newUserProps;
    const isExist = await this.usersRepository.findOne({
      email,
    });
    if (isExist) {
      throw new ConflictException('User with this email is already exist!');
    } else {
      const newUserRole = await this.roleRepository.findOne(role);
      if (!newUserRole) {
        throw new NotFoundException(`Role ${role} is incorrect!`);
      }
      const newUser = await this.usersRepository.create({
        ...otherProps,
        email,
        role: newUserRole,
      });
      return this.usersRepository.save(newUser);
    }
  }

  async updateUser(id: string, newUserProps: UserDto): Promise<UserEntity> {
    const { role, ...updatedProps } = newUserProps;
    const newUserRole = await this.roleRepository.findOne(role);
    if (!newUserRole) {
      throw new ConflictException(`Role ${role} is incorrect!`);
    }
    try {
      const result = await this.usersRepository.save({
        role: newUserRole,
        ...updatedProps,
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id): Promise<any> {
    const allCareers = await this.careerRepository.find({
      where: { user: id },
      relations: ['user', 'position'],
    });
    await this.careerRepository.remove(allCareers);
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
    const { avatarFileName } = await this.usersRepository.findOne(id);
    if (avatarFileName !== 'default_admin.png') {
      fs.unlink(`upload/img/avatars/${avatarFileName}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    await this.usersRepository.update(
      { id },
      { avatarFileName: file.filename },
    );
    return file.filename;
  }

  async getUserAvatar(fileName, res) {
    try {
      return res.sendFile(fileName, { root: 'upload/img/avatars' });
    } catch (error) {
      return error;
    }
  }
}
