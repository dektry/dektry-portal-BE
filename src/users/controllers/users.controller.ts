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
import { Permission } from 'src/decorators/permission.decorator';
import { Permissions } from 'src/enums/permissions.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { resultResponse } from '../user.intrfaces';

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

  @Permission(Permissions.createUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createUser(@Body() userProps: UserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Permission(Permissions.updateUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() userProps: UserDto,
  ): Promise<resultResponse> {
    return this.UsersService.updateUser(id, userProps);
  }

  @Permission(Permissions.deleteUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<resultResponse> {
    return this.UsersService.deleteUser(id);
  }
}
