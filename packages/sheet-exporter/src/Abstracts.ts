abstract class Contract {
  protected abstract validate(...args: any): any;
  protected abstract init(...args: any): any;
}

export abstract class SheetConfig extends Contract {
  protected abstract validate(...args: any): any;
  protected abstract init(...args: any): any;
}

export abstract class SheetManager extends Contract {}

export abstract class WorkSheet extends Contract {
  public abstract getManyWorkSheets(...args: any): any;
  public abstract getWorksheet(...args: any): any;
}

export abstract class Row extends Contract {
  public abstract getManyRows(...args: any): any;
  public abstract getRow(...args: any): any;
}

export abstract class Cell extends Contract {
  public abstract getRowCells(...args: any): any;
  public abstract getSpecificCell(...args: any): any;
}
