import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { SoftSkillEntity } from '../entity/softSkill.entity';
import { SoftSkillService } from '../services/softSkill.service';

import { SoftSkillDto } from '../dto/softSkill.dto';

@Controller('softskill')
export class SoftSkillController {
  constructor(private SoftSkillService: SoftSkillService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSoftSkillList(): Promise<SoftSkillEntity[]> {
    return this.SoftSkillService.getSoftSkillList();
  }

  @Post()
  addSoftSkill(@Body() skillBody: SoftSkillDto): Promise<SoftSkillEntity[]> {
    return this.SoftSkillService.addSoftSkill(skillBody);
  }
}
