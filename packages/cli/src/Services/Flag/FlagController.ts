import { Command } from 'commander';
import { validator } from '@sheet-i18n/shared-utils';

import {
  FlagDescription,
  FlagHandler,
  FlagType,
  LoggerType,
} from '../../@types';
import { Logger } from '../Logger';
import { InvalidFlagParams } from '../../Errors';

interface FlagControllerParams {
  command: Command;
  flagEntries: Array<{
    flag: FlagType;
    description: FlagDescription;
    handler: FlagHandler;
  }>;
}

export class FlagController {
  private logger: LoggerType;
  private flagControllerParams?: FlagControllerParams;

  constructor(flagControllerParams: FlagControllerParams) {
    this.logger = Logger.getInstance();
    this.flagControllerParams = flagControllerParams;

    this.initializeCLI();
  }

  private getFlagControllerParams() {
    return this.flagControllerParams;
  }

  public initializeCLI(): void {
    const flagControllerParams = this.getFlagControllerParams();

    if (
      !flagControllerParams ||
      flagControllerParams?.command instanceof Command === false ||
      validator.hasNullishValueInObj(flagControllerParams) ||
      !Array.isArray(flagControllerParams.flagEntries)
    ) {
      this.logger?.error?.(
        '⚠️ Invalid flag params:',
        this.flagControllerParams
      );
      throw new InvalidFlagParams('Invalid flag params');
    }

    const { command, flagEntries } = flagControllerParams;

    flagEntries.forEach(({ flag, description }) => {
      command?.option(flag, description);
    });
  }

  public getFlagOptions() {
    const { command } = this.getFlagControllerParams() ?? {};

    try {
      command?.parse(process.argv);
      const options = command?.opts();

      return options;
    } catch (error) {
      this.logger?.error?.('⚠️ Failed to parse flags:');
      throw error;
    }
  }

  public async installFlagHandlers() {
    const options = this.getFlagOptions() ?? {};
    const { flagEntries = [] } = this.getFlagControllerParams() ?? {};

    await Promise.all(
      flagEntries?.map(async ({ flag, handler }) => {
        const flagKeys = flag
          .split(',')
          .map((key) => key.trim().replace(/^-+/, ''));
        const isFlagSet = flagKeys.some((key) => options[key]);

        if (isFlagSet) {
          await handler?.();
          process.exit();
        }
      })
    );
  }
}
