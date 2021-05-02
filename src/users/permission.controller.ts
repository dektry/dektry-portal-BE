import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionEntity } from '../users/entity/permission.entity';
import { CreatePermissionDto } from '../users/dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PermissionEntity> {
    return this.PermissionService.getPermissionById(id);
  }

  @Post()
  create(
    @Body() CreatePermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return this.PermissionService.createPermission(CreatePermissionDto);
  }
}
