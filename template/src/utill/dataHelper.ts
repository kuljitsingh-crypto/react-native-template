type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepClone<T> = {
  [P in keyof T]: T[P] extends object ? DeepClone<T[P]> : T[P];
};

const pickObjectKeys = <T extends Record<string, any>>(
  inputObj: DeepPartial<T>,
  keys: string[],
): DeepPartial<T> => {
  const isValidInoutObject =
    typeof inputObj === 'object' &&
    inputObj.constructor === Object &&
    inputObj !== null;
  if (!isValidInoutObject) return {};

  return (keys || []).reduce((acc, nestedKey) => {
    const nestedKeys = nestedKey.split('.');
    const arrLen = nestedKeys.length,
      lastIndx = nestedKeys.length - 1;
    let key,
      currentRef: any = acc,
      curntVal,
      parentObject = inputObj;
    for (let i = 0; i < arrLen; i++) {
      key = nestedKeys[i];
      if (!parentObject?.hasOwnProperty(key)) {
        break;
      }
      curntVal = parentObject[key];
      if (i === lastIndx) {
        currentRef[key] = curntVal;
      } else {
        if (typeof curntVal === 'object' && curntVal !== null) {
          parentObject = curntVal;
          currentRef[key] =
            currentRef[key] || (Array.isArray(curntVal) ? [] : {});
          currentRef = currentRef[key];
        }
      }
    }
    return acc;
  }, {} as DeepPartial<T>);
};

const deepCloneObject = <T extends Record<string, any>>(
  obj: DeepClone<T>,
): DeepClone<T> => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const initial: any = Array.isArray(obj) ? [] : {};
  return Object.entries(obj).reduce((acc, keyValue) => {
    const [key, value] = keyValue;
    if (typeof value === 'object') {
      acc[key] = deepCloneObject(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, initial);
};

const omitObjectKeys = <T extends Record<string, any>>(
  inputObj: DeepPartial<T>,
  keys: string[],
): DeepPartial<T> => {
  const isValidInoutObject =
    typeof inputObj === 'object' &&
    inputObj.constructor === Object &&
    inputObj !== null;
  if (!isValidInoutObject) return {};
  const newObj: DeepPartial<T> = deepCloneObject(inputObj as any);

  (keys || []).reduce((acc, nestedKey) => {
    const nestedKeys = nestedKey.split('.');
    const arrLen = nestedKeys.length,
      lastIndx = nestedKeys.length - 1;
    let key,
      currentRef: any = acc,
      curntVal;
    for (let i = 0; i < arrLen; i++) {
      key = nestedKeys[i];
      if (!currentRef?.hasOwnProperty(key)) {
        break;
      }
      curntVal = currentRef[key];
      if (i === lastIndx) {
        delete currentRef[key];
      } else {
        if (typeof curntVal === 'object') {
          currentRef = curntVal;
        }
      }
    }
    return acc;
  }, newObj);

  return newObj;
};

export class CollectionUtils {
  static object = Object.freeze({
    pick: pickObjectKeys,
    deepClone: deepCloneObject,
    omit: omitObjectKeys,
  });

  static array = Object.freeze({
    deepclone: deepCloneObject,
  });
}
