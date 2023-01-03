import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, In } from 'typeorm';

import { positionRepository } from 'users/repositories/position.repository';
import { employeeSkillToInterviewRepository } from '../repositories/skillToInterview.repository';
import { employeeInterviewRepository } from '../repositories/interview.repository';
import { employeeRepository } from '../repositories/employee.repository';
import { levelRepository } from 'users/repositories/level.repository';
import { skillRepository } from '../../users/repositories/skill.repository';
import { hardSkillMatrixRepository } from '../../users/repositories/hardSkillMatrix.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { SkillToInterviewEntity } from '../entity/skillToInterview.entity';
import { InterviewEntity } from '../entity/interview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { SkillsToLevelsEntity } from 'users/entity/skillsToLevels.entity';

import { HardSkillMatrixService } from '../../users/services/hardSkillMatrix.service';

import { interviewIsOver } from 'candidates/utils/constants';
import { employeeNotFound, techAssessmentIsNotFound } from '../utils/constants';
import {
  CompleteInterviewsDto,
  InterviewResultDto,
  GetAllInterviewsDto,
  EditInterviewDto,
} from '../dto/interviews.dto';

import { Helper } from 'utils/helpers';

@Injectable()
export class EmployeeInterviewService {
  constructor(
    @InjectRepository(employeeInterviewRepository)
    private interviewRepository: employeeInterviewRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(employeeSkillToInterviewRepository)
    private skillToInterviewRepository: employeeSkillToInterviewRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(levelRepository)
    private levelRepository: levelRepository,
    @InjectRepository(skillRepository)
    private skillRepository: skillRepository,
    @InjectRepository(hardSkillMatrixRepository)
    private hardSkillMatrixRepository: hardSkillMatrixRepository,
    @Inject(HardSkillMatrixService)
    private readonly hardSkillMatrixService: HardSkillMatrixService,
  ) {}

  async getInterviewResult(interviewId: string): Promise<InterviewResultDto> {
    try {
      const helper = new Helper();

      const interview: InterviewEntity = await this.interviewRepository.findOne(
        {
          where: {
            id: interviewId,
          },
          relations: ['level', 'position'],
        },
      );

      if (interview) {
        const answers = await helper.getInterviewAnswers(
          interview,
          SkillToInterviewEntity,
          SkillsToLevelsEntity,
        );
        const interviewForResponse = {
          created: interview.created,
          level: interview.level.name,
          position: interview.position.name,
        };
        return {
          ...interviewForResponse,
          answers,
        };
      }
      throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_RESULT_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async completeInterview(
    interview: CompleteInterviewsDto,
  ): Promise<InterviewResultDto> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        interview.employeeId,
      );

      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level: CareerLevelEntity = await this.levelRepository.findOne(
        interview.levelId,
      );

      const savedInterview = await this.interviewRepository.save({
        employee,
        position,
        level,
        comment: interview.comment ?? null,
      });

      const interviewSkillsGrades: SkillToInterviewEntity[] =
        interview.grades.map((grade) =>
          this.skillToInterviewRepository.create({
            interview_id: savedInterview,
            skill_id: { id: grade.skillId },
            value: grade.value,
          }),
        );

      await this.skillToInterviewRepository.save(interviewSkillsGrades);

      return await this.getInterviewResult(savedInterview.id);
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_COMPLETE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editInterview(interview: EditInterviewDto, interviewId: string) {
    try {
      const prevResultsOfInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            id: interviewId,
          },
        });

