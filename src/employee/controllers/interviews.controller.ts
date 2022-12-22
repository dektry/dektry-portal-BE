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
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { InterviewEntity } from '../entity/interview.entity';

import { EmployeeInterviewService } from '../services/interview.service';

import {
  ICompletedInterviewResponse,
  IDeletedInterviewResponse,
} from '../utils/constants';
import {
  CompleteInterviewsDto,
  InterviewResultDto,
  EditInterviewsDto,
  GetAllInterviewsDto,
} from './../dto/interviews.dto';

@Controller('employee-interviews')
@ApiBearerAuth()
@ApiTags('employee-interviews-assessment')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class EmployeeInterviewsController {
  constructor(private InterviewService: EmployeeInterviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CompleteInterviewsDto })
  @ApiOkResponse({
    type: InterviewResultDto,
  })
  completeInterview(
    @Body() completeInterviewDto: CompleteInterviewsDto,
  ): Promise<InterviewResultDto> {
    return this.InterviewService.completeInterview(completeInterviewDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put()
  // editInterview(
  //   @Body() editInterviewDto: EditInterviewsDto,
  // ): Promise<ICompletedInterviewResponse> {
  //   return this.InterviewService.editInterview(editInterviewDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':interviewId')
  @ApiOkResponse({
    type: InterviewResultDto,
  })
  getInterviewResult(
    @Param('interviewId') interviewId: string,
  ): Promise<InterviewResultDto> {
    return this.InterviewService.getInterviewResult(interviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId/all')
  @ApiOkResponse({
    isArray: true,
    type: GetAllInterviewsDto,
  })
  getAllInterviews(
    @Param('employeeId') employeeId: string,
  ): Promise<GetAllInterviewsDto[]> {
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
