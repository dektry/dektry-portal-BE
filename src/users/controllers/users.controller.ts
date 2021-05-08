import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Get()
  getAll(): Promise<UserEntity[]> {
    return this.UsersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Sudo)
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.UsersService.getUserById(id);
  }

  @Post()
  createUser(@Body() userProps: CreateUserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Post('/update')
  updateUser(@Body() userProps: UpdateUserDto): Promise<string> {
    return this.UsersService.updateUser(userProps);
  }

  @Post('/delete')
  deleteUser(@Body() userId: DeleteUserDto): Promise<string> {
    return this.UsersService.deleteUser(userId);
  }
}
