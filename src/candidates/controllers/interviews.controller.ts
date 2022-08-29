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

import { InterviewService } from '../services/interview.service';

import { ICompletedInterviewResponse } from 'candidates/utils/constants';
import {
  CompleteInterviewsDto,
  EditInterviewsDto,
} from './../dto/interviews.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private InterviewService: InterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeInterview(
    @Body() completeInterviewDto: CompleteInterviewsDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.completeInterview(completeInterviewDto);
  }

  @Put()
  editInterview(
    @Body() editInterviewDto: EditInterviewsDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.editInterview(editInterviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':candidateId')
  getInterviewResult(
    @Param('candidateId') candidateId: string,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.getInterviewResult(candidateId);
  }
}
