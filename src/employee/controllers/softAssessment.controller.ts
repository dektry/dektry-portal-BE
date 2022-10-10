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
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

import { EmployeeSoftAssessmentService } from 'employee/services/softAssessment.service';
import {
  ICompleteSoftAssessmentBody,
  IEditSoftAssessmentBody,
  ISoftAssessmentResultResponse,
} from 'employee/utils/constants';

@Controller('softassessments')
export class EmployeeSoftAssessmentController {
  constructor(private SoftAssessmentService: EmployeeSoftAssessmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  completeAssessment(
    @Body() completeAssessmentBody: ICompleteSoftAssessmentBody,
  ) {
    return this.SoftAssessmentService.completeAssessment(
      completeAssessmentBody,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':assessmentId')
  editAssessmentResult(
    @Param('assessmentId') assessmentId: string,
    @Body() editAssessmentBody: IEditSoftAssessmentBody,
  ): Promise<ISoftAssessmentResultResponse> {
    return this.SoftAssessmentService.editAssessmentResult(
      assessmentId,
      editAssessmentBody,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':assessmentId')
  getAssessmentResult(
    @Param('assessmentId') assessmentId: string,
  ): Promise<ISoftAssessmentResultResponse> {
    return this.SoftAssessmentService.getAssessmentResult(assessmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':employeeId/all')
  getSoftAssessments(
    @Param('employeeId') emloyeeId: string,
  ): Promise<ISoftAssessmentResultResponse[]> {
    return this.SoftAssessmentService.getSoftAssessments(emloyeeId);
  }
}
