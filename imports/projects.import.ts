import { createConnection, Connection } from 'typeorm';
import { ProjectEntity } from '../src/projects/entity/project.entity';
import { projectSeed } from './seeds/project.seed';
import * as _ from 'lodash';

const importProjects = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistProjects = await connection.getRepository(ProjectEntity).find();

  const newProjects = projectSeed.filter((newProject) => {
    const isProjectExist = allExistProjects.some(
      (existProject) => newProject.name === existProject.name,
    );
    return !isProjectExist;
  });

  const alreadyExistedUsers = _.difference(projectSeed, newProjects);
  alreadyExistedUsers.forEach((element) => {
    console.log(`Project '${element.name}' is already exist!`);
  });

  const createdProjects = await connection
    .getRepository(ProjectEntity)
    .save(
      newProjects.map((project) => {
        return connection.getRepository(ProjectEntity).create(project);
      }),
    );
  console.log(`Added ${createdProjects.length} new projects!`);
  await connection.close();
};

export default importProjects;
