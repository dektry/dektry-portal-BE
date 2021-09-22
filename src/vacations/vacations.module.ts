import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationsController } from './controllers/vacations.controller';
import { VacationsService } from './services/vacations.service';
import { vacationRepository } from './repositories/vacations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([vacationRepository])],
  controllers: [VacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
