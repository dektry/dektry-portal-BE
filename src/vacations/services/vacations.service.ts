import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { vacationRepository } from '../repositories/vacations.repository';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(vacationRepository)
    private vacationRepository: vacationRepository,
  ) {}
}
