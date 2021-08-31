import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from '../services/articles.service';

let testArticle = {};

const deleteArticleResult = { raw: [], affected: 1 };

const searchDto = {
  value: '',
  permission: 'READ_ARTICLE',
  pagination: {
    page: 0,
    pageSize: 5,
  },
  userId: '333',
};

const createDto = {
  title: 'Create article',
  content: 'Testing creating article',
  edit_positions: [
    {
      access: [
        {
          id: '1',
          name: 'articles',
        },
      ],
      duties: 'Test duties',
      group: {
        color: 'cyan',
        id: '2',
        name: 'Administration',
      },
      id: '3',
      name: 'CEO',
      requirements: 'Test skills',
      salaryMaxLimit: 1000,
      salaryMinLimit: 100,
    },
  ],
  read_positions: [
    {
      access: [
        {
          id: '11',
          name: 'articles',
        },
      ],
      duties: 'Test duties',
      group: {
        color: 'cyan',
        id: '22',
        name: 'Administration',
      },
      id: '33',
      name: 'CEO',
      requirements: 'Test skills',
      salaryMaxLimit: 1000,
      salaryMinLimit: 100,
    },
  ],
};

const updateDto = {
  title: 'Update article',
  content: 'Testing updating article',
  edit_positions: [],
  read_positions: [],
};

const mockArticleService = {
  createArticle: jest.fn((dto) => {
    return {
      id: '12345',
      create_at: '2021-08-26T07:21:58.080Z',
      update_at: '2021-08-26T07:21:58.080Z',
      ...dto,
    };
  }),
  updateArticle: jest.fn((id, dto) => {
    return {
      id,
      create_at: '2021-08-26T07:21:58.080Z',
      update_at: '2021-08-26T07:21:58.082Z',
      ...dto,
    };
  }),
  getArticleList: jest.fn((dto) => {
    if (!dto.value) {
      return [testArticle];
    } else {
      return [];
    }
  }),
  getArticleById: jest.fn((id) => {
    return testArticle;
  }),
  deleteArticle: jest.fn((id) => {
    return deleteArticleResult;
  }),
};

describe('ArticlesController', () => {
  let articlesController: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [ArticlesService],
    })
      .overrideProvider(ArticlesService)
      .useValue(mockArticleService)
      .compile();

    articlesController = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(articlesController).toBeDefined();
  });

  describe('create an article', () => {
    it('should create an article', async () => {
      testArticle = await articlesController.createArticle(createDto);
      expect(mockArticleService.createArticle(createDto)).toEqual(testArticle);

      expect(mockArticleService.createArticle).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update the article', () => {
    it('should update the article', async () => {
      const id = '12345';
      const updatedArticle = await articlesController.updateArticle(
        id,
        updateDto,
      );
      expect(mockArticleService.updateArticle(id, updateDto)).toEqual(
        updatedArticle,
      );
      expect(mockArticleService.updateArticle).toHaveBeenCalledWith(
        id,
        updateDto,
      );
    });
  });

  describe('get articles', () => {
    it('should return an array of articles', async () => {
      const articles = await articlesController.getArticleList(searchDto);
      expect(mockArticleService.getArticleList(searchDto)).toEqual(articles);

      expect(mockArticleService.getArticleList).toHaveLength(1);
    });

    it('should return empty array', async () => {
      const searchNoResult = {
        ...searchDto,
        value: 'There are no articles with this value',
      };
      const articles = await articlesController.getArticleList(searchNoResult);
      expect(articles).toEqual([]);
    });
  });

  describe('get the article by id', () => {
    it('should return the article', async () => {
      const articleId = '12345';
      const article = await articlesController.getArticleById(articleId);
      expect(mockArticleService.getArticleById(articleId)).toEqual(article);
      expect(mockArticleService.getArticleById).toHaveBeenCalledWith(articleId);
    });
  });

  describe('delete the article', () => {
    it('should delete the article', async () => {
      const articleId = '12345';
      const deleteResult = await articlesController.deleteArticle(articleId);
      expect(mockArticleService.deleteArticle(articleId)).toEqual(deleteResult);
    });
  });
});
