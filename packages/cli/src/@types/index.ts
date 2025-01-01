import { Command } from 'commander';
import { createLogger } from 'winston';

/** logger */
export type LoggerType = ReturnType<typeof createLogger>;

/** action params */
export interface ActionParams {
  logger: LoggerType;
  program: Command;
}

/** translation */
export interface TranslationData {
  type: 'UPSERT' | 'DELETE';
  data: {
    sheetTitle: SheetTitle;
    sheetId: SheetId;
  };
}
export type SheetTitle = string;
export type SheetId = string;
