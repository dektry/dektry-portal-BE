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

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CVGenerationService } from 'cv-generation/services/cv-generation.service';
import { CvGenerationDto } from 'cv-generation/dto/cv-generation.dto';

@Controller('cv-generation')
export class CVGenerationController {
  constructor(private cvGenerationService: CVGenerationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('template/:name')
  async getTemplate(@Param('name') name: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain');
    const template = await this.cvGenerationService.getTemplate(name);
    template.pipe(res);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async generatePdf(
    @Body() { template }: CvGenerationDto,
    @Res() res: Response,
  ) {
    const file = await this.cvGenerationService.generatePdf(template);
    res.setHeader('Content-Type', 'binary/octet-stream');
    file.pipe(res);
  }
}
