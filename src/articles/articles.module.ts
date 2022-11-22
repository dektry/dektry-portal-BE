import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { articleRepository } from './repositories/articles.repository';
import { positionRepository } from 'users/repositories/position.repository';
import { usersRepository } from 'users/repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      articleRepository,
      positionRepository,
      usersRepository,
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
