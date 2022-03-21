import { createConnection, Connection } from 'typeorm';
import { ArticleEntity } from '../src/articles/entity/articles.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { AccessEntity } from '../src/users/entity/access.entity';
import { articleSeed, accessArticleSeed } from './seeds/articles.seed';
import { difference } from 'lodash';

const importArticles = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentArticles = await connection.getRepository(ArticleEntity).find();
  const existPositions = await connection.getRepository(PositionEntity).find();

  const newArticles = articleSeed.filter((newArticle) => {
    const isArticleExist = currentArticles.some(
      (existArticle) => newArticle.title === existArticle.title,
    );
    return !isArticleExist;
  });

  const alreadyExistedNewArticles = difference(articleSeed, newArticles);

  alreadyExistedNewArticles.forEach((article) => {
    console.log(`Article ${article.title} is already exist!`);
  });

  const newArticlesWithPosition = newArticles.map((newArticle) => {
    const formatEditPosition = newArticle.edit_positions.map((position) => {
      const existPositionEntity = existPositions.find(
        (existPosition) => existPosition.name === position,
      );
      return existPositionEntity;
    });

    const formatReadPosition = newArticle.read_positions.map((position) => {
      const existPositionEntity = existPositions.find(
        (existPosition) => existPosition.name === position,
      );
      return existPositionEntity;
    });

    return {
      ...newArticle,
      edit_positions: formatEditPosition,
      read_positions: formatReadPosition,
    };
  });

  const createdArticles = await connection.getRepository(ArticleEntity).save(
    newArticlesWithPosition.map((article) => {
      return connection.getRepository(ArticleEntity).create(article);
    }),
  );

  console.log(`Added ${createdArticles.length} new articles!`);

  // const accessRelation = await connection
  //   .getRepository(PositionEntity)
  //   .findOne({ name: accessArticleSeed.position });
  //
  // const createdArticlesAccess = await connection
  //   .getRepository(AccessEntity)
  //   .save(
  //     connection
  //       .getRepository(AccessEntity)
  //       .create({ ...accessArticleSeed, positions: [accessRelation] }),
  //   );
  // if (createdArticlesAccess) {
  //   console.log('Access to articles created!');
  // }
  await connection.close();
};

export default importArticles;
