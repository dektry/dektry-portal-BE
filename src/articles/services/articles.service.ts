import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { articleRepository } from '../repositories/articles.repository';
import { positionRepository } from 'users/repositories/position.repository';
import { usersRepository } from 'users/repositories/users.repository';
import { ArticleEntity } from '../entity/articles.entity';
import { UpdateArticleDto } from 'articles/dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articleRepository)
    private articleRepository: Repository<articleRepository>,
    @InjectRepository(positionRepository)
    private positionRepository: Repository<positionRepository>,
    @InjectRepository(usersRepository)
    private usersRepository: Repository<usersRepository>,
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

  async updateArticle(id: string, params: UpdateArticleDto) {
    const { title, content, edit_positions, read_positions } = params;
    console.log('params', params);
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    const users = await this.usersRepository.find({});
    console.log('users', users);
    const editPositions = await this.positionRepository.find({
      where: [
        ...edit_positions.map((position) => {
          return { name: position };
        }),
      ],
    });

    const readPositions = await this.positionRepository.find({
      where: [
        ...read_positions.map((position) => {
          return { name: position };
        }),
      ],
    });

    const updateArticle = await this.articleRepository.save({
      ...article,
      title,
      content,
      edit_positions: edit_positions.length ? editPositions : [],
      read_positions: read_positions.length ? readPositions : [],
      update_at: new Date(),
    });

    return updateArticle;
  }
}
