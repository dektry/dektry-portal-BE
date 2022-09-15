import { Controller, Get } from '@nestjs/common';

@Controller('cv-generation')
export class CVGenerationController {
  @Get('template/:name')
  getTemplate() {
    return 'Check template';
  }
}
