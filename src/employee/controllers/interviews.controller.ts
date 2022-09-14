import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { InterviewEntity } from '../entity/interview.entity';

import { EmployeeInterviewService } from '../services/interview.service';

import {
  ICompletedInterviewResponse,
  IDeletedInterviewResponse,
} from '../utils/constants';
import {
  CompleteInterviewsDto,
  EditInterviewsDto,
} from './../dto/interviews.dto';

@Controller('employee-interviews')
export class EmployeeInterviewsController {
  constructor(private InterviewService: EmployeeInterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeInterview(
    @Body() completeInterviewDto: CompleteInterviewsDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.completeInterview(completeInterviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  editInterview(
    @Body() editInterviewDto: EditInterviewsDto,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.editInterview(editInterviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':interviewId')
  getInterviewResult(
    @Param('interviewId') interviewId: string,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.getInterviewResult(interviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId/all')
  getAllInterviews(
    @Param('employeeId') employeeId: string,
  ): Promise<InterviewEntity[]> {
    return this.InterviewService.getAllInterviews(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':employeeId')
  deleteInterviewResult(
    @Param('employeeId') employeeId: string,
  ): Promise<IDeletedInterviewResponse> {
    return this.InterviewService.deleteInterviewResult(employeeId);
  }
}
