export function isEmpty(value: unknown): value is null | undefined | '' {
  return value === null || value === undefined || value === '';
}
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function hasEmptyValueInObj(obj: Record<PropertyKey, any>): boolean {
  return isNullish(obj) || Object.values(obj).some((value) => isEmpty(value));
}
export function hasNullishValueInObj(obj: Record<PropertyKey, any>): boolean {
  return isNullish(obj) || Object.values(obj).some((value) => isNullish(value));
}

export function hasInvalidValuePrerequisites(expected: unknown): boolean {
  if (
    expected === null ||
    expected === undefined ||
    typeof expected === 'function'
  ) {
    return true;
  }

  if (Array.isArray(expected)) {
    for (let e of expected) {
      if (hasInvalidValuePrerequisites(e)) return true;
    }
  }

  if (typeof expected === 'object') {
    for (let key in expected) {
      if (
        expected.hasOwnProperty(key) &&
        hasInvalidValuePrerequisites((expected as { [key: string]: any })[key])
      ) {
        return true;
      }
    }
  }

  return false;
}
