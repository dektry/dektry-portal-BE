import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Permission(Permissions.getAllUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAll(): Promise<UserEntity[]> {
    return this.UsersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.UsersService.getUserById(id);
  }

  @Permission(Permissions.createUser, Permissions.updateUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createUser(@Body() userProps: UserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Permission(Permissions.createUser, Permissions.updateUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() userProps: UserDto,
  ): Promise<UpdateResult> {
    return this.UsersService.updateUser(id, userProps);
  }

  @Permission(Permissions.deleteUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.UsersService.deleteUser(id);
  }
}
