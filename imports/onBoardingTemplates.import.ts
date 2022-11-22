import { createConnection, Connection } from 'typeorm';
import {
  onBoardingTemplatesSeed,
  accessSeed,
} from './seeds/onBoardingsTemplates.seed';
import { difference } from 'lodash';
import { TemplatesEntity } from '../src/onboarding/entity/templates.entity';
import { PositionGroupEntity } from '../src/users/entity/positionGroup.entity';
import { AccessEntity } from '../src/users/entity/access.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { TasksEntity } from '../src/onboarding/entity/tasks.entity';

const importOnBoardingsTemplates = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistTemplates = await connection
    .getRepository(TemplatesEntity)
    .find();
  const existPositions = await connection.getRepository(PositionEntity).find();
  const allExistTasks = await connection.getRepository(TasksEntity).find();

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
    const newTemplateWrite = template.write.map((writePosition) =>
      existPositions.find((existGroup) => writePosition === existGroup.name),
    );
    const newTemplateRead = template.read.map((readPosition) =>
      existPositions.find((existGroup) => readPosition === existGroup.name),
    );
    const newTasksRelation = template.tasks.map((orderedTask) => {
      const tasksWithRelation = allExistTasks.find(
        (existTask) => existTask.title === orderedTask.task,
      );
      return {
        ...orderedTask,
        task: tasksWithRelation,
      };
    });
    return {
      ...template,
      write: newTemplateWrite,
      read: newTemplateRead,
      tasks: newTasksRelation,
    };
  });

  const createdTemplates = await connection.getRepository(TemplatesEntity).save(
    newTemplatesWithRelations.map((template) => {
      return connection.getRepository(TemplatesEntity).create(template);
    }),
  );
  console.log(`Added ${createdTemplates.length} new templates!`);

  const accessRelation = await connection
    .getRepository(PositionEntity)
    .findOne({ name: accessSeed.position });
  const isAccessNameAlreadyExist = await connection
    .getRepository(AccessEntity)
    .findOne({ name: accessSeed.name });

  if (!isAccessNameAlreadyExist) {
    const createdTemplatesAccess = await connection
      .getRepository(AccessEntity)
      .save(
        connection
          .getRepository(AccessEntity)
          .create({ ...accessSeed, positions: [accessRelation] }),
      );
    if (createdTemplatesAccess) {
      console.log('Access to templates created!');
    }
  }

  await connection.close();
};

export default importOnBoardingsTemplates;
