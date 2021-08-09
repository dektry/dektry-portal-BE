export const onBoardingTemplatesSeed = [
  {
    name: 'Newcomer socials',
    group: {
      name: 'Social',
    },
    tasks: [
      {
        task: 'Sign in LinkedIN',
        index: 0,
      },
    ],
    read: ['CEO'],
    write: ['CEO'],
  },
];

export const accessSeed = {
  name: 'onboarding-templates',
  position: 'CEO',
};
