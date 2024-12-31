import { Command } from 'commander';

import { FlagController } from './FlagController';

const flagController = new FlagController({
  command: new Command()
    .name('@sheet-i18n/cli')
    .description('A CLI for sheet-i18n'),
  flagEntries: [
    {
      flag: '-v, --version',
      description: 'Display the current version',
      handler: () => {
        console.log('💡 flag version');
      },
    },
    {
      flag: '-w, --watch',
      description: 'Handle origin repository',
      handler: () => {
        console.log('✅ flag watch');
      },
    },
  ],
});

export { flagController };
