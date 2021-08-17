import { createConnection, Connection } from 'typeorm';
import { difference } from 'lodash';
import { TasksEntity } from '../src/onboarding/entity/tasks.entity';
import { OTTasksSeed } from './seeds/OTTasks.seed';

const importTasks = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentTasks = await connection.getRepository(TasksEntity).find();

  const newTasks = OTTasksSeed.filter((newTask) => {
    const isTaskExist = currentTasks.some(
      (existTasks) => existTasks.title === newTask.title,
    );
    return !isTaskExist;
  });
  const alreadyExistedNewTasks = difference(OTTasksSeed, newTasks);
  alreadyExistedNewTasks.forEach((element) => {
    console.log(`Task ${element.title} is already exist!`);
  });

  const createdTasks = await connection.getRepository(TasksEntity).save(
    newTasks.map((task) => {
      return connection.getRepository(TasksEntity).create(task);
    }),
  );
  console.log(`Added ${createdTasks.length} new tasks!`);
  await connection.close();
};

export default importTasks;
