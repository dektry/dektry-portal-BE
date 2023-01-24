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

import { EnglishSkillMatrixService } from '../services/englishSkillMatrix.service';
import {
  EnglishSkillMatrixCreateDto,
  EnglishSkillMatrixGetDto,
  EnglishSkillMatrixGetDetailsDto,
  EnglishSkillMatrixUpdateDto,
  EnglishSkillMatrixCopyDto,
  EnglishSkillMatrixCopyResponseDto,
} from '../dto/englishSkillMatrix.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('english-skill-matrix')
@ApiTags('English-skill-matrix')
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 400,
  description: 'Bad Request',
})
export class EnglishSkillMatrixController {
  constructor(private EnglishSkillMatrixService: EnglishSkillMatrixService) {}

  @Post()
  @ApiBody({ type: EnglishSkillMatrixCreateDto })
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: EnglishSkillMatrixCreateDto) {
    return this.EnglishSkillMatrixService.create(payload);
  }

  @Post('copy')
  @ApiBody({ type: EnglishSkillMatrixCopyDto })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: EnglishSkillMatrixCopyResponseDto,
  })
  copy(
    @Body() payload: EnglishSkillMatrixCopyDto,
  ): Promise<EnglishSkillMatrixCopyResponseDto> {
    return this.EnglishSkillMatrixService.copy(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: EnglishSkillMatrixGetDto,
    isArray: true,
    description: 'All matrix(only id/names)',
  })
  getAll(): Promise<EnglishSkillMatrixGetDto[]> {
    return this.EnglishSkillMatrixService.getAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @ApiOkResponse({
    type: EnglishSkillMatrixGetDetailsDto,
    description: 'Matrix details by mattix id',
  })
  getDetails(
    @Param('id') id: string,
  ): Promise<EnglishSkillMatrixGetDetailsDto> {
    return this.EnglishSkillMatrixService.getDetails(id);
  }

  @Put('/:id')
  @ApiBody({ type: EnglishSkillMatrixUpdateDto })
  @ApiParam({ name: 'id', required: true, description: 'This is matrixId' })
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() payload: EnglishSkillMatrixUpdateDto,
  ) {
    return this.EnglishSkillMatrixService.update(payload, id);
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
    return this.EnglishSkillMatrixService.deleteEnglishSkillMatrix(id);
  }
}
