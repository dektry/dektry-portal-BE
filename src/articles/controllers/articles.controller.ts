import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { Permission } from 'decorators/permission.decorator';
import { Permissions } from 'enums/permissions.enum';

@Controller()
export class ArticlesController {
  constructor(private ArticlesService: ArticlesService) {}

  @Permission(Permissions.getAllArticles)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Get('articles')
  getArticleList() {
    return this.ArticlesService.getArticleList();
  }

  @Get('article/:id')
  getArticleById() {
    console.log('getArticleById');
  }
}
