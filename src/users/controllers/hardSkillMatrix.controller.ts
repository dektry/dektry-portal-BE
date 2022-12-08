import {
  Controller,
  Body,
  Get,
  Param,
  UseGuards,
  Put,
  Post,
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

import { HardSkillMatrixService } from '../services/hardSkillMatrix.service';
import {
  HardSkillMatrixCreateDto,
  HardSkillMatrixGetDto,
  HardSkillMatrixGetDetailsDto,
  HardSkillMatrixUpdateDto,
  HardSkillMatrixCopyDto,
} from '../dto/hardSkillMatrix.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('hard-skill-matrix')
@ApiTags('Hard-skill-matrix')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class HardSkillMatrixController {
  constructor(private HardSkillMatrixService: HardSkillMatrixService) {}

  @Post()
  @ApiBody({ type: HardSkillMatrixCreateDto })
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: HardSkillMatrixCreateDto) {
    return this.HardSkillMatrixService.create(payload);
  }

  @Post('copy')
  @ApiBody({ type: HardSkillMatrixCopyDto })
  @UseGuards(JwtAuthGuard)
  copy(@Body() payload: HardSkillMatrixCopyDto) {
    return this.HardSkillMatrixService.copy(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: HardSkillMatrixGetDto,
    isArray: true,
    description: 'All matrix(only id/names)',
  })
  getAll(): Promise<HardSkillMatrixGetDto[]> {
    return this.HardSkillMatrixService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @ApiOkResponse({
    type: HardSkillMatrixGetDetailsDto,
    description: 'Matrix details by mattix id',
  })
  getDetails(@Param('id') id: string): Promise<HardSkillMatrixGetDetailsDto> {
    return this.HardSkillMatrixService.getDetails(id);
  }

  @Put('/:id')
  @ApiBody({ type: HardSkillMatrixUpdateDto })
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() payload: HardSkillMatrixUpdateDto) {
    return this.HardSkillMatrixService.update(payload, id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'This is positionId' })
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
    return this.HardSkillMatrixService.deleteHardSkillMatrix(id);
  }
}
