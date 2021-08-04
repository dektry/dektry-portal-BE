import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { projectsRepository } from './repositories/projects.repository';
import { ProjectsHistoryController } from './controllers/projectsHistory.controller';
import { ProjectsHistoryService } from './services/projectsHistory.service';
import { projectsHistoryRepository } from './repositories/projectsHistory.repository';
import { usersRepository } from '../users/repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      projectsRepository,
      projectsHistoryRepository,
      usersRepository,
    ]),
  ],
  providers: [
    ProjectsService,
    ProjectsHistoryService,
  ],
  controllers: [
    ProjectsController,
    ProjectsHistoryController,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
