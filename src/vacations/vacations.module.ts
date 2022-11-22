import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationsController } from './controllers/vacations.controller';
import { VacationsService } from './services/vacations.service';
import { vacationRepository } from './repositories/vacations.repository';
import { usersRepository } from 'users/repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([vacationRepository, usersRepository])],
  controllers: [VacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
