import { Injectable } from '@nestjs/common';
import { articleRepository } from '../repositories/articles.repository';

@Injectable()
export class ArticlesService {
  async getArticleList() {
    return 'getArticleList BE';
  }
}
