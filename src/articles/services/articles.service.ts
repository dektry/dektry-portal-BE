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
    private articleRepository: Repository<articleRepository>,
  ) {}

  async getArticleList() {
    const articleList = await this.articleRepository
      .createQueryBuilder('articles')
      .orderBy('update_at', 'DESC')
      .getMany();

    return articleList;
  }

  async getArticleById(id: string) {
    const [article] = await this.articleRepository.find({ where: { id } });
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
    // const { title, content, edit_positions, read_positions } = params;

    const updateArticle = await this.articleRepository.update(id, {
      title: params.title,
      content: params.content,
      edit_positions: params.edit_positions,
      read_positions: params.read_positions,
      update_at: new Date(),
    });

    // const updateArticle = await this.articleRepository
    //   .createQueryBuilder()
    //   .update(articleRepository)
    //   .set({ title: params.title })
    //   .where('id = :id', { id })
    //   .execute();
    console.log('updateArticle', updateArticle);
    console.log('updateArticle id', id);
    console.log('updateArticle params', params);
    return updateArticle;
  }
}
