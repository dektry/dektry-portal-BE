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

  async getAll() {
    const allUsers = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permission', 'permission')
      .select(['user', 'role.roleName', 'permission'])
      .getRawMany();
    const groupUsers = (allUsers, key) => {
      const groupedUsers: any = Object.values(
        allUsers.reduce(
          (result, user) => ({
            ...result,
            [user[key]]: {
              id: user.user_id,
              firstName: user.user_firstName,
              lastName: user.user_lastName,
              email: user.user_email,
              password: user.user_password,
              role: user.role_roleName,
            },
          }),
          {},
        ),
      );
      return groupedUsers;
    };

    const users = groupUsers(allUsers, 'user_id');
    return users;
  }

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

  async updateUser(newUserProps: UpdateUserDto): Promise<any> {
    const { id, ...updatedProps } = newUserProps;
    const result = await this.usersRepository.update({ id }, updatedProps);
    if (!result.affected) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return result;
  }

  async deleteUser(userProps: DeleteUserDto): Promise<any> {
    const { id } = userProps;
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return result;
  }
}
