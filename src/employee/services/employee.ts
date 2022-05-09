import { getRepository, In, Not } from 'typeorm';
import { EmployeeEntity } from '../entity/employee.entity';
import { PFAxios } from '../../../utils/pfAxios';

PFAxios.interceptors.request.use(
  (config) => {
    config.headers['X-API-KEY'] = process.env.PF_API_KEY;

    return config;
  },
  (error) => Promise.reject(error),
);

// Parsing an html-like string and getting text inside the tags
const parseStr = (
  str: string,
  parsedStr = '',
  dir: '<' | '>' = '>',
): string => {
  if (!str) return;

  const indexOfTagEdge = str.indexOf(dir);
  if (dir === '>' && indexOfTagEdge >= 0 && indexOfTagEdge !== str.length - 1) {
    return parseStr(str.substring(indexOfTagEdge + 1), parsedStr, '<');
  }
  if (dir === '<' && indexOfTagEdge >= 0 && indexOfTagEdge !== str.length - 1) {
    parsedStr += str.substring(0, indexOfTagEdge);
    return parseStr(str.substring(indexOfTagEdge + 1), parsedStr);
  }
  return parsedStr;
};

const formatEmployee = async (employee): Promise<EmployeeEntity> => {
  const employeeId = await getRepository(EmployeeEntity).findOne({
    pfId: employee.id,
  });

  const startingPointStr = employee.custom_fields.find(
    (el) =>
      el.group === 'Additional information' && el.name === 'Starting point',
  ).value;

  const positionArr = employee.position.name.split('–');

  const newEmployee = getRepository(EmployeeEntity).create({
    pfId: employee.id,
    pfUpdatedAt: employee.updated_at,
    fullName: employee.full_name,
    position: employee.position.name,
    level: positionArr.length > 1 ? positionArr.pop()?.trim() : null,
    location: employee.custom_fields.reduce((acc, el) => {
      let result = acc;
      if (el.group === 'Address') {
        if (el.name === 'Страна') result += el.value + '/';
        if (el.name === 'Город') result += el.value;
      }
      return result;
    }, ''),
    timezone: employee.location.timezone,
    languages: employee.custom_fields.find(
      (el) => el.group === 'Additional information' && el.name === 'Languages',
    ).value,
    formalEducation: parseStr(
      employee.custom_fields.find(
        (el) =>
          el.group === 'Additional information' && el.name === 'Education',
      ).value,
    ),
    startingPoint: startingPointStr ? startingPointStr + ' 00:00:00' : null,
    interests: employee.custom_fields.find(
      (el) => el.group === 'Additional information' && el.name === 'Interests',
    ).value,
  });

  if (employeeId) newEmployee.id = employeeId.id;
  return newEmployee;
};

export const getEmployees = async () => {
  try {
    const {
      data: { data: employees },
    } = await PFAxios.get('/employees');

    await getRepository(EmployeeEntity).delete({
      pfId: Not(In(employees.map(({ id }) => id))),
    });

    if (employees.length)
      for (const employee of employees) {
        const formattedCandidate = await formatEmployee(employee);

        await getRepository(EmployeeEntity).save(formattedCandidate);
      }

    console.log('completed');
    return 'completed';
  } catch (error) {
    console.log(error, 444444);
    return error;
  }
};
