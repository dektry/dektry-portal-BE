import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';
import { SaveArticleDto, SearchValueDto } from '../dto/articles.dto';
import { ArticleEntity } from '../entity/articles.entity';
export interface IArticleList {
  articleList: ArticleEntity[];
  count: number;
}
@Controller('articles')
export class ArticlesController {
  constructor(private ArticlesService: ArticlesService) {}

  @Permission(Permissions.getAllArticles)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  getArticleList(
    @Body() searchValueDto: SearchValueDto,
  ): Promise<IArticleList> {
    return this.ArticlesService.getArticleList(searchValueDto);
  }

  @Permission(Permissions.getArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get(':id')
  getArticleById(@Param('id') id: string): Promise<ArticleEntity> {
    return this.ArticlesService.getArticleById(id);
  }

  @Permission(Permissions.updateArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: SaveArticleDto,
  ): Promise<ArticleEntity> {
    return this.ArticlesService.updateArticle(id, updateArticleDto);
  }

  @Permission(Permissions.createArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('create')
  createArticle(
    @Body() saveArticleDto: SaveArticleDto,
  ): Promise<ArticleEntity> {
    return this.ArticlesService.createArticle(saveArticleDto);
  }

  @Permission(Permissions.deleteArticle)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    return this.ArticlesService.deleteArticle(id);
  }
}
