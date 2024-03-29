import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import {
  CompleteSoftInterviewsDto,
  EditSoftInterviewsDto,
} from '../dto/softInterviews.dto';
import { ISoftInterviewResultResponse } from '../utils/constants';

import { SoftInterviewService } from '../services/softInterview.service';

@Controller('softinterviews')
export class SoftInterviewsController {
  constructor(private SoftInterviewService: SoftInterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeInterview(@Body() completeInterviewBody: CompleteSoftInterviewsDto) {
    return this.SoftInterviewService.completeInterview(completeInterviewBody);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editInterviewResult(
    @Body() editInterviewBody: EditSoftInterviewsDto,
  ): Promise<ISoftInterviewResultResponse> {
    return this.SoftInterviewService.editInterviewResult(editInterviewBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':candidateId')
  getInterviewResult(
    @Param('candidateId') candidateId: string,
  ): Promise<ISoftInterviewResultResponse> {
    return this.SoftInterviewService.getInterviewResult(candidateId);
  }
}
