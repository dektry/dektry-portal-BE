import {
  Controller,
  Body,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Permission } from '../../decorators/permission.decorator';
import { Permissions } from '../../enums/permissions.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { ProjectsHistoryService } from '../services/projectsHistory.service';
import { ProjectHistoryEntity } from '../entity/projectHistory.entity';

@Controller('projectsHistory')
export class ProjectsHistoryController {
  constructor(private ProjectsHistoryService: ProjectsHistoryService) {}

  @Permission(Permissions.updateProjectHistory)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put('/:id')
  updateProjectHistory(
    @Param('id') id: string,
    @Body() historyProps: {from: string, to: string},
  ): Promise<ProjectHistoryEntity> {
    return this.ProjectsHistoryService.updateProjectHistory(historyProps);
  }
}
