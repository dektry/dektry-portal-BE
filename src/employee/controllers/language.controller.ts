import {
  Controller,
  Delete,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { LanguageDto } from '../dto/language.dto';
import { LanguageEntity } from '../entity/language.entity';
import { LanguageService } from '../services/language.service';

@Controller('language')
export class LanguageController {
  constructor(private LanguageService: LanguageService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId')
  getLanguages(
    @Param('employeeId') employeeId: string,
  ): Promise<LanguageEntity[]> {
    return this.LanguageService.getLanguages(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createLanguage(@Body() createLanguageBody: LanguageDto) {
    return this.LanguageService.createLanguage(createLanguageBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editLanguage(@Body() editLanguageBody: LanguageDto) {
    return this.LanguageService.editLanguage(editLanguageBody);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':languageId')
  deleteLanguage(@Param('languageId') languageId: string) {
    return this.LanguageService.deleteLanguage(languageId);
  }
}
