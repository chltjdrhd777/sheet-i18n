export abstract class SheetManager {
  protected abstract init(...args: any): any;
}

export abstract class WorkSheet {
  public abstract getWorksheet(...args: any): any;
  public abstract getAllWorkSheets(...args: any): any;
}
