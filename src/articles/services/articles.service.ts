import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { articleRepository } from '../repositories/articles.repository';
import { ArticleEntity } from '../entity/articles.entity';
import { SaveArticleDto } from 'articles/dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articleRepository)
    private articleRepository: articleRepository,
  ) {}

  async getArticleList(searchValue): Promise<ArticleEntity[]> {
    const value = searchValue?.value || '';

    const articleList = await this.articleRepository
      .createQueryBuilder('articles')
      .where('title ILIKE :value', { value: `%${value}%` })
      .leftJoinAndSelect('articles.read_positions', 'read_positions')
      .leftJoinAndSelect('articles.edit_positions', 'edit_positions')
      .orderBy('update_at', 'DESC')
      .getMany();

    return articleList;
  }

  async getArticleById(id: string): Promise<ArticleEntity> {
    const [article] = await this.articleRepository.find({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID '${id}' not found`);
    } else {
      return article;
    }
  }

  async createArticle(params: SaveArticleDto): Promise<ArticleEntity> {
    const { title, content, edit_positions, read_positions } = params;

    const newArticle = await this.articleRepository.save({
      title,
      content,
      edit_positions,
      read_positions,
      update_at: new Date(),
      create_at: new Date(),
    });

    return newArticle;
  }

  async updateArticle(
    id: string,
    params: SaveArticleDto,
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

  async deleteArticle(id: string): Promise<DeleteResult> {
    try {
      const deletedArticle = await this.articleRepository.delete(id);
      if (!deletedArticle.affected) {
        throw new NotFoundException(`Article with ID '${id}' not found`);
      }

      return deletedArticle;
    } catch (error) {
      return error;
    }
  }
}
