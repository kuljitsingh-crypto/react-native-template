type UnitOfTime =
  | 'year'
  | 'years'
  | 'y'
  | 'month'
  | 'months'
  | 'M'
  | 'week'
  | 'weeks'
  | 'w'
  | 'day'
  | 'days'
  | 'd'
  | 'hour'
  | 'hours'
  | 'h'
  | 'minute'
  | 'minutes'
  | 'm'
  | 'second'
  | 'seconds'
  | 's'
  | 'millisecond'
  | 'milliseconds'
  | 'ms';

type EndOfTime =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const weekdaysMin = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const eras = ['Before Christ', 'Anno Domini'];
const erasShort = ['BC', 'AD'];
const meridiem = ['AM', 'PM'];
const meridiemLwr = ['am', 'pm'];

/**
 * DateTime Format Tokens Reference
 *
 * MONTH TOKENS
 * M    - Month number (1 2 ... 11 12)
 * Mo   - Month number with ordinal (1st 2nd ... 11th 12th)
 * MM   - Month number, zero-padded (01 02 ... 11 12)
 * MMM  - Month name abbreviated (Jan Feb ... Nov Dec)
 * MMMM - Month name full (January February ... November December)
 *
 * QUARTER TOKENS
 * Q    - Quarter (1 2 3 4)
 * Qo   - Quarter with ordinal (1st 2nd 3rd 4th)
 *
 * DAY TOKENS
 * D    - Day of month (1 2 ... 30 31)
 * Do   - Day of month with ordinal (1st 2nd ... 30th 31st)
 * DD   - Day of month, zero-padded (01 02 ... 30 31)
 * DDD  - Day of year (1 2 ... 364 365)
 * DDDo - Day of year with ordinal (1st 2nd ... 364th 365th)
 * DDDD - Day of year, zero-padded (001 002 ... 364 365)
 *
 * DAY OF WEEK TOKENS
 * d    - Day of week number (0 1 ... 5 6)
 * do   - Day of week with ordinal (0th 1st ... 5th 6th)
 * dd   - Day name abbreviated short (Su Mo ... Fr Sa)
 * ddd  - Day name abbreviated (Sun Mon ... Fri Sat)
 * dddd - Day name full (Sunday Monday ... Friday Saturday)
 * e    - Locale day of week number (0 1 ... 5 6)
 * E    - ISO day of week number (1 2 ... 6 7)
 *
 * WEEK TOKENS
 * w    - Week of year (1 2 ... 52 53)
 * wo   - Week of year with ordinal (1st 2nd ... 52nd 53rd)
 * ww   - Week of year, zero-padded (01 02 ... 52 53)
 * W    - ISO week of year (1 2 ... 52 53)
 * Wo   - ISO week of year with ordinal (1st 2nd ... 52nd 53rd)
 * WW   - ISO week of year, zero-padded (01 02 ... 52 53)
 *
 * YEAR TOKENS
 * YY     - Year, 2-digit (70 71 ... 29 30)
 * YYYY   - Year, 4-digit (1970 1971 ... 2029 2030)
 *
 * ERA TOKENS
 * y           - Era year (1 2 ... 2020 ...)
 * N, NN, NNN  - Era name abbreviated (BC AD)
 * NNNN        - Era name full (Before Christ, Anno Domini)
 * NNNNN       - Era name narrow (BC AD)
 *
 * WEEK YEAR TOKENS
 * gg   - Week year, 2-digit (70 71 ... 29 30)
 * gggg - Week year, 4-digit (1970 1971 ... 2029 2030)
 * GG   - ISO week year, 2-digit (70 71 ... 29 30)
 * GGGG - ISO week year, 4-digit (1970 1971 ... 2029 2030)
 *
 * TIME TOKENS
 * A    - Meridiem uppercase (AM PM)
 * a    - Meridiem lowercase (am pm)
 * H    - Hour 24-hour (0 1 ... 22 23)
 * HH   - Hour 24-hour, zero-padded (00 01 ... 22 23)
 * h    - Hour 12-hour (1 2 ... 11 12)
 * hh   - Hour 12-hour, zero-padded (01 02 ... 11 12)
 * k    - Hour 24-hour, starting at 1 (1 2 ... 23 24)
 * kk   - Hour 24-hour, starting at 1, zero-padded (01 02 ... 23 24)
 * m    - Minute (0 1 ... 58 59)
 * mm   - Minute, zero-padded (00 01 ... 58 59)
 * s    - Second (0 1 ... 58 59)
 * ss   - Second, zero-padded (00 01 ... 58 59)
 *
 * FRACTIONAL SECOND TOKENS
 * S         - Fraction of second (0 1 ... 8 9)
 * SS        - Fraction of second, 2 digits (00 01 ... 98 99)
 * SSS       - Fraction of second, 3 digits (000 001 ... 998 999)
 * SSSS...S9 - Fraction of second, 4-9 digits (000[0..] 001[0..] ... 998[0..] 999[0..])
 *
 * TIMEZONE TOKENS
 * Z     - Timezone offset with colon (+07:00 -06:00)
 * ZZ    - Timezone offset without colon (+0700 -0600)
 *
 */

