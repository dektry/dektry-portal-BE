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

import { CompleteSoftInterviewsDto } from '../dto/softInterviews.dto';
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
    @Body() completeInterviewBody: CompleteSoftInterviewsDto,
  ): Promise<ISoftInterviewResultResponse> {
    return this.SoftInterviewService.editInterviewResult(completeInterviewBody);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':candidateId')
  getInterviewResult(
    @Param('candidateId') candidateId: string,
  ): Promise<ISoftInterviewResultResponse> {
    return this.SoftInterviewService.getInterviewResult(candidateId);
  }
}
