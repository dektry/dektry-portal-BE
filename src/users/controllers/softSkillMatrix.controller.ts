import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { SoftSkillMatrixService } from '../services/softSkillMatrix.service';

import {
  SoftSkillMatrixCreateDto,
  SoftSkillMatrixGetAllDto,
  SoftSkillMatrixGetDetailsDto,
  SoftSkillMatrixCopyDto,
  SoftSkillMatrixCopyResponseDto,
  SoftSkillMatrixUpdateDto,
} from '../dto/softSkillMatrix.dto';

@Controller('soft-skill-matrix')
@ApiTags('Soft-skill-matrix')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class SoftSkillMatrixController {
  constructor(private SoftSkillMatrixService: SoftSkillMatrixService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    type: SoftSkillMatrixGetAllDto,
    isArray: true,
    description: 'All matrix(only id/names)',
  })
  getAll(): Promise<SoftSkillMatrixGetAllDto[]> {
    return this.SoftSkillMatrixService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @ApiOkResponse({
    type: SoftSkillMatrixGetDetailsDto,
    description: 'Matrix details by mattix id',
  })
  getDetails(@Param('id') id: string): Promise<SoftSkillMatrixGetDetailsDto> {
    return this.SoftSkillMatrixService.getDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: SoftSkillMatrixCreateDto })
  create(@Body() payload: SoftSkillMatrixCreateDto) {
    return this.SoftSkillMatrixService.create(payload);
  }

  @Post('copy')
  @ApiBody({ type: SoftSkillMatrixCopyDto })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: SoftSkillMatrixCopyResponseDto,
  })
  copy(
    @Body() payload: SoftSkillMatrixCopyDto,
  ): Promise<SoftSkillMatrixCopyResponseDto> {
    return this.SoftSkillMatrixService.copy(payload);
  }

  @Put('/:id')
  @ApiBody({ type: SoftSkillMatrixUpdateDto })
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() payload: SoftSkillMatrixUpdateDto) {
    return this.SoftSkillMatrixService.update(payload, id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        raw: [],
        affected: 1,
      },
    },
  })
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.SoftSkillMatrixService.deleteSoftSkillMatrix(id);
  }
}
