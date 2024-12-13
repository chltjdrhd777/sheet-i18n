export class CustomError extends Error {
  constructor(message: string = 'Axios Error') {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InValidEnvError extends CustomError {}
export class NoAuthClientError extends CustomError {}
export class LoadDocError extends CustomError {}

export class NoSheetError extends CustomError {}
export class LoadCellsError extends CustomError {}
export class GetRowsError extends CustomError {}

export class InvalidDefaultLocaleHeaderError extends CustomError {}
export class InvalidHeadersError extends CustomError {}
