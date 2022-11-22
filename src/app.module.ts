import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CandidatesModule } from './candidates/candidates.module';
import { EmployeeModule } from './employee/employee.module';
import { CVGenerationModule } from './cv-generation/cv-generation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    CandidatesModule,
    EmployeeModule,
    CVGenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
