import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async generatePdf(
    @Body() { template }: { template: string },
    @Res() res: Response,
  ) {
    const file = await this.cvGenerationService.generatePdf(template);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    file.pipe(res);
  }
}