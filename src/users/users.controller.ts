import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

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
