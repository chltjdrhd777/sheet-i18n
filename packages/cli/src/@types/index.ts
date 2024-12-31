import { createLogger } from 'winston';

/** logger */
export type LoggerType = ReturnType<typeof createLogger>;

/** Flag */
export type FlagType = string;
export type FlagDescription = string;
export type FlagHandler = (...args: any) => any;

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