const formatToken =
  /(Mo|MMMM|MMM|MM|M|Qo|Q|Do|DDDo|DDDD|DDD|DD|D|do|dddd|ddd|dd|d|E|e|wo|Wo|ww|w|WW|W|YYYY|YY|gggg|gg|GGGG|GG|y|N{1,5}|A|a|HH|H|hh|h|kk|k|mm|m|ss|s|S{1,9}|ZZ|Z|.)/g;

const numberToOrdnal = (num: number) => {
  const suffix = ['th', 'st', 'nd', 'rd', 'th'];
  const lastDigit = num % 100;
  let indx = 0,
    lasIndx = suffix.length - 1;
  if (lastDigit > 10 && lastDigit < 14) {
    indx = 0;
  } else {
    indx = Math.min(lastDigit % 10, lasIndx);
  }
  return num + suffix[indx];
};

const zeroPadNumber = (
  num: number,
  targetLen: number = 0,
  showSign = false,
) => {
  const sign = showSign ? (num >= 0 ? '+' : '-') : '';
  const absNum = Math.abs(num) + '';
  const zerofillLen = Math.max(0, targetLen - absNum.length);
  const zeros = Math.pow(10, zerofillLen).toString().substring(1);
  return sign + zeros + absNum;
};

const getMonthQuarter = (month: number) => {
  return ~~(month / 3) + 1;
};

const getDayOfYear = (day: number, month: number, year: number) => {
  const firstDayOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const startingDay = new Date(year, month, day, 0, 0, 0, 0);
  const dayDiff = (startingDay.getTime() - firstDayOfYear.getTime()) / 864e5;
  return dayDiff + 1;
};

const getWeekOfYear = (day: number, month: number, year: number) => {
  const dayofYear = getDayOfYear(day, month, year);
  const week = Math.ceil(dayofYear / 7);
  return week;
};

const getIsoWeekDay = (weekday: number) => {
  if (weekday === 0) {
    weekday = 7;
  }
  return weekday.toString();
};

const get2DigitYear = (year: number) => {
  return year % 100;
};

const getEraYear = (year: number) => {
  if (year <= 0) 1;
  return year;
};

const getEraName = (year: number, isShort: boolean) => {
  let index = 0;
  if (year > 0) index = 1;
  return isShort ? erasShort[index] : eras[index];
};

const getFullHoursValue = (
  hours: number,
  minutes: number,
  secs: number,
  milliseconds: number,
) => {
  minutes = minutes / 60;
  secs = secs / (60 * 60);
  milliseconds = milliseconds / (60 * 60 * 1000);
  hours = hours + minutes + secs + milliseconds;
  return hours;
};

const getMeridiemName = (hours: number, isUppercase: boolean) => {
  const index = hours > 12 ? 1 : 0;
  return isUppercase ? meridiem[index] : meridiemLwr[index];
};

const get12HoursValue = (hours: number) => {
  hours++;
  return hours > 12 ? hours - 12 : hours;
};

const getFractionSecondsValue = (milliseconds: number, targetLen: number) => {
  const mutliplierValue = targetLen - 3;
  const powerMultipler = Math.pow(10, mutliplierValue);
  return ~~(milliseconds * powerMultipler);
};

const getOffset = (offsetInMinute: number, seperator = '') => {
  if (offsetInMinute == 0) return 'Z';
  const offsetHour = ~~(offsetInMinute / 60);
  const offsetMinute = Math.abs(offsetInMinute) % 60;
  return (
    zeroPadNumber(offsetHour, 2, true) +
    seperator +
    zeroPadNumber(offsetMinute, 2)
  );
};

