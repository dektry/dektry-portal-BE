import { CronJob } from 'cron';
import { getEmployees } from '../employee/services/employee';

export const employeeCron = new CronJob('*/1 * * * *', async () => {
  try {
    await getEmployees();
  } catch (e) {
    console.log(e);
  }
});
