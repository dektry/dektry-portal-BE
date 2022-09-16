import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CVGenerationService } from '../services/cv-generation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('cv-generation')
export class CVGenerationController {
  constructor(private cvGenerationService: CVGenerationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('template/:name')
  async getTemplate(@Res() res: Response, @Param('name') name: string) {
    const template = await this.cvGenerationService.getTemplate(name);

    if (template) {
      res.status(200).send(template);
    } else {
      res.status(404).send();
    }
  }
}
