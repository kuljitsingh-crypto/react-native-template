import EncryptedStorage from 'react-native-encrypted-storage';

const customSerializeType = {
  date: 'date',
};

function replacer(key: string, value: unknown) {
  if (value instanceof Date) {
    return {date: value, _serializedType: customSerializeType.date};
  }
  return value;
}

function reviver(key: string, value: any) {
  if (
    value &&
    typeof value === 'object' &&
    value._serializedType === customSerializeType.date
  ) {
    return new Date(value.date);
  }
  return value;
}

type GenericObject =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | symbol;

type ObjectType =
  | GenericObject
  | Record<string, GenericObject>
  | Array<GenericObject | Record<string, GenericObject>>;

type LocalStorageReturn = {
  String: string;
  Number: number;
  Boolean: boolean;
  Date: Date;
  Object: Record<string, ObjectType>;
  Array: Array<GenericObject | Record<string, GenericObject>>;
};

type LocalStorageReturnKeys = keyof LocalStorageReturn;

export class LocalStorage {
  static #checkAndGetItem(value: string) {
    try {
      return JSON.parse(value, reviver) as Record<string, ObjectType>;
    } catch (e) {
      return value;
    }
  }

  static async setItem<V extends ObjectType | unknown = ObjectType>(
    keyName: string,
    value: V,
  ) {
    try {
      const strValue =
        typeof value === 'object'
          ? JSON.stringify(value, replacer)
          : value?.toString() || 'null';
      await EncryptedStorage.setItem(keyName, strValue);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async getItem<
    R extends LocalStorageReturnKeys | unknown = LocalStorageReturnKeys,
  >(
    keyName: string,
  ): Promise<
    R extends LocalStorageReturnKeys
      ? LocalStorageReturn[R]
      : R extends unknown
      ? R
      : null
  > {
    try {
      const storedValue = await EncryptedStorage.getItem(keyName);
      if (!storedValue) {
        return null as any;
      }
      return LocalStorage.#checkAndGetItem(storedValue) as any;
    } catch (e) {
      return null as any;
    }
  }

  static async removeItem(keyName: string) {
    try {
      await EncryptedStorage.removeItem(keyName);
      return true;
    } catch (e) {
      return false;
    }
  }
}