const getFormatValue = (token: string, date: Date, offset: number) => {
  const month = date.getMonth(); //month
  const utcMonth = date.getUTCMonth(); //month
  const year = date.getFullYear(); // year
  const utcYear = date.getUTCFullYear(); // utcyear
  const weekDay = date.getDay(); // week
  const utcWeekDay = date.getUTCDay(); // utcweek
  const day = date.getDate(); // day
  const utcDay = date.getUTCDate(); // utcday
  const hours = date.getHours(); // hours
  const hours12 = get12HoursValue(hours); // hours12
  const minutes = date.getMinutes(); // minutes
  const seconds = date.getSeconds(); // seconds
  const milliseconds = date.getMilliseconds(); // milliseconds
  const monthQuarter = getMonthQuarter(month);

  switch (token) {
    case 'Mo':
      return numberToOrdnal(month + 1);
    case 'M':
      return (month + 1).toString();
    case 'MM':
      return zeroPadNumber(month + 1, 2);
    case 'MMM':
      return monthsShort[month];
    case 'MMMM':
      return months[month];
    case 'Q':
      return monthQuarter + '';
    case 'Qo':
      return numberToOrdnal(monthQuarter);
    case 'Do':
      return numberToOrdnal(day);
    case 'DDDo':
      return numberToOrdnal(getDayOfYear(day, month, year));
    case 'DDDD':
      return zeroPadNumber(getDayOfYear(day, month, year), 3);
    case 'DDD':
      return getDayOfYear(day, month, year).toString();
    case 'DD':
      return zeroPadNumber(day, 2);
    case 'D':
      return day.toString();
    case 'do':
      return numberToOrdnal(weekDay);
    case 'dddd':
      return weekdays[weekDay];
    case 'ddd':
      return weekdaysShort[weekDay];
    case 'dd':
      return weekdaysMin[weekDay];
    case 'd':
      return weekDay.toString();
    case 'E':
      return getIsoWeekDay(utcWeekDay);
    case 'e':
      return weekDay.toString();
    case 'wo':
      return numberToOrdnal(getWeekOfYear(day, month, year));
    case 'w':
      return getWeekOfYear(day, month, year).toString();
    case 'ww':
      return zeroPadNumber(getWeekOfYear(day, month, year), 2);
    case 'Wo':
      return numberToOrdnal(getWeekOfYear(utcDay, utcMonth, utcYear));
    case 'W':
      return getWeekOfYear(utcDay, utcMonth, utcYear).toString();
    case 'WW':
      return zeroPadNumber(getWeekOfYear(utcDay, utcMonth, utcYear), 2);
    case 'YYYY':
    case 'gggg':
      return year.toString();
    case 'GGGG':
      return utcYear.toString();
    case 'YY':
    case 'gg':
      return zeroPadNumber(get2DigitYear(year), 2);
    case 'GG':
      return zeroPadNumber(get2DigitYear(utcYear), 2);
    case 'y':
      return getEraYear(year).toString();
    case 'NNNN':
      return getEraName(year, false);
    case 'N':
    case 'NN':
    case 'NNN':
    case 'NNNNN':
      return getEraName(year, true);
    case 'A':
      return getMeridiemName(
        getFullHoursValue(hours, minutes, seconds, milliseconds),
        true,
      );
    case 'a':
      return getMeridiemName(
        getFullHoursValue(hours, minutes, seconds, milliseconds),
        false,
      );
    case 'H':
      return hours.toString();
    case 'HH':
      return zeroPadNumber(hours, 2);
    case 'h':
      return hours12.toString();
    case 'hh':
      return zeroPadNumber(hours12, 2);
    case 'k':
      return (hours + 1).toString();
    case 'kk':
      return zeroPadNumber(hours + 1, 2);
    case 'm':
      return minutes.toString();
    case 'mm':
      return zeroPadNumber(minutes, 2);
    case 's':
      return seconds.toString();
    case 'ss':
      return zeroPadNumber(seconds, 2);
    case 'S':
    case 'SS':
    case 'SSS':
    case 'SSSS':
    case 'SSSSS':
    case 'SSSSSS':
    case 'SSSSSSS':
    case 'SSSSSSSS':
    case 'SSSSSSSSS':
      return getFractionSecondsValue(milliseconds, token.length).toString();

    case 'Z':
      return getOffset(offset, ':');
    case 'ZZ':
      return getOffset(offset, '');

    default:
      return token;
  }
};

