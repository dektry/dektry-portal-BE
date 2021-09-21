import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './articles/articles.module';
import { ProjectsModule } from './projects/projects.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { VacationsModule } from './vacations/vacations.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    ArticleModule,
    OnboardingModule,
    OnboardingModule,
    ProjectsModule,
    VacationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
