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

import { ICompletedInterviewResponse } from '../utils/constants';
import {
  CompleteInterviewsDto,
  EditInterviewsDto,
} from './../dto/interviews.dto';

@Controller('employee-interviews')
export class EmployeeInterviewsController {
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
  @Get(':employeeId')
  getInterviewResult(
    @Param('employeeId') employeeId: string,
  ): Promise<ICompletedInterviewResponse> {
    return this.InterviewService.getInterviewResult(employeeId);
  }
}
