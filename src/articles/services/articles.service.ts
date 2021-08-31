import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike } from 'typeorm';
import { articleRepository } from '../repositories/articles.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { ArticleEntity } from '../entity/articles.entity';
import { SaveArticleDto } from 'articles/dto/articles.dto';
import { IArticleList } from '../controllers/articles.controller';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(articleRepository)
    private articleRepository: articleRepository,
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getArticleList(searchParam): Promise<IArticleList> {
    const { value, pagination, permission, userId } = searchParam;
    const searchValue = value || '';
    const page = pagination?.page || 1;
    const take = pagination?.pageSize || 5;
    const skip = (page - 1) * take;

    const currentUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions', 'career', 'career.position'],
    });

    let articleList = [];
    let total = 0;

    // if (currentUser) {
    const accessGranted = currentUser.role.permissions.filter(
      (rolePermission) => rolePermission.name === permission,
    );
    const currentUserPositionId = currentUser.career[0]?.position?.id;

    if (!accessGranted.length) {
      [articleList, total] = await this.articleRepository.findAndCount({
        where: (qb) => {
          qb.where({
            title: ILike('%' + searchValue + '%'),
          }).andWhere(
            'ArticleEntity_read_positions_ArticleEntity.positionsId = :positionsId',
            {
              positionsId: currentUserPositionId,
            },
          );
        },
        order: { update_at: 'DESC' },
        skip,
        take,
      });
    } else {
      [articleList, total] = await this.articleRepository.findAndCount({
        where: { title: ILike('%' + searchValue + '%') },
        order: { update_at: 'DESC' },
        skip,
        take,
      });
    }
    // }

    return {
      articleList,
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

    const existArticle = await this.articleRepository.find({
      where: { title },
    });

    if (existArticle.length) {
      throw new ConflictException(
        `Article with '${title}' title already exists!`,
      );
    } else {
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
  }

  async updateArticle(
    id: string,
    params: SaveArticleDto,
  ): Promise<ArticleEntity> {
    const { title, content, edit_positions, read_positions } = params;

    const [existArticle] = await this.articleRepository.find({
      where: { title },
    });

    if (existArticle && existArticle?.id !== id) {
      throw new ConflictException(
        `Article with '${title}' title already exists!`,
      );
    } else {
      const currentArticle = await this.articleRepository.findOne({
        where: { id },
      });

      const updateArticle = await this.articleRepository.save({
        ...currentArticle,
        title,
        content,
        edit_positions,
        read_positions,
        update_at: new Date(),
      });

      return updateArticle;
    }
  }

  async deleteArticle(id: string): Promise<DeleteResult> {
    try {
      const deletedArticle = await this.articleRepository.delete(id);
      if (!deletedArticle.affected) {
        throw new NotFoundException(`Article with ID '${id}' not found`);
      } else {
        return deletedArticle;
      }
    } catch (error) {
      return error;
    }
  }
}
