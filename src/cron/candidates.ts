import { CronJob } from 'cron';
import { getCandidates } from '../candidates/services/candidates';

export const candidatesCron = new CronJob('*/60 * * * *', async () => {
  console.log('fetching data by cron');
  try {
    await getCandidates();
  } catch (e) {
    console.log(e);
  }
});
