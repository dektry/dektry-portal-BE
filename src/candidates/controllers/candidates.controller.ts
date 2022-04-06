import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { CandidatesService } from '../services/candidates.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('candidates')
export class CandidatesController {
  constructor(private CandidatesService: CandidatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCandidatesList() {
    return this.CandidatesService.getCandidatesList();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getCandidates(@Param('id') id: string) {
    return this.CandidatesService.getCandidate(id);
  }
}
