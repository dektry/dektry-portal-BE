import * as moment from 'moment-business-days';
import { hourPerDay, typeBusinessTime } from './constants';

export const getBusinessTime = (
  start: Date | string,
  end: Date | string,
  userBalance: number,
  type?: string,
) => {
  const startDate = moment(start);
  const endDate = moment(end).add(1, 'days');
  const vacationDuration = startDate.businessDiff(endDate);
  const vacationDurationHour = vacationDuration * hourPerDay;

  return type === typeBusinessTime.restore
    ? userBalance + vacationDurationHour
    : userBalance - vacationDurationHour;
};
