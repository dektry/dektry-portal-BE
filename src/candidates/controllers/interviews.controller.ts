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
import { IAnswer, InterviewService } from '../services/interview.service';
import { InterviewEntity } from '../entity/interview.entity';
import { ICompletedInterviewResponse } from 'candidates/utils/constants';

@Controller('interviews')
export class InterviewsController {
  constructor(private InterviewService: InterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeInterview(
    @Body() CompleteInterviewDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.completeInterview(CompleteInterviewDto);
  }

  @Put()
  editInterview(
    @Body() CompleteInterviewDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.editInterview(CompleteInterviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':candidateId')
  getInterviewResult(
    @Param('candidateId') candidateId: string,
  ): Promise<{ interview: InterviewEntity; answers?: IAnswer[] }> {
    return this.InterviewService.getInterviewResult(candidateId);
  }
}
