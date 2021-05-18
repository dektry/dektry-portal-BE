import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
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
  getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.UsersService.getUserById(id);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createUser(@Body() userProps: UserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() userProps: UserDto,
  ): Promise<string> {
    return this.UsersService.updateUser(id, userProps);
  }

  @Roles(Role.Sudo, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<string> {
    return this.UsersService.deleteUser(id);
  }
}
