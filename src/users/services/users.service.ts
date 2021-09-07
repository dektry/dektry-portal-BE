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
import { positionGroupRepository } from '../repositories/positionGroup.repository';
import { projectsRepository } from '../../projects/repositories/projects.repository';
import { projectsHistoryRepository } from '../../projects/repositories/projectsHistory.repository';
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
    @InjectRepository(projectsRepository)
    private projectsRepository: projectsRepository,
    @InjectRepository(projectsHistoryRepository)
    private projectsHistoryRepository: projectsHistoryRepository,
    @InjectRepository(positionGroupRepository)
    private positionGroupRepository: positionGroupRepository,
    @InjectRepository(accessRepository)
    private accessRepository: accessRepository,
  ) {}

  async getAll(page: number, limit: number) {
    const allUsers = await this.usersRepository.find();
    const usersFromPage = await this.usersRepository.find({
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
      take: limit,
      skip: limit * (page - 1),
      order: {
        firstName: 'ASC',
      },
    });
    const allProjects = await this.projectsRepository.find();
    const allProjectsHistory = await this.projectsHistoryRepository.find({
      relations: ['userId', 'projectId'],
    });
    const users = _.map(usersFromPage, (user) => {
      const userProjects = _.filter(
        allProjects,
        (project) =>
          _.includes(project.users, user.id) ||
          _.includes(project.managers, user.id),
      );
      const projectsHistory = _.filter(
        allProjectsHistory,
        (history) => history.userId && history.userId.id === user.id,
      );
      return {
        ...user,
        projects: userProjects,
        projectsHistory: projectsHistory,
      };
    });
    return {
      results: users,
      total: _.size(allUsers),
      currentPage: page,
      next: page + 1,
      previous: page - 1,
    };
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

    if (!found) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    const currentPositions = found.career
      .filter((item) => item.to === null)
      .map((item) => item.position);

    const userWithCurrentPositions = {
      ...found,
      currentPositions,
    };

    return userWithCurrentPositions;
  }

  async getUsers(
    filter: { positions: string[]; name: string },
    page: number = 1,
    limit: number = 10,
  ) {
    let searchPositions = '';
    let searchNames = '';
    if (_.size(filter.positions)) {
      const searchGroups = _.map(
        filter.positions,
        (position) => `"name"='${position}'`,
      );

      const allPositionGroups = await this.positionGroupRepository.find({
        where: _.join(searchGroups, ' OR '),
      });

      const searchValues = _.map(allPositionGroups, (group) =>
        group.name === 'None'
          ? `"UserEntity__career" IS NULL`
          : `"UserEntity__career__position"."groupId"='${group.id}'`,
      );

      const search =
        `(${_.join(searchValues, ' OR ')})` +
        ' AND "UserEntity__career"."to" IS NULL';

      const allUsers = await this.usersRepository.find({
        where: search,
        relations: ['career', 'career.position', 'career.position.group'],
      });

      const userSearch = _.map(allUsers, (user) => `"email"='${user.email}'`);

      searchPositions = `${_.join(userSearch, ' OR ')}`;
    }
    if (filter.name) {
      const searchValue = _.split(filter.name, ' ');
      const firstName = searchValue[0];
      const lastName = searchValue[1];
      searchNames = `LOWER("firstName") LIKE LOWER('%${firstName}%')`;
      if (lastName) {
        searchNames =
          searchNames +
          ' ' +
          `AND LOWER("lastName") LIKE LOWER('%${lastName}%')`;
      }
    }

    if (!searchPositions && !searchNames) {
      return {
        results: [],
        total: 0,
        currentPage: page,
        next: page + 1,
        previous: page - 1,
      };
    }

    const search =
      searchPositions && searchNames
        ? `(${searchPositions}) AND (${searchNames})`
        : searchPositions || searchNames;

    const allUsers = await this.usersRepository.find({
      where: search,
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });
    const users = await this.usersRepository.find({
      where: search,
      order: {
        firstName: 'ASC',
      },
      take: limit,
      skip: limit * (page - 1),
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });
    const allProjects = await this.projectsRepository.find();
    const allProjectsHistory = await this.projectsHistoryRepository.find({
      relations: ['userId', 'projectId'],
    });
    const results = _.map(users, (user) => {
      const userProjects = _.filter(
        allProjects,
        (project) =>
          _.includes(project.users, user.id) ||
          _.includes(project.managers, user.id),
      );
      const projectsHistory = _.filter(
        allProjectsHistory,
        (history) => history.userId && history.userId.id === user.id,
      );
      return {
        ...user,
        projects: userProjects,
        projectsHistory: projectsHistory,
      };
    });
    return {
      results: results,
      total: _.size(allUsers),
      currentPage: page,
      next: page + 1,
      previous: page - 1,
    };
  }

  async findByEmail(email: string) {
    const currentUser = await this.usersRepository.findOne({
      where: { email },
      relations: [
        'role',
        'role.permissions',
        'career',
        'career.position',
        'career.position.group',
      ],
    });

    if (!currentUser) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    const currentPositions = currentUser.career
      .filter((item) => item.to === null)
      .map((item) => item.position);
    const userWithCurrentPositions = {
      ...currentUser,
      currentPositions,
    };
    return userWithCurrentPositions;
  }

  async createUser(newUserProps: UserDto): Promise<UserEntity> {
    const { email, roleId, password, ...otherProps } = newUserProps;
    const isExist = await this.usersRepository.findOne({
      email,
    });

    if (isExist) {
      throw new ConflictException('User with this email is already exist!');
    } else {
      const newUserRole = await this.roleRepository.findOne(roleId);
      if (!newUserRole) {
        throw new NotFoundException(`Role ${roleId} is incorrect!`);
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
    const { roleId, password, ...updatedProps } = newUserProps;
    const newUserRole = await this.roleRepository.findOne(roleId);

    if (!existUser) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    if (!newUserRole) {
      throw new ConflictException(`Role ${roleId} is incorrect!`);
    }
    try {
      let updatedParams;
      if (password) {
        const hashPassword = await getHashPassword(password);
        updatedParams = {
          ...updatedProps,
          role: newUserRole,
          password: hashPassword,
        };
      } else {
        updatedParams = {
          ...updatedProps,
          role: newUserRole,
        };
      }
      const result = await this.usersRepository.save(updatedParams);
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
