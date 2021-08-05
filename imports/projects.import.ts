import { createConnection, Connection } from 'typeorm';
import { ProjectEntity } from '../src/projects/entity/project.entity';
import { UserEntity } from '../src/users/entity/user.entity';
import { projectSeed } from './seeds/project.seed';
import * as _ from 'lodash';

const importProjects = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistUsers = await connection.getRepository(UserEntity).find();
  const allExistProjects = await connection.getRepository(ProjectEntity).find();

  const alreadyExistedProjects = [];

  const projects = projectSeed.map((newProject) => {
    const isProjectExist = allExistProjects.some(
      (existProject) => newProject.name === existProject.name,
    );
    if (isProjectExist) {
      alreadyExistedProjects.push(newProject);
      return !newProject;
    }
    const projectUsers = _.map(newProject.users, user => {
      const userEntity = _.find(allExistUsers, entity => entity.email === user);
      return userEntity.id;
    });
    const projectManagers = _.map(newProject.managers, user => {
      const userEntity = _.find(allExistUsers, entity => entity.email === user);
      return userEntity.id;
    });
    return { ...newProject, users: projectUsers, managers: projectManagers };
  });

  alreadyExistedProjects.forEach((element) => {
    console.log(`Project '${element.name}' is already exist!`);
  });

  const newProjects = _.filter(projects, project => !!project);

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