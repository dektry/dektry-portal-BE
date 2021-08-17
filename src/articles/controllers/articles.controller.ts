import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { UpdateArticleDto } from '../dto/articles.dto';
import { ArticleEntity } from '../entity/articles.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private ArticlesService: ArticlesService) {}

  @Permission(Permissions.getAllArticles)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get()
  getArticleList() {
    return this.ArticlesService.getArticleList();
  }

  @Permission(Permissions.getArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  getArticleById(@Param('id') id: string) {
    return this.ArticlesService.getArticleById(id);
  }

  @Permission(Permissions.updateArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.ArticlesService.updateArticle(id, updateArticleDto);
  }
}
