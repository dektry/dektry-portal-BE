import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { articleRepository } from '../repositories/articles.repository';
import { ArticleEntity } from '../entity/articles.entity';
import { UpdateArticleDto } from 'articles/dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articleRepository)
    private articleRepository: articleRepository,
  ) {}

  async getArticleList(): Promise<ArticleEntity[]> {
    const articleList = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.read_positions', 'read_positions')
      .leftJoinAndSelect('articles.edit_positions', 'edit_positions')
      .orderBy('update_at', 'DESC')
      .getMany();

    return articleList;
  }

  async getArticleById(id: string): Promise<ArticleEntity> {
    const [article] = await this.articleRepository.find({ where: { id } });
    console.log('article', article);
    if (!article) {
      throw new NotFoundException(`Article with ID '${id}' not found`);
    } else {
      return article;
    }
  }

  async createArticle() {}

  async updateArticle(
    id: string,
    params: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const { title, content, edit_positions, read_positions } = params;

    const article = await this.articleRepository.findOne({
      where: { id },
    });

    const updateArticle = await this.articleRepository.save({
      ...article,
      title,
      content,
      edit_positions,
      read_positions,
      update_at: new Date(),
    });

    return updateArticle;
  }
}
