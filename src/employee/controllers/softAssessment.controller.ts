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

import { EmployeeSoftAssessmentService } from 'employee/services/softAssessment.service';

import {
  CompleteSoftInterviewsDto,
  GetAllSoftInterviewsDto,
} from '../dto/softAssessment.dto';

@Controller('employee-soft-assessments')
@ApiBearerAuth()
@ApiTags('Employee-soft-assessments')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class EmployeeSoftAssessmentController {
  constructor(private SoftAssessmentService: EmployeeSoftAssessmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CompleteSoftInterviewsDto })
  completeAssessment(@Body() payload: CompleteSoftInterviewsDto) {
    return this.SoftAssessmentService.completeAssessment(payload);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':assessmentId')
  // editAssessmentResult(
  //   @Param('assessmentId') assessmentId: string,
  //   @Body() editAssessmentBody: IEditSoftAssessmentBody,
  // ): Promise<ISoftAssessmentResultResponse> {
  //   return this.SoftAssessmentService.editAssessmentResult(
  //     assessmentId,
  //     editAssessmentBody,
  //   );
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':assessmentId')
  // getAssessmentResult(
  //   @Param('assessmentId') assessmentId: string,
  // ): Promise<ISoftAssessment> {
  //   return this.SoftAssessmentService.getAssessmentResult(assessmentId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId/all')
  @ApiOkResponse({
    isArray: true,
    type: GetAllSoftInterviewsDto,
  })
  getAllInterviews(
    @Param('employeeId') emloyeeId: string,
  ): Promise<GetAllSoftInterviewsDto[]> {
    return this.SoftAssessmentService.getAllInterviews(emloyeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':interviewId')
  deleteInterviewResult(@Param('interviewId') interviewId: string) {
    return this.SoftAssessmentService.deleteInterviewResult(interviewId);
  }
}
