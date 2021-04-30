import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { role } from './entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<role> {
    return this.RoleService.getRoleById(id);
  }

  @Post()
  create(@Body() createUserDto: CreateRoleDto): Promise<role> {
    return this.RoleService.createRole(createUserDto);
  }
}
