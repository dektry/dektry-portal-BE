import {
  Controller,
  Body,
  Get,
  Req,
  Res,
  Param,
  Post,
  UseGuards,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { uploadAvatarConfiguration } from '../multer.configuration';
import { IPaginationResult } from '../../../interfaces/pagination.interface';
import { AccessEntity } from 'users/entity/access.entity';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Permission(Permissions.getAllUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<IPaginationResult<UserEntity>> {
    return this.UsersService.getAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<any> {
    return this.UsersService.getUserById(id);
  }

  @Permission(Permissions.getAllUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('user')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Body() filter: { positions: string[]; name: string },
  ): Promise<IPaginationResult<UserEntity>> {
    return this.UsersService.getUsers(filter, page, limit);
  }

  @Permission(Permissions.createUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  createUser(@Body() userProps: UserDto): Promise<UserEntity> {
    return this.UsersService.createUser(userProps);
  }

  @Permission(Permissions.createUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() userProps: UserDto,
  ): Promise<UserEntity> {
    return this.UsersService.updateUser(id, userProps);
  }

  @Permission(Permissions.deleteUsers)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.UsersService.deleteUser(id);
  }

  @Permission(Permissions.createUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('avatar', uploadAvatarConfiguration))
  @Post('upload-avatar/:id')
  uploadAvatar(@Param('id') id, @UploadedFile() file: Express.Multer.File) {
    return this.UsersService.saveUserAvatar(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', uploadAvatarConfiguration))
  @Post('upload-avatar')
  uploadOwnAvatar(@Req() request, @UploadedFile() file: Express.Multer.File) {
    return this.UsersService.saveUserAvatar(request.user.id, file);
  }

  @Get('avatars/:fileName')
  getUserAvatar(@Param('fileName') fileName, @Res() res) {
    return this.UsersService.getUserAvatar(fileName, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('access/all')
  getAllAccess(): Promise<AccessEntity[]> {
    return this.UsersService.getAllAccess();
  }

  @UseGuards(JwtAuthGuard)
  @Get('access/:point')
  getAccessReq(@Param('point') point: string): Promise<AccessEntity> {
    return this.UsersService.getAccessReq(point);
  }

  @Permission(Permissions.createUser)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('access/:point')
  updateAccessReq(
    @Param('point') point: string,
    @Body() accessProps,
  ): Promise<AccessEntity> {
    return this.UsersService.updateAccessReq(point, accessProps);
  }
}
