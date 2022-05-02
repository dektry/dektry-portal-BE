import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { IAnswer, InterviewService } from '../services/interview.service';
import { InterviewEntity } from '../entity/interview.entity';

@Controller('interviews')
export class InterviewsController {
  constructor(private InterviewService: InterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeInterview(
    @Body() CompleteInterviewDto,
  ): Promise<{ interview: InterviewEntity; answers?: IAnswer[] }> {
    return this.InterviewService.completeInterview(CompleteInterviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':candidateId')
  getInterviewResult(
    @Param('candidateId') candidateId: string,
  ): Promise<{ interview: InterviewEntity; answers?: IAnswer[] }> {
    return this.InterviewService.getInterviewResult(candidateId);
  }
}