      if (!prevResultsOfInterview)
        throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);

      if (prevResultsOfInterview.comment !== interview.comment) {
        await this.interviewRepository.update(
          { id: prevResultsOfInterview.id },
          {
            comment: interview.comment,
          },
        );
      }

      const interviewSkillsPrevGrades: SkillToInterviewEntity[] =
        await this.skillToInterviewRepository.find({
          where: {
            id: In(interview.grades.map((grade) => grade.gradeId)),
          },
        });

      //update selected assessment skills grades (Basic, Expert...)
      if (interviewSkillsPrevGrades.length) {
        for (let grade of interviewSkillsPrevGrades) {
          for (let gradeFromPayload of interview.grades) {
            if (
              grade.id === gradeFromPayload.gradeId &&
              grade.value !== gradeFromPayload.value
            ) {
              await this.skillToInterviewRepository.update(
                { id: grade.id },
                { value: gradeFromPayload.value },
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_EDIT_ERROR]', error);
      Logger.error(error);
      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllInterviews(employeeId: string): Promise<GetAllInterviewsDto[]> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const interviews: InterviewEntity[] = await this.interviewRepository.find(
        {
          where: {
            employee: employee,
          },
          relations: ['level', 'position'],
        },
      );

      if (interviews?.length) {
        return interviews.map((item) => ({
          created: item.created,
          updated: item.updated,
          type: item.type,
          id: item.id,
          position: item.position.name,
          level: item.level.name,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('[EMPLOYEE_ALL_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteInterviewResult(id: string) {
    try {
      const interviewWasDeleted: DeleteResult =
        await this.interviewRepository.delete(id);

      if (!interviewWasDeleted.affected) {
        throw new NotFoundException(`Intreview with ID '${id}' not found`);
      }
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_DELETE_ERROR]', error);
      Logger.error(error);

      throw new HttpException(
        error?.response
          ? {
              status: error?.status,
              message: error?.response?.message ?? error?.response,
            }
          : techAssessmentIsNotFound,
        error?.status,
      );
    }
  }

  async getAssessmentComparison(employeeId: string) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const interviews = await this.interviewRepository.find({
        where: {
          employee: employee,
        },
        relations: [
          'skills',
          'skills.skill_id',
          'skills.skill_id.skill_group_id',
        ],
      });
      const tableHeader: Array<string> = ['Skill'];
      const tableBody: Array<Array<string>> = [];

      interviews.forEach((interview, index) => {
        const tableBodyElement: Array<string> = [];

        tableHeader.push(String(interview.created));

        interview.skills.forEach((skill) => {
          tableBodyElement.push(skill.skill_id.value);
          return;
        });
      });

      return interviews;
    } catch (error) {
      console.error('[EMPLOYEE_ASSESSMENT_COMPARISON_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getInterviewById(interviewId: string) {
    try {
      const interviews: InterviewEntity =
        await this.interviewRepository.findOne({
          relations: [
            'position',
            'level',
            'skills',
            'skills.skill_id',
            'skills.skill_id.skill_group_id',
          ],
          where: {
            id: interviewId,
          },
        });

      const matrixId = await this.hardSkillMatrixRepository.query(
        `
          SELECT id 
              FROM public."hardSkillMatrix" WHERE position_id = $1
        `,
        [interviews.position.id],
      );

      if (!matrixId?.length)
        throw new HttpException('Interview not found', HttpStatus.BAD_REQUEST);

      const hardSkillMatrix = await this.hardSkillMatrixService.getDetails(
        matrixId[0]?.id,
      );

      //formatting matrix for FE Interview edit page
      for (let i = 0; i < interviews.skills.length; i++) {
        for (let j = 0; j < hardSkillMatrix.skillGroups.length; j++) {
          if (
            hardSkillMatrix.skillGroups[j]?.id ===
            interviews.skills[i]?.skill_id?.skill_group_id?.id
          ) {
            for (
              let k = 0;
              k < hardSkillMatrix.skillGroups[j].skills.length;
              k++
            ) {
              if (
                hardSkillMatrix.skillGroups[j].skills[k].id ===
                interviews.skills[i]?.skill_id?.id
              ) {
                hardSkillMatrix.skillGroups[j].skills[k]['currentSkillLevel'] =
                  {
                    id: interviews.skills[i].id,
                    value: interviews.skills[i].value,
                  };
              }
            }
          }
        }
      }

      //added interview assessment comment
      hardSkillMatrix['comment'] = interviews.comment;

      //added interview assessment date created
      hardSkillMatrix['created'] = interviews.created;

      //added interview assessment level(middle/senior...)
      hardSkillMatrix['level'] = {
        id: interviews.level.id,
        name: interviews.level.name,
      };

      return hardSkillMatrix;
    } catch (error) {
      console.error('[EMPLOYEE_ASSESSMENT_EDIT_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
