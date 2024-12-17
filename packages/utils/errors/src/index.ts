export class CustomError extends Error {
  constructor(message: string = 'Axios Error') {
    super(message);
    this.name = this.constructor.name;
  }
}

export type CustomErrorConstructor = new (...args: any[]) => CustomError;
