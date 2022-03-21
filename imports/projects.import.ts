import { createConnection, Connection } from "typeorm";
import { ProjectEntity } from "../src/projects/entity/project.entity";
import { UserEntity } from "../src/users/entity/user.entity";
import { projectSeed } from "./seeds/project.seed";
import * as map from "lodash/map";
import * as find from "lodash/find";
import * as filter from "lodash/filter";

const importProjects = async () => {
  const connection: Connection = await createConnection("data-import");
  const allExistUsers = await connection.getRepository(UserEntity).find();

  const projects = projectSeed.map((newProject) => {
    const projectUsers = map(newProject.users, (user) => {
      const userEntity = find(allExistUsers, (entity) => entity.email === user);
      return userEntity.id;
    });
    const projectManagers = map(newProject.managers, (user) => {
      const userEntity = find(allExistUsers, (entity) => entity.email === user);
      return userEntity.id;
    });
    return { ...newProject, users: projectUsers, managers: projectManagers };
  });

  const newProjects = filter(projects, (project) => !!project);

  await connection.getRepository(ProjectEntity).save(
    newProjects.map((project) => {
      return connection.getRepository(ProjectEntity).create(project);
    })
  );

  await connection.close();
};

export default importProjects;
