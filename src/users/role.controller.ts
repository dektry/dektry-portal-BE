import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from '../users/entity/role.entity';
import { CreateRoleDto } from '../users/dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<RoleEntity> {
    return this.RoleService.getRoleById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateRoleDto): Promise<RoleEntity> {
    return this.RoleService.createRole(createUserDto);
  }
}
