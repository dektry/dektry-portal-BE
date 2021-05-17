import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { PermissionEntity } from '../entity/permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  // @Post()
  // create(
  //   @Body() CreatePermissionDto: CreatePermissionDto,
  // ): Promise<PermissionEntity> {
  //   return this.PermissionService.createPermission(CreatePermissionDto);
  // }
}
