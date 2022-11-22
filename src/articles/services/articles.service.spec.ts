import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { usersRepository } from '../../users/repositories/users.repository';
import { articleRepository } from '../repositories/articles.repository';

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

const searchDto = {
  value: '',
  permission: 'READ_ARTICLE',
  pagination: {
    page: 0,
    pageSize: 5,
  },
  userId: '123',
};

const mockArticleFindData = (dto) =>
  Promise.resolve([
    {
      id: '12345',
      create_at: '2021-08-26T07:21:58.080Z',
      update_at: '2021-08-26T07:21:58.080Z',
      ...dto,
    },
  ]);

const mockArticleRepository = {
  find: jest
    .fn()
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(async () => mockArticleFindData(createDto))
    .mockImplementationOnce(() => [])
    .mockImplementationOnce(async () => mockArticleFindData(createDto))
    .mockImplementationOnce(async () => mockArticleFindData(createDto))
    .mockImplementationOnce(() => []),
  save: jest.fn().mockImplementation(async (dto) => {
    const [data] = await mockArticleFindData(dto);
    return data;
  }),
  findOne: jest.fn().mockImplementation(async () => {
    const [data] = await mockArticleFindData(createDto);
    return data;
  }),
  findAndCount: jest
    .fn()
    .mockImplementationOnce(async () => {
      const data = await mockArticleFindData(createDto);
      return [data, 1];
    })
    .mockImplementationOnce(async () => {
      return [[], 0];
    }),
};

const mockUserFindData = (permission) =>
  Promise.resolve({
    role: {
      id: '3baa7ccc-106a-4980-ba29-9458ea1530c3',
      permissions: [
        {
          name: permission,
        },
      ],
    },
    career: [
      {
        position: {
          id: '1',
        },
      },
    ],
  });

const mockUserRepository = {
  findOne: jest
    .fn()
    .mockImplementationOnce(async () => mockUserFindData('READ_ARTICLE'))
    .mockImplementationOnce(async () => mockUserFindData('CREATE_ARTICLE')),
};

describe('ArticlesService', () => {
  let articleService: ArticlesService;
  let articleRep: typeof mockArticleRepository;
  let userRep: typeof mockUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(articleRepository),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(usersRepository),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    articleService = module.get<ArticlesService>(ArticlesService);
    articleRep = module.get<typeof mockArticleRepository>(
      getRepositoryToken(articleRepository),
    );
    userRep = module.get<typeof mockUserRepository>(
      getRepositoryToken(usersRepository),
    );
  });

  it('should be defined', () => {
    expect(articleService).toBeDefined();
  });

  describe('create a new article', () => {
    describe('when the article does not exist', () => {
      it('should create and return a new article', async () => {
        const newArticle = await articleRep.save(createDto);
        expect(await articleService.createArticle(createDto)).toEqual({
          id: newArticle.id,
          create_at: expect.any(Date),
          update_at: expect.any(Date),
          title: newArticle.title,
          content: newArticle.content,
          edit_positions: newArticle.edit_positions,
          read_positions: newArticle.read_positions,
        });
      });
    });

    describe('when the article already exists', () => {
      it('should throw the "ConflictException"', async () => {
        try {
          await articleService.createArticle(createDto);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe('update the article', () => {
    describe('when the article with title does not exist', () => {
      it('should update the article and return it', async () => {
        const id = '12345';
        const updatedArticle = await articleRep.save(updateDto);
        expect(await articleService.updateArticle(id, updateDto)).toEqual({
          id: updatedArticle.id,
          create_at: expect.any(String),
          update_at: expect.any(Date),
          title: updatedArticle.title,
          content: updatedArticle.content,
          edit_positions: updatedArticle.edit_positions,
          read_positions: updatedArticle.read_positions,
        });
      });
    });

    describe('when the article with title already exists', () => {
      it('should throw the "ConflictException"', async () => {
        const id = '123';
        try {
          await articleService.updateArticle(id, createDto);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe('get articles', () => {
    describe('when user has read permission', () => {
      it('should return all articles', async () => {
        const article = await articleRep.save(createDto);
        expect(await articleService.getArticleList(searchDto)).toEqual({
          articleList: expect.arrayContaining([article]),
          count: 1,
        });
      });
    });

    describe('when user has not read permission', () => {
      it('should return articles, which user can read', async () => {
        expect(await articleService.getArticleList(searchDto)).toEqual({
          articleList: expect.arrayContaining([]),
          count: 0,
        });
      });
    });
  });

  describe('get an article by id', () => {
    describe('when the article exists', () => {
      it('should return the article', async () => {
        const article = await articleRep.save(createDto);
        const id = '12345';
        expect(await articleService.getArticleById(id)).toEqual({
          id: article.id,
          create_at: expect.any(String),
          update_at: expect.any(String),
          title: article.title,
          content: article.content,
          edit_positions: article.edit_positions,
          read_positions: article.read_positions,
        });
      });
    });

    describe('when the article does not exists', () => {
      const id = '12345';
      it('should throw the "NotFoundException"', async () => {
        try {
          await articleService.getArticleById(id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
