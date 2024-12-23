type ObjectType = Record<PropertyKey, any>;

export function isEmpty(value: unknown): value is null | undefined | '' {
  return value === null || value === undefined || value === '';
}
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function hasEmptyValueInObj(obj: ObjectType): boolean {
  return isNullish(obj) || Object.values(obj).some((value) => isEmpty(value));
}
export function hasNullishValueInObj(obj: ObjectType): boolean {
  return isNullish(obj) || Object.values(obj).some((value) => isNullish(value));
}

export function hasInvalidValuePrerequisites(expected: unknown): boolean {
  if (isNullish(expected) || typeof expected === 'function') {
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
        hasInvalidValuePrerequisites((expected as ObjectType)[key])
      ) {
        return true;
      }
    }
  }

  return false;
}

export function checkPrerequisiteParams<P extends ObjectType>(
  params: P,
  preRequisites: (keyof P)[] = []
) {
  const preRequisiteObj = preRequisites.reduce((acc, cur) => {
    acc[cur] = params[cur];

    return acc;
  }, {} as ObjectType) as ObjectType;

  const isInvalid = hasInvalidValuePrerequisites(preRequisiteObj);

  if (isInvalid) {
    throw new Error(
      `Please set the valid requisites first: ${Object.entries(preRequisites).join(', ')}`
    );
  }
}
