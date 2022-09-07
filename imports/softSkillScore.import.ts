import { createConnection, Connection } from 'typeorm';
import { SoftSkillScoreEntity } from '../src/users/entity/softSkillScore.entity';
import { softSkillsScoreSeed } from './seeds/softSkillScore.seed';
import { difference } from 'lodash';

const importSoftSkillsScore = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSoftSkillsScore = await connection
    .getRepository(SoftSkillScoreEntity)
    .find();

  const newSoftSkillsScore = softSkillsScoreSeed.filter((newSoftSkillScore) => {
    const isSoftSkillScoreExist = currentSoftSkillsScore.some(
      (existSoftSkillScore) =>
        newSoftSkillScore.value === existSoftSkillScore.value,
    );
    return !isSoftSkillScoreExist;
  });
  const alreadyExistedNewSoftSkillScore = difference(
    softSkillsScoreSeed,
    newSoftSkillsScore,
  );
  alreadyExistedNewSoftSkillScore.forEach((element) => {
    console.log(`Soft skill score ${element.value} is already exist!`);
  });

  const сreatedSoftSkillsScore = await connection
    .getRepository(SoftSkillScoreEntity)
    .save(
      newSoftSkillsScore.map((softSkill) => {
        return connection.getRepository(SoftSkillScoreEntity).create(softSkill);
      }),
    );
  console.log(`Added ${сreatedSoftSkillsScore.length} new soft skills score!`);
  await connection.close();
};

export default importSoftSkillsScore;
