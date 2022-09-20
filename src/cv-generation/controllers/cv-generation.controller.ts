import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CVGenerationService } from '../services/cv-generation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CvGenerationDto } from '../dto/cv-generation.dto';

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
    @Body() { template }: CvGenerationDto,
    @Res() res: Response,
  ) {
    const file = await this.cvGenerationService.generatePdf(template);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    file.pipe(res);
  }
}
