import * as moment from 'moment-business-days';
import { hourPerDay } from './constants';

export const getAvailableTime = (
  start: string,
  end: string,
  userBalance: number,
) => {
  const startDate = moment(start);
  const endDate = moment(end).add(1, 'days');
  const vacationDuration = startDate.businessDiff(endDate);

  return userBalance - vacationDuration * hourPerDay;
};
