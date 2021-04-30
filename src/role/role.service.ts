import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { role } from './entity/role.entity';
import { roleRepository } from './repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
  ) {}

  async getRoleById(id: number): Promise<role> {
    const found = await this.roleRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return found;
  }

  async createRole(CreateRoleDto: CreateRoleDto): Promise<role> {
    return this.roleRepository.createRole(CreateRoleDto);
  }
}
