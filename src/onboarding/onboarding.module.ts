import { Module } from '@nestjs/common';
import { TemplatesController } from './controllers/templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tasksRepository } from './repositories/tasks.repository';
import { groupsRepository } from './repositories/groups.repository';
import { UsersModule } from 'users/users.module';
import { templatesRepository } from './repositories/template.repository';
import { TemplatesService } from './services/templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      tasksRepository,
      groupsRepository,
      templatesRepository,
    ]),
    UsersModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class OnboardingModule {}
