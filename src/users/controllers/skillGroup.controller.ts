import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SkillGroupService } from '../services/skillGroup.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SkillGroupEntity } from '../entity/skillGroup.entity';

@Controller('skillgroups')
export class SkillGroupController {
  constructor(private SkillGroupService: SkillGroupService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getSkillGroups() {
    return this.SkillGroupService.getSkillGroups();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':positionId')
  getSkillGroupsById(@Param('positionId') positionId: string) {
    return this.SkillGroupService.getSkillGroupsByPositionId(positionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:positionId/:levelId')
  getSkillGroupsByIds(
    @Param('positionId') positionId: string,
    @Param('levelId') levelId: string,
  ) {
    return this.SkillGroupService.getSkillGroupsByIds(positionId, levelId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  updateSkillGroup(@Body() UpdateSkillGroupDto): Promise<SkillGroupEntity[]> {
    return this.SkillGroupService.updateSkillGroup(UpdateSkillGroupDto);
  }
}
