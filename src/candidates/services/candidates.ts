import axios from 'axios';
import { EntityTarget, getRepository, In, Not } from 'typeorm';
import { EducationEntity } from '../entity/education.entity';
import { ExperienceEntity } from '../entity/experience.entity';
import { LanguageEntity } from '../entity/language.entity';
import { CandidateEntity } from '../entity/candidate.entity';

export const PFAxios = axios.create({
  baseURL: process.env.PF_API,
});

PFAxios.interceptors.request.use(
  (config) => {
    config.headers['X-API-KEY'] = process.env.PF_API_KEY;

    return config;
  },
  (error) => Promise.reject(error),
);

const formatFields = <T>(array, entity: EntityTarget<T>): T[] => {
  return array.map((item) => {
    item.pfId = item.id;
    delete item.id;
    getRepository(entity).create(item);

    return item;
  });
};

const formatCandidate = async (
  candidate,
  education,
  experience,
): Promise<CandidateEntity> => {
  const candidateId = await getRepository(CandidateEntity).findOne({
    pfId: candidate.id,
  });

  const newCandidate = getRepository(CandidateEntity).create({
    pfId: candidate.id,
    pfUpdatedAt: candidate.updated_at,
    fullName: candidate.full_name,
    position: candidate.position,
    level: candidate.level,
    location: candidate.location,
    timezone: '1',
    languages: formatFields(candidate.languages, LanguageEntity),
    education: formatFields(education, EducationEntity),
    experience: formatFields(experience, ExperienceEntity),
  });

  if (candidateId) newCandidate.id = candidateId.id;
  return newCandidate;
};

export const getCandidates = async () => {
  try {
    const {
      data: { data: candidates },
    } = await PFAxios.get('/recruitment/candidates');

    await getRepository(CandidateEntity).delete({
      pfId: Not(In(candidates.map(({ id }) => id))),
    });
    await getRepository(ExperienceEntity).clear();
    await getRepository(EducationEntity).clear();
    await getRepository(LanguageEntity).query(
      `TRUNCATE TABLE "language" CASCADE`,
    );

    if (candidates.length)
      for (const candidate of candidates) {
        const {
          data: { data: education },
        } = await PFAxios.get(
          `recruitment/candidates/${candidate.id}/educations`,
        );
        const {
          data: { data: experience },
        } = await PFAxios.get(
          `recruitment/candidates/${candidate.id}/experiences`,
        );
        const formattedCandidate = await formatCandidate(
          candidate,
          education,
          experience,
        );

        const {
          experience: formattedExp,
          education: formattedEdc,
          languages: formattedLang,
        } = formattedCandidate;

        await getRepository(EducationEntity).save(formattedEdc);

        await getRepository(ExperienceEntity).save(formattedExp);

        await getRepository(LanguageEntity).upsert(formattedLang, {
          conflictPaths: ['level', 'code'],
          skipUpdateIfNoValuesChanged: true,
        });

        await getRepository(CandidateEntity).save(formattedCandidate);
      }

    console.log('completed');
    return 'completed';
  } catch (error) {
    console.log(error, 444444);
    return error;
  }
};
