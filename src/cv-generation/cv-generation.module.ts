import { Module } from '@nestjs/common';
import { CVGenerationController } from './controllers/cv-generation.controller';

@Module({
  controllers: [CVGenerationController],
  providers: [
    // CVGenerationService,
  ],
})
export class CVGenerationModule {}
