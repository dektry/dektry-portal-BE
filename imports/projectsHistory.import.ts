import { createConnection, Connection } from 'typeorm';
import { UserEntity } from '../src/users/entity/user.entity';
import { ProjectEntity } from '../src/projects/entity/project.entity';
import { ProjectHistoryEntity } from '../src/projects/entity/projectHistory.entity';
import { projectsHistorySeed } from './seeds/projectsHistory.seed';

const importProjectsHistory = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistUsers = await connection.getRepository(UserEntity).find();
  const allExistProjects = await connection.getRepository(ProjectEntity).find();

  const newProjectsHistory = projectsHistorySeed.map((history) => {
    const userEntity = allExistUsers.find((existUser) => {
      return existUser.email === history.user;
    });
    const projectEntity = allExistProjects.find((existProject) => {
      return existProject.name === history.project;
    });
    return { from: history.from, to: history.to, userId: userEntity, projectId: projectEntity };
  });

  const createdCareers = await connection.getRepository(ProjectHistoryEntity).save(
    newProjectsHistory.map((project) => {
      return connection.getRepository(ProjectHistoryEntity).create(project);
    }),
  );
  console.log(`Added ${createdCareers.length} new history projects!`);
  await connection.close();
};

export default importProjectsHistory;
