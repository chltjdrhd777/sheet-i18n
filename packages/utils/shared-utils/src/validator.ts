export function isEmpty(value: unknown): value is null | undefined | '' {
  return value === null || value === undefined || value === '';
}
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function hasEmptyValueInObj(obj: Record<PropertyKey, any>): boolean {
  return Object.values(obj).some((value) => isEmpty(value));
}
export function hasNullishValueInObj(obj: Record<PropertyKey, any>): boolean {
  return Object.values(obj).some((value) => isNullish(value));
}
