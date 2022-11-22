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
import { EducationDto } from 'employee/dto/education.dto';
import { EducationEntity } from '../entity/education.entity';
import { EducationService } from '../services/education.service';

@Controller('education')
export class EducationController {
  constructor(private EducationService: EducationService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId')
  getEducation(
    @Param('employeeId') employeeId: string,
  ): Promise<EducationEntity[]> {
    return this.EducationService.getEducation(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createEducation(@Body() createEducationBody: EducationDto) {
    return this.EducationService.createEducation(createEducationBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editEducation(@Body() editEducationBody: EducationDto) {
    return this.EducationService.editEducation(editEducationBody);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':educationId')
  deleteEducation(@Param('educationId') educationId: string) {
    return this.EducationService.deleteEducation(educationId);
  }
}
