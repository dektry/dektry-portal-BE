import { createConnection, Connection } from 'typeorm';
import { onBoardingTemplatesSeed } from './seeds/onBoardingsTemplates.seed';
import { difference } from 'lodash';
import { TemplatesEntity } from '../src/onboarding/entity/templates.entity';
import { PositionGroupEntity } from '../src/users/entity/positionGroup.entity';

const importOnBoardingsTemplates = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistTemplates = await connection
    .getRepository(TemplatesEntity)
    .find();
  const existPositionsGroups = await connection
    .getRepository(PositionGroupEntity)
    .find();

  const newTemplates = onBoardingTemplatesSeed.filter((newTemplate) => {
    const isTemplateExist = allExistTemplates.some(
      (existTemplate) => newTemplate.name === existTemplate.name,
    );
    return !isTemplateExist;
  });

  const alreadyExistedNewTemplates = difference(
    onBoardingTemplatesSeed,
    newTemplates,
  );
  alreadyExistedNewTemplates.forEach((element) => {
    console.log(`Template '${element.name}' is already exist!`);
  });

  const newTemplatesWithRelations = newTemplates.map((template) => {
    const newTemplateWrite = template.write.map((writePositionGroup) =>
      existPositionsGroups.find(
        (existGroup) => writePositionGroup === existGroup.name,
      ),
    );
    const newTemplateRead = template.read.map((readPositionGroup) =>
      existPositionsGroups.find(
        (existGroup) => readPositionGroup === existGroup.name,
      ),
    );
    return { ...template, write: newTemplateWrite, read: newTemplateRead };
  });

  const createdTemplates = await connection.getRepository(TemplatesEntity).save(
    newTemplatesWithRelations.map((template) => {
      return connection.getRepository(TemplatesEntity).create(template);
    }),
  );
  console.log(`Added ${createdTemplates.length} new templates!`);
  await connection.close();
};

export default importOnBoardingsTemplates;