/**
 * It mutate initial date object
 */
export function dateHelper(options?: {
  date?: string | number | Date | number[];
  timeZone?: string;
}) {
  const {date, timeZone} = options || {};
  let utcOffset: number = 0,
    systemOffset: number = 0,
    offsetStr = '',
    isUtcMode = false,
    utcDate: Date = new Date();
  const throwInvalidDateErr = () => {
    throw new Error('Invalid date!');
  };

  const getTimeZoneOffset = () => {
    const localStr = Intl.DateTimeFormat('en', {
      timeZone,
      timeZoneName: 'longOffset',
      year: 'numeric',
    }).format(new Date());
    const [_, hour, min] = localStr.match(/GMT(.\d+):(\d+)/) || [];
    if (!hour || !min) {
      return throwInvalidDateErr();
    }
    offsetStr = `${hour}${min}`;
    const offset = parseInt(hour, 10) * 60 + parseInt(min, 10);
    return offset;
  };

  const initializeDate = () => {
    const dArray = date ? (Array.isArray(date) ? date : [date]) : [];
    const d = new Date(...(dArray as [number | string | Date]));
    if (isNaN(d as any)) {
      return throwInvalidDateErr();
    }
    systemOffset = d.getTimezoneOffset() * -1;
    utcOffset = getTimeZoneOffset();
    utcDate = new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds(),
      d.getUTCMilliseconds(),
    );
  };

  const addOffsetToUtcDate = () => {
    utcDate.setMinutes(utcDate.getMinutes() + utcOffset);
  };
  const substractOffsetFrmUtcDate = () => {
    utcDate.setMinutes(utcDate.getMinutes() - utcOffset);
  };

  const getEndDayOfMonth = (d: Date) => {
    const date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return date.getDate();
  };

  initializeDate();

  const dateObject = {
    // Display date
    toISOString() {
      utcDate.setMinutes(utcDate.getMinutes() + systemOffset);
      return utcDate.toISOString();
    },
    toUTCString() {
      return utcDate.toString().replace(/GMT.+/, 'GMT');
    },
    toString() {
      if (isUtcMode) {
        return this.toUTCString();
      }
      addOffsetToUtcDate();
      let str = this.toUTCString();
      str = `${str}${offsetStr}`;
      return str;
    },
    toJSON(valueType?: 'ISODate' | 'UTCDate' | 'LocalDate') {
      if (!valueType) {
        return this.toISOString();
      }
      return {
        type: 'date',
        value:
          valueType === 'UTCDate' || isUtcMode
            ? this.toUTCString()
            : valueType === 'ISODate'
            ? this.toISOString()
            : this.toString(),
      };
    },
    toDate() {
      addOffsetToUtcDate();
      return utcDate;
    },
    toArray() {
      addOffsetToUtcDate();
      return [
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        utcDate.getHours(),
        utcDate.getMinutes(),
        utcDate.getSeconds(),
        utcDate.getMilliseconds(),
      ];
    },
    /**
     * Return offset in minutes
     */
    utcOffset() {
      return isUtcMode ? 0 : utcOffset;
    },
    valueOf() {
      const valueOf = utcDate.getTime();
      if (isUtcMode) return valueOf;
      const offsetInMilliseconds = utcOffset * 60 * 1000;
      return valueOf + offsetInMilliseconds;
    },
    format(formatString?: string) {
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      const offsetValue = isUtcMode ? 0 : utcOffset;
      formatString = formatString ?? 'YYYY-MM-DDTHH:mm:ssZ';
      const matchedValues = formatString.match(formatToken) ?? [];
      const formattedValue = matchedValues
        .map(value => getFormatValue(value, utcDate, offsetValue))
        .join('');
      return formattedValue;
    },

    // Manupluate date
    add(value: number, unit: UnitOfTime) {
      switch (unit) {
        case 'year':
        case 'years':
        case 'y':
          utcDate.setFullYear(utcDate.getFullYear() + value);
          break;

        case 'month':
        case 'months':
        case 'M':
          utcDate.setMonth(utcDate.getMonth() + value);
          break;

        case 'week':
        case 'weeks':
        case 'w':
          utcDate.setDate(utcDate.getDate() + value * 7);
          break;

        case 'day':
        case 'days':
        case 'd':
          utcDate.setDate(utcDate.getDate() + value);
          break;

        case 'hour':
        case 'hours':
        case 'h':
          utcDate.setHours(utcDate.getHours() + value);
          break;

        case 'minute':
        case 'minutes':
        case 'm':
          utcDate.setMinutes(utcDate.getMinutes() + value);
          break;

        case 'second':
        case 'seconds':
        case 's':
          utcDate.setSeconds(utcDate.getSeconds() + value);
          break;

        default:
          utcDate.setMilliseconds(utcDate.getMilliseconds() + value);
      }
      return this;
    },
    substract(value: number, unit: UnitOfTime) {
      switch (unit) {
        case 'year':
        case 'years':
        case 'y':
          utcDate.setFullYear(utcDate.getFullYear() - value);
          break;

        case 'month':
        case 'months':
        case 'M':
          utcDate.setMonth(utcDate.getMonth() - value);
          break;

        case 'week':
        case 'weeks':
        case 'w':
          utcDate.setDate(utcDate.getDate() - value * 7);
          break;

        case 'day':
        case 'days':
        case 'd':
          utcDate.setDate(utcDate.getDate() - value);
          break;

        case 'hour':
        case 'hours':
        case 'h':
          utcDate.setHours(utcDate.getHours() - value);
          break;

        case 'minute':
        case 'minutes':
        case 'm':
          utcDate.setMinutes(utcDate.getMinutes() - value);
          break;

        case 'second':
        case 'seconds':
        case 's':
          utcDate.setSeconds(utcDate.getSeconds() - value);
          break;

        default:
          utcDate.setMilliseconds(utcDate.getMilliseconds() - value);
      }
      return this;
    },
    set(value: number, unit: Exclude<UnitOfTime, 'week' | 'weeks' | 'w'>) {
      if (!isUtcMode) {
        // convert to local date time
        addOffsetToUtcDate();
      }
      switch (unit) {
        case 'year':
        case 'years':
        case 'y':
          utcDate.setFullYear(value);
          break;

        case 'month':
        case 'months':
        case 'M':
          utcDate.setMonth(value);
          break;

        case 'day':
        case 'days':
        case 'd':
          utcDate.setDate(value);
          break;

        case 'hour':
        case 'hours':
        case 'h':
          utcDate.setHours(value);
          break;

        case 'minute':
        case 'minutes':
        case 'm':
          utcDate.setMinutes(value);
          break;

        case 'second':
        case 'seconds':
        case 's':
          utcDate.setSeconds(value);
          break;

        default:
          utcDate.setMilliseconds(value);
      }
      if (!isUtcMode) {
        //convert back to utc date time
        substractOffsetFrmUtcDate();
      }
      return this;
    },
    endOf(unit: EndOfTime) {
      if (!isUtcMode) {
        // convert to local date time
        addOffsetToUtcDate();
      }
      switch (unit) {
        case 'year':
          utcDate.setMonth(11);
          utcDate.setDate(31);
          utcDate.setHours(23);
          utcDate.setMinutes(59);
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);
          break;

        case 'month':
          utcDate.setDate(getEndDayOfMonth(utcDate));
          utcDate.setHours(23);
          utcDate.setMinutes(59);
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);
          break;

        case 'week':
          utcDate.setDate(utcDate.getDate() + (6 - utcDate.getDay()));
          utcDate.setHours(23);
          utcDate.setMinutes(59);
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);

        case 'day':
          utcDate.setHours(23);
          utcDate.setMinutes(59);
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);
          break;

        case 'hour':
          utcDate.setMinutes(59);
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);
          break;

        case 'minute':
          utcDate.setSeconds(59);
          utcDate.setMilliseconds(999);
          break;

        default:
          utcDate.setMilliseconds(999);
      }
      if (!isUtcMode) {
        //convert back to utc date time
        substractOffsetFrmUtcDate();
      }
      return this;
    },
    startOf(unit: EndOfTime) {
      if (!isUtcMode) {
        // convert to local date time
        addOffsetToUtcDate();
      }
      switch (unit) {
        case 'year':
          utcDate.setMonth(0);
          utcDate.setDate(1);
          utcDate.setHours(0);
          utcDate.setMinutes(0);
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);
          break;

        case 'month':
          utcDate.setDate(1);
          utcDate.setHours(0);
          utcDate.setMinutes(0);
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);
          break;

        case 'week':
          utcDate.setDate(utcDate.getDate() - utcDate.getDay());
          utcDate.setHours(0);
          utcDate.setMinutes(0);
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);

        case 'day':
          utcDate.setHours(0);
          utcDate.setMinutes(0);
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);
          break;

        case 'hour':
          utcDate.setMinutes(0);
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);
          break;

        case 'minute':
          utcDate.setSeconds(0);
          utcDate.setMilliseconds(0);
          break;

        default:
          utcDate.setMilliseconds(0);
      }
      if (!isUtcMode) {
        //convert back to utc date time
        substractOffsetFrmUtcDate();
      }
      return this;
    },
    utc() {
      isUtcMode = true;
      return this;
    },

    // query
    isBefore(
      date: any,
      options?: {unit?: EndOfTime; isBothDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isBothDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date = (date instanceof Date ? date : new Date(date)) as Date;
      if (isNaN(date) || !date) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() < date.getUTCFullYear()
            : utcDate.getFullYear() < date.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() < date.getUTCMonth()
            : utcDate.getMonth() < date.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() < date.getUTCDay()
            : utcDate.getDay() < date.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() < date.getUTCDate()
            : utcDate.getDate() < date.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() < date.getUTCHours()
            : utcDate.getHours() < date.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() < date.getUTCMinutes()
            : utcDate.getMinutes() < date.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() < date.getUTCSeconds()
            : utcDate.getSeconds() < date.getSeconds();

        default:
          const offset = isBothDateInUtcForMiliseconds
            ? 0
            : date.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() < date.getTime() + offset
            : utcDate.getTime() < date.getTime();
      }
    },
    isAfter(
      date: any,
      options?: {unit?: EndOfTime; isBothDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isBothDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date = (date instanceof Date ? date : new Date(date)) as Date;
      if (isNaN(date) || !date) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() > date.getUTCFullYear()
            : utcDate.getFullYear() > date.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() > date.getUTCMonth()
            : utcDate.getMonth() > date.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() > date.getUTCDay()
            : utcDate.getDay() > date.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() > date.getUTCDate()
            : utcDate.getDate() > date.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() > date.getUTCHours()
            : utcDate.getHours() > date.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() > date.getUTCMinutes()
            : utcDate.getMinutes() > date.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() > date.getUTCSeconds()
            : utcDate.getSeconds() > date.getSeconds();

        default:
          const offset = isBothDateInUtcForMiliseconds
            ? 0
            : date.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() > date.getTime() + offset
            : utcDate.getTime() > date.getTime();
      }
    },
    isSame(
      date: any,
      options?: {unit?: EndOfTime; isBothDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isBothDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date = (date instanceof Date ? date : new Date(date)) as Date;
      if (isNaN(date) || !date) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() === date.getUTCFullYear()
            : utcDate.getFullYear() === date.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() === date.getUTCMonth()
            : utcDate.getMonth() === date.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() === date.getUTCDay()
            : utcDate.getDay() === date.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() === date.getUTCDate()
            : utcDate.getDate() === date.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() === date.getUTCHours()
            : utcDate.getHours() === date.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() === date.getUTCMinutes()
            : utcDate.getMinutes() === date.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() === date.getUTCSeconds()
            : utcDate.getSeconds() === date.getSeconds();

        default:
          const offset = isBothDateInUtcForMiliseconds
            ? 0
            : date.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() === date.getTime() + offset
            : utcDate.getTime() === date.getTime();
      }
    },
    isSameOrBefore(
      date: any,
      options?: {unit?: EndOfTime; isBothDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isBothDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date = (date instanceof Date ? date : new Date(date)) as Date;
      if (isNaN(date) || !date) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() <= date.getUTCFullYear()
            : utcDate.getFullYear() <= date.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() <= date.getUTCMonth()
            : utcDate.getMonth() <= date.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() <= date.getUTCDay()
            : utcDate.getDay() <= date.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() <= date.getUTCDate()
            : utcDate.getDate() <= date.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() <= date.getUTCHours()
            : utcDate.getHours() <= date.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() <= date.getUTCMinutes()
            : utcDate.getMinutes() <= date.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() <= date.getUTCSeconds()
            : utcDate.getSeconds() <= date.getSeconds();

        default:
          const offset = isBothDateInUtcForMiliseconds
            ? 0
            : date.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() <= date.getTime() + offset
            : utcDate.getTime() <= date.getTime();
      }
    },
    isSameOrAfter(
      date: any,
      options?: {unit?: EndOfTime; isBothDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isBothDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date = (date instanceof Date ? date : new Date(date)) as Date;
      if (isNaN(date) || !date) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() >= date.getUTCFullYear()
            : utcDate.getFullYear() >= date.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() >= date.getUTCMonth()
            : utcDate.getMonth() >= date.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() >= date.getUTCDay()
            : utcDate.getDay() >= date.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() >= date.getUTCDate()
            : utcDate.getDate() >= date.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() >= date.getUTCHours()
            : utcDate.getHours() >= date.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() >= date.getUTCMinutes()
            : utcDate.getMinutes() >= date.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() >= date.getUTCSeconds()
            : utcDate.getSeconds() >= date.getSeconds();

        default:
          const offset = isBothDateInUtcForMiliseconds
            ? 0
            : date.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() >= date.getTime() + offset
            : utcDate.getTime() >= date.getTime();
      }
    },
    isBetween(
      date1: any,
      date2: any,
      options?: {unit?: EndOfTime; isAllDateInUtcForMiliseconds?: boolean},
    ): boolean {
      const {unit, isAllDateInUtcForMiliseconds} = options || {};
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      date1 = (date1 instanceof Date ? date1 : new Date(date1)) as Date;
      date2 = (date2 instanceof Date ? date2 : new Date(date2)) as Date;
      if (isNaN(date1) || !date1 || isNaN(date2) || !date2) {
        return throwInvalidDateErr();
      }
      switch (unit) {
        case 'year':
          return isUtcMode
            ? utcDate.getFullYear() > date1.getUTCFullYear() &&
                utcDate.getFullYear() < date2.getUTCFullYear()
            : utcDate.getFullYear() > date1.getFullYear() &&
                utcDate.getFullYear() < date2.getFullYear();
        case 'month':
          return isUtcMode
            ? utcDate.getMonth() > date1.getUTCMonth() &&
                utcDate.getMonth() < date2.getUTCMonth()
            : utcDate.getMonth() > date1.getMonth() &&
                utcDate.getMonth() < date2.getMonth();

        case 'week':
          return isUtcMode
            ? utcDate.getDay() > date1.getUTCDay() &&
                utcDate.getDay() < date2.getUTCDay()
            : utcDate.getDay() > date1.getDay() &&
                utcDate.getDay() < date2.getDay();

        case 'day':
          return isUtcMode
            ? utcDate.getDate() > date1.getUTCDate() &&
                utcDate.getDate() < date2.getUTCDate()
            : utcDate.getDate() > date1.getDate() &&
                utcDate.getDate() < date2.getDate();

        case 'hour':
          return isUtcMode
            ? utcDate.getHours() > date1.getUTCHours() &&
                utcDate.getHours() < date2.getUTCHours()
            : utcDate.getHours() > date1.getHours() &&
                utcDate.getHours() < date2.getHours();

        case 'minute':
          return isUtcMode
            ? utcDate.getMinutes() > date1.getUTCMinutes() &&
                utcDate.getMinutes() < date2.getUTCMinutes()
            : utcDate.getMinutes() > date1.getMinutes() &&
                utcDate.getMinutes() < date2.getMinutes();

        case 'second':
          return isUtcMode
            ? utcDate.getSeconds() > date1.getUTCSeconds() &&
                utcDate.getSeconds() < date2.getUTCSeconds()
            : utcDate.getSeconds() > date1.getSeconds() &&
                utcDate.getSeconds() < date2.getSeconds();

        default:
          const offset1 = isAllDateInUtcForMiliseconds
            ? 0
            : date1.getTimezoneOffset() * 60 * 100;
          const offset2 = isAllDateInUtcForMiliseconds
            ? 0
            : date2.getTimezoneOffset() * 60 * 100;
          return isUtcMode
            ? utcDate.getTime() > date1.getTime() + offset1 &&
                utcDate.getTime() < date2.getTime() + offset2
            : utcDate.getTime() > date1.getTime() &&
                utcDate.getTime() < date2.getTime();
      }
    },
    isLeapYear() {
      if (!isUtcMode) {
        addOffsetToUtcDate();
      }
      const year = utcDate.getFullYear();
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
  };

  return dateObject;
}
