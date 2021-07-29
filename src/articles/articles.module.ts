import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { articleRepository } from './repositories/articles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([articleRepository])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
