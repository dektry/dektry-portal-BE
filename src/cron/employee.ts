import { CronJob } from 'cron';
import { getEmployees } from '../employee/services/employee';

export const employeeCron = new CronJob('*/60 * * * *', async () => {
  try {
    await getEmployees();
  } catch (e) {
    console.log(e);
  }
});
