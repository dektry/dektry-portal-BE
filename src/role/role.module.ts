import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { roleRepository } from './repositories/role.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([roleRepository])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
