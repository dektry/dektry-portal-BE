import {
  Controller,
  Body,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectsHistoryService } from '../services/projectsHistory.service';
import { ProjectHistoryEntity } from '../entity/projectHistory.entity';

@Controller('projectsHistory')
export class ProjectsHistoryController {
  constructor(private ProjectsHistoryService: ProjectsHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateProjectHistory(
    @Param('id') id: string,
    @Body() historyProps: {from: string, to: string},
  ): Promise<ProjectHistoryEntity> {
    return this.ProjectsHistoryService.updateProjectHistory(historyProps);
  }
}
