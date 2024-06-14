const isDate = (dateStr: string) => {
  if (typeof dateStr !== 'string') return false;
  const parsedDate = Date.parse(dateStr);
  const dateObj = new Date(dateStr);
  return dateObj instanceof Date && !isNaN(parsedDate);
};

const isNumber = (numberStr: string) => {
  const numberRegex = /^[\+-]?\d*(\.\d+)?$/;
  return numberRegex.test(numberStr);
};

const isBoolean = (booleanStr: string) => {
  return booleanStr === 'true' || booleanStr === 'false';
};

export const parse = (rawUrl: string) => {
  const url = new URL(rawUrl);
  const parseObject = {} as Record<string, any>;
  const searchParams = url.searchParams;
  searchParams.forEach((value, key) => {
    try {
      const objValue = JSON.parse(value);
      if (typeof objValue !== 'object') {
        throw new Error('Invalid JSON');
      }
      parseObject[key] = objValue;
    } catch (err) {
      const finalValue = isBoolean(value)
        ? value === 'true'
        : isNumber(value)
        ? parseFloat(value)
        : isDate(value)
        ? new Date(value)
        : value.toString();
      parseObject[key] = finalValue;
    }
  });
  return parseObject;
};

export const pathname = (rawUrl: string) => {
  const url = new URL(rawUrl);
  const pathName = url.pathname;
  return pathName.startsWith('/') ? pathName.slice(1) : pathName;
};
