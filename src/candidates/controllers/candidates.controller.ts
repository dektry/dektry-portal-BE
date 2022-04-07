import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CandidatesService } from '../services/candidates.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('candidates')
export class CandidatesController {
  constructor(private CandidatesService: CandidatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCandidatesList(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('field') field?: string,
  ) {
    return this.CandidatesService.getCandidatesList(limit, page, order, field);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getCandidates(@Param('id') id: string) {
    return this.CandidatesService.getCandidate(id);
  }
}
