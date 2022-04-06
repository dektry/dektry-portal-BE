import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { languageRepository } from '../repositories/language.repository';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(languageRepository)
    private languageRepository: languageRepository,
  ) {}
}
