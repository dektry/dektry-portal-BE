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
import { accessRepository } from '../repositories/access.repository';
import { roleRepository } from '../repositories/role.repository';
import { getHashPassword } from '../../../utils/hashPassword';
import { DeleteResult } from 'typeorm';
import * as fs from 'fs';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
    @InjectRepository(careerRepository)
    private careerRepository: careerRepository,
    @InjectRepository(accessRepository)
    private accessRepository: accessRepository,
  ) {}

  async getAll() {
    const allUsers = await this.usersRepository.find({
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });
    const transformedUsers = allUsers.map((user) => {
      const currentPositions = user.career
        .filter((item) => item.to === null)
        .map((item) => item.position);
      return {
        ...user,
        currentPositions,
      };
    });
    return transformedUsers;
  }

  async getUserById(id: string): Promise<any> {
    const found = await this.usersRepository.findOne(id, {
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });

    const currentPositions = found.career
      .filter((item) => item.to === null)
      .map((item) => item.position);
    const userWithCurrentPositions = {
      ...found,
      currentPositions,
    };

    if (!found) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return userWithCurrentPositions;
  }

  async findByEmail(email: string) {
    const currentUser = this.usersRepository.findOne({
      where: { email },
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });
    return currentUser;
  }

  async createUser(newUserProps: UserDto): Promise<UserEntity> {
    const { email, role, password, ...otherProps } = newUserProps;
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
      const hashPassword = await getHashPassword(password);
      const newUser = await this.usersRepository.create({
        ...otherProps,
        email,
        role: newUserRole,
        password: hashPassword,
      });
      return this.usersRepository.save(newUser);
    }
  }

  async updateUser(id: string, newUserProps: UserDto): Promise<UserEntity> {
    const existUser = await this.usersRepository.findOne({
      where: { id },
    });
    const { role, password, ...updatedProps } = newUserProps;
    const newUserRole = await this.roleRepository.findOne(role);
    if (!existUser) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    if (!newUserRole) {
      throw new ConflictException(`Role ${role} is incorrect!`);
    }
    try {
      const hashPassword = await getHashPassword(password);
      const result = await this.usersRepository.save({
        ...existUser,
        ...updatedProps,
        role: newUserRole,
        password: hashPassword,
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id): Promise<DeleteResult> {
    const allCareers = await this.careerRepository.find({
      where: { user: id },
      relations: ['user', 'position', 'position.group'],
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
    const user = await this.usersRepository.findOne(id);

    if (!file) {
      throw new NotFoundException(`File is not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    const { avatarFileName } = user;

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

  async getAllAccess() {
    const access = await this.accessRepository.find({
      relations: ['positions', 'positionsGroups'],
    });
    return access;
  }

  async getAccessReq(point) {
    const access = await this.accessRepository.findOne(
      { name: point },
      {
        relations: ['positions', 'positionsGroups'],
      },
    );
    return access;
  }

  async updateAccessReq(point, accessProps) {
    const existAccess = await this.accessRepository.findOne(
      { name: point },
      {
        relations: ['positions', 'positionsGroups'],
      },
    );

    const { name } = accessProps;

    if (!existAccess) {
      throw new NotFoundException(`Access ${name} not found!`);
    }

    try {
      const result = await this.accessRepository.save({
        ...existAccess,
        ...accessProps,
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}
