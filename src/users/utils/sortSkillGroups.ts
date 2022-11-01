import { SkillGroupEntity } from '../entity/skillGroup.entity';

interface IOrder {
  [key: string]: number;
}

export const sortSkillGroups = (groups: SkillGroupEntity[]) => {
  const order: IOrder = {
    'Programming languages': 1,
    UI: 2,
    'Back-end technologies': 3,
    'Frameworks/Libraries': 4,
    'Software engineering management': 5,
    'Network technologies': 6,
    'Operating systems': 7,
    SCM: 8,
    'Builders and tasks runners': 9,
    'Development tools': 10,
    'Database technologies': 11,
    'Cloud computing technologies': 12,
    'Test utilities': 13,
    default: 100,
  };

  groups.sort((a, b) => {
    return a && a.value && b && b.value
      ? (order[a.value] || order.default) - (order[b.value] || order.default)
      : 1;
  });

  return groups;
};