import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike } from 'typeorm';
import { articleRepository } from '../repositories/articles.repository';
import { ArticleEntity } from '../entity/articles.entity';
import { SaveArticleDto } from 'articles/dto/articles.dto';
import { IArticleList } from '../controllers/articles.controller';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articleRepository)
    private articleRepository: articleRepository,
  ) {}

  async getArticleList(searchParam): Promise<IArticleList> {
    const { value, pagination } = searchParam;
    const searchValue = value || '';
    const page = pagination?.page || 1;
    const take = pagination?.pageSize || 10;
    const skip = (page - 1) * take;

    const [result, total] = await this.articleRepository.findAndCount({
      where: { title: ILike('%' + searchValue + '%') },
      order: { update_at: 'DESC' },
      skip,
      take,
    });

    return {
      articleList: result,
      count: total,
    };
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
