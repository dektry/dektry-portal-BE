import { Module } from '@nestjs/common';
import { TemplatesController } from './controllers/templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tasksRepository } from './repositories/tasks.repository';
import { groupsRepository } from './repositories/groups.repository';
import { UsersModule } from 'users/users.module';
import { templatesRepository } from './repositories/template.repository';
import { TemplatesService } from './services/templates.service';
import { orderedTasksRepository } from './repositories/orderedTasks.repository';
import { accessRepository } from 'users/repositories/access.repository';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      tasksRepository,
      groupsRepository,
      templatesRepository,
      orderedTasksRepository,
      accessRepository,
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class OnboardingModule {}
