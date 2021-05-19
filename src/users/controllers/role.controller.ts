import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { RoleEntity } from '../entity/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Get()
  getAll(): Promise<RoleEntity[]> {
    return this.RoleService.getAll();
  }

  @Get('/:id')
  getRoleById(@Param('id', ParseIntPipe) id: number): Promise<RoleEntity> {
    return this.RoleService.getRoleById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateRoleDto): Promise<RoleEntity> {
    return this.RoleService.createRole(createUserDto);
  }
}
