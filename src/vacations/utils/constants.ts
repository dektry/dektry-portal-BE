import * as map from 'lodash/map';

export const hourPerDay = 8;

export const vacationStatuses = {
  submitted: 'submitted',
  approved: 'approved',
  denied: 'denied',
};

export const vacationStatusesArray = map(vacationStatuses, (status) => status);

export const policyType = {
  vac: 'VAC',
  sick: 'SICK',
  leave: 'LEAVE',
};

export const typeBusinessTime = {
  restore: 'restore',
  available: 'available',
};
