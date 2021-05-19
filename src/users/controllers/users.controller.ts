import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(): Promise<UserEntity[]> {
    return this.UsersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.UsersService.getUserById(id);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createUser(@Body() userProps: CreateUserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/update')
  updateUser(@Body() userProps: UpdateUserDto): Promise<string> {
    return this.UsersService.updateUser(userProps);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<string> {
    return this.UsersService.deleteUser(id);
  }
}
