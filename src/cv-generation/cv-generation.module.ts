import { Module } from '@nestjs/common';
import { CVGenerationController } from './controllers/cv-generation.controller';
import { CVGenerationService } from './services/cv-generation.service';

@Module({
  controllers: [CVGenerationController],
  providers: [CVGenerationService],
})
export class CVGenerationModule {}
