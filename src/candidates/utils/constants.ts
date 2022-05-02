export enum LevelTypesEnum {
  None = 'none',
  Novice = 'novice',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

export const levelTypesPriority: { [key in LevelTypesEnum]: number } = {
  [LevelTypesEnum.None]: 1,
  [LevelTypesEnum.Novice]: 2,
  [LevelTypesEnum.Intermediate]: 3,
  [LevelTypesEnum.Expert]: 4,
};
