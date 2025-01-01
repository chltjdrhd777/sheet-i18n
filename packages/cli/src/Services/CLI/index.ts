import { Command } from 'commander';

import { LoggerType } from '../../@types';
import { Logger } from '../Logger';

import { watchAction } from './actions';
import { initAction } from './actions/initAction';

export class CLIController {
  constructor(
    private logger: LoggerType = Logger.getInstance(),
    private program: Command = new Command()
      .name('@sheet-i18n/cli')
      .description('A CLI for sheet-i18n')
  ) {}

  public async initializeCLI() {
    this.registerCommands();
    this.program.parse(process.argv);
  }

  public registerCommands() {
    this.addInitCommand();
    this.addWatchCommand();
  }

  // command handlers

  public addInitCommand() {
    this.program
      .command('init')
      .description('Initialize cli config file')
      .action(initAction);
  }

  public addWatchCommand() {
    this.program
      .command('watch')
      .option('-d, --directory <directory>', 'Directory to watch')
      .description('Watch files for changes')
      .action((options) =>
        watchAction({
          logger: this.logger,
          program: this.program,
          directory: options.directory,
        })
      );
  }
}
