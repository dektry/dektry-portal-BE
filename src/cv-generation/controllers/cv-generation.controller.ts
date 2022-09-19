import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { CVGenerationService } from '../services/cv-generation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('cv-generation')
export class CVGenerationController {
  constructor(private cvGenerationService: CVGenerationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('template/:name')
  async getTemplate(@Param('name') name: string) {
    return await this.cvGenerationService.getTemplate(name);
  }
}
