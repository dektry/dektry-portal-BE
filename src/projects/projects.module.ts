import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { projectsRepository } from './repositories/projects.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      projectsRepository,
    ]),
  ],
  providers: [
    ProjectsService,
  ],
  controllers: [
    ProjectsController,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
