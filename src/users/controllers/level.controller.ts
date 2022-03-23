import {
  Controller,
  Body,
  Get,
  Param,
  UseGuards,
  Put,
  Post,
  Delete,
} from "@nestjs/common";
import { CareerLevelEntity } from "../entity/careerLevel.entity";
import { Permission } from "../../decorators/permission.decorator";
import { Permissions } from "../../enums/permissions.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../../auth/guards/permission.guard";
import { DeleteResult } from "typeorm";
import { LevelsService } from "../services/level.service";

export interface LevelProps {
  name: string;
}

@Controller("levels")
export class LevelsController {
  constructor(private LevelsService: LevelsService) {}

  @Permission(Permissions.getAllLevels)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<CareerLevelEntity[]> {
    return this.LevelsService.getAll();
  }

  @Permission(Permissions.createLevel)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() levelProps: LevelProps): Promise<CareerLevelEntity> {
    return this.LevelsService.createLevel(levelProps);
  }

  @Permission(Permissions.updateLevel)
  @UseGuards(JwtAuthGuard)
  @Put()
  updateLevel(
    @Param("id") id: string,
    @Body() levelProps: LevelProps
  ): Promise<CareerLevelEntity> {
    return this.LevelsService.updateLevel(id, levelProps);
  }

  @Permission(Permissions.deleteLevel)
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  deleteLevel(@Param("id") id: string): Promise<DeleteResult> {
    return this.LevelsService.deleteLevel(id);
  }
}
