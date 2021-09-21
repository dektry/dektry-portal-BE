import { Module } from '@nestjs/common';
import { VacationsController } from './controllers/vacations.controller';
import { VacationsService } from './services/vacations.service';

@Module({
  controllers: [VacationsController],
  providers: [VacationsService],
})
export class VacationsModule {}
