import {typeOf, assign} from 'z-utils';
import {CultureInfos, getCultureInfo} from './i18n';

var ry = /y+/,
  rM = /M+/,
  rd = /d+/,
  rh = /h+/,
  rm = /m+/,
  rs = /s+/,
  rS = /S+/,

  ry_g = /y+/g,
  rM_g = /M+/g,
  rd_g = /d+/g,
  rh_g = /h+/g,
  rm_g = /m+/g,
  rs_g = /s+/g,
  rS_g = /S+/g,

  rMdhms_g = /[Mdhms]+/g,
  rDigits_g = /\d+/g,
  rPeriod = /^(this|last|past|next)\s*([0-9]*)\s*(days?|weeks?|months?|quarters?|years?|century|centuries)$/i,

  // 每月天数（平年）
  perMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  // 每季度天数（平年）
  perQuarterDays = [90, 91, 92, 92];

export {CultureInfos, getCultureInfo}

// 扩展日期类的原型方法
assign(Date.prototype, {

  /**
   * 设置日期对象的时间为 00:00:00 000
   * @returns {number} 当前日期对象的毫秒数
   */
  setTimeToFirst () {
    return this.setHours(0, 0, 0, 0);
  },

  /**
   * 设置日期对象的时间为 23:59:59 999
   * @returns {number} 当前日期对象的毫秒数
   */
  setTimeToLast () {
    return this.setHours(23, 59, 59, 999);
  },

  /**
   * 设置时间与目标日期对象的时间一致 hh:mm:ss SSS
   * @param {Date} date
   * @returns {number} 当前日期对象的毫秒数
   */
  setTimeByDate (date) {
    return this.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  },

  /**
   * 设置时间与当前日期对象的时间一致 hh:mm:ss SSS
   * @returns {number} 当前日期对象的毫秒数
   */
  setTimeByNow () {
    return this.setTimeByDate(new Date());
  },

  /**
   * 与另一个日期对象比较毫秒数大小
   * @param {Date} date
   * @returns {number} range{-1,0,1}
   */
  compareTo (date) {
    if (Date.isDate(date)) {
      return this < date ? -1 : this > date ? 1 : 0;
    }
    throw new TypeError(date + " is not a Date object");
  },

  /**
   * 判断与另一个日期对象的毫秒数一致
   * @param {Date} date
   * @returns {Boolean}
   */
  equals (date) {
    return this.compareTo(date) === 0;
  },

  /**
   * 判断比另一个日期对象的毫秒数小
   * @param {Date} date
   * @returns {Boolean}
   */
  isBefore (date) {
    return this.compareTo(date) < 0;
  },

  /**
   * 判断比另一个日期对象的毫秒数大
   * @param {Date} date
   * @returns {Boolean}
   */
  isAfter (date) {
    return this.compareTo(date) > 0;
  },

  /**
   * 判断在某个起止时间段内
   * @param {Date} start 起始时间
   * @param {Date} end 结束时间
   * @returns {Boolean}
   */
  between (start, end) {
    return this.compareTo(start) >= 0 && this.compareTo(end) <= 0;
  },

  /**
   * 复制一个日期对象
   * @returns {Date}
   */
  clone () {
    return new Date(this.getTime());
  },

  /**
   * 增加日期的毫秒数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addMilliseconds (number) {
    this.setMilliseconds(this.getMilliseconds() + number * 1);
    return this;
  },

  /**
   * 增加日期的秒数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addSeconds (number) {
    return this.addMilliseconds(number * 1000);
  },

  /**
   * 增加日期的分钟数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addMinutes (number) {
    return this.addMilliseconds(number * 60 * 1000);
  },

  /**
   * 增加日期的小时数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addHours (number) {
    return this.addMilliseconds(number * 60 * 60 * 1000);
  },

  /**
   * 增加日期的天数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addDays (number) {
    this.setDate(this.getDate() + number * 1);
    return this;
  },

  /**
   * 增加日期的周数
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addWeeks (number) {
    return this.addDays(number * 7);
  },

  /**
   * 增加日期的月份
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addMonths (number) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + number * 1);
    this.setDate(Math.min(n, this.getMonthDays()));
    return this;
  },

  /**
   * 增加日期的年份
   * @param {Number} number [Required]
   * @return {Date} this
   */
  addYears (number) {
    return this.addMonths(number * 12);
  },

  /**
   * 获取当月份自然数
   * @returns {number} range{1,12}
   */
  getNaturalMonth () {
    return this.getMonth() + 1;
  },

  /**
   * 设置当前日期对象的月份
   * @param {number} month 月份
   * @returns {number} 当前日期对象的毫秒数
   */
  setNaturalMonth (month) {
    if (Date.validateNaturalMonth(month)) {
      return this.setMonth(month - 1);
    }
    this.getTime();
  },

  /**
   * 获取当年每月天数的数组
   * @returns {Array.<number>} length{12} range{28,31}
   */
  getDaysPerMonth () {
    var year = this.getFullYear(),
      d = perMonthDays.slice();
    (year % 4 || !(year % 400)) || (d[1] = 29);
    return d;
  },

  /**
   * 获取当年每季度天数的数组
   * @returns {Array.<number>} length{4} range{91,92}
   */
  getDaysPerQuarter () {
    var year = this.getFullYear(),
      d = perQuarterDays.slice();
    (year % 4 || !(year % 400)) || (d[0] = 91);
    return d;
  },

  /**
   * 获取当年当月的天数
   * @returns {number} range{28,31}
   */
  getMonthDays () {
    var month = this.getMonth(),
      year;
    if (month !== 1) {
      return perMonthDays[month];
    }
    year = this.getFullYear();
    return year % 4 || !(year % 400) ? 28 : 29;
  },

  /**
   * 获取当年当季度的天数
   * @returns {number} range{91,92}
   */
  getQuarterDays () {
    var quarter = this.getQuarter(),
      year;
    if (quarter !== 1) {
      return perQuarterDays[quarter - 1];
    }
    year = this.getFullYear();
    return year % 4 || !(year % 400) ? 90 : 91;
  },

  /**
   * 获取当年的天数
   * @returns {number} range{365,366}
   */
  getYearDays () {
    var year = this.getFullYear();
    return year % 4 || !(year % 400) ? 365 : 366;
  },

  /**
   * 获取当世纪的天数
   * @returns {number} range{36523,36524}
   */
  getCenturyDays () {
    var days = 0,
      year = this.getFullYear(),
      startYear = parseInt(year / 100) * 100;

    days += 100 * 365 + parseInt(99 / 4);
    // 若本世纪元年为闰年，再加一天
    !(startYear % 400) && days++;

    return days;
  },

  /**
   * 获取当季度数
   * @returns {number} range{1,4}
   */
  getQuarter () {
    return parseInt((this.getMonth() + 3) / 3);
  },

  /**
   * 获取当世纪数
   * @returns {Number}
   */
  getCentury () {
    var year = this.getFullYear();
    return parseInt(year / 100);
  },

  /**
   * 获取当季度的第多少天
   * @returns {number} range{1,92}
   */
  getQuarterDate () {
    var month = this.getMonth(),
      days = month && this.getDaysPerMonth().slice(parseInt(month / 3) * 3, month).reduce(function(a, b) {
        return a + b;
      }, 0);
    return days + this.getDate();
  },

  /**
   * 获取当年的第多少天
   * @returns {number} range{1,366}
   */
  getYearDate () {
    var month = this.getMonth(),
      days = month && this.getDaysPerMonth().slice(0, month).reduce(function(a, b) {
        return a + b;
      }, 0);
    return days + this.getDate();
  },

  /**
   * 获取当个世纪的第多少天
   * @returns {number} range{1,36524}
   */
  getCenturyDate () {
    var date = this.getYearDate(),
      year = this.getFullYear(),
      startYear = parseInt(year / 100) * 100;

    date += (year - startYear - 1) * 365 + parseInt((year - startYear) / 4);
    // 若本世纪元年为闰年，再加一天
    !(startYear % 400) && date++;

    return date;
  },

  /**
   * 判断当年是否为闰年
   * @returns {boolean}
   */
  isLeapYear () {
    var year = this.getFullYear();
    return !(year % 4 || !(year % 400));
  },

  /**
   * 判断当年是否为平年
   * @returns {boolean}
   */
  isAverageYear () {
    var year = this.getFullYear();
    return !!(year % 4) || !(year % 400);
  },

  /**
   * 获取当个时间跨度量词段的第多少天
   * @param {string} classifier
   * @returns {number} range{1,36524}
   */
  getDateByClassifier (classifier) {
    switch (classifier) {
      case "day":
        return 1;
      case "week":
        return this.getDay();
      case "month":
        return this.getDate();
      case "quarter":
        return this.getQuarterDate();
      case "year":
        return this.getYearDate();
      case "century":
        return this.getCenturyDate();
      default:
        return 1;
    }
  },

  /**
   * 获取当个时间跨度量词段的剩余天数
   * @param {string} classifier
   * @returns {number}
   */
  getRestDaysByClassifier (classifier) {
    switch (classifier) {
      case "day":
        return 0;
      case "week":
        return 6 - this.getDay();
      case "month":
        return this.getMonthDays() - this.getDate();
      case "quarter":
        return this.getQuarterDays() - this.getQuarterDate();
      case "year":
        return this.getYearDays() - this.getYearDate();
      case "century":
        return this.getCenturyDays() - this.getCenturyDate();
      default:
        return 0;
    }
  },

  /**
   * 获取当个时间跨度量词段的天数
   * @param {string} classifier
   * @returns {number} range{1, 36524}
   */
  getDaysByClassifier (classifier) {
    switch (classifier) {
      case "day":
        return 1;
      case "week":
        return 7;
      case "month":
        return this.getMonthDays();
      case "quarter":
        return this.getQuarterDays();
      case "year":
        return this.getYearDays();
      case "century":
        return this.getCenturyDays();
      default:
        return 1;
    }
  },

  /**
   * 获取过去多个时间跨度量词段的天数，不包含当前的跨度量词段
   * @param {string} classifier
   * @param {number} number
   * @returns {number}
   */
  getDaysByPastClassifiers (classifier, number) {
    switch (classifier) {
      case "day":
        return number;
      case "week":
        return 7 * number;
      case "month":
        return this.getDaysByPastMonths(number);
      case "quarter":
        return this.getDaysByPastQuarters(number);
      case "year":
        return this.getDaysByPastYears(number);
      case "century":
        return this.getDaysByPastCenturies(number);
      default:
        return number;
    }
  },

  /**
   * 获取过去月数的天数，不包含当前的月份
   * @param {number} number
   * @returns {number}
   */
  getDaysByPastMonths (number) {
    var month = this.getMonth() + 1,
      year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      if (--month < 1) {
        month = 12;
        year--;
      }
      days += Date.getMonthDays(month, year);
    }
    return days;
  },

  /**
   * 获取过去季度数的天数，不包含当前的季度
   * @param {number} number
   * @returns {number}
   */
  getDaysByPastQuarters (number) {
    var quarter = this.getQuarter(),
      year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      if (--quarter < 1) {
        quarter = 4;
        year--;
      }
      days += Date.getQuarterDays(quarter, year);
    }
    return days;
  },

  /**
   * 获取过去年数的天数，不包含当前的年份
   * @param {number} number
   * @returns {number}
   */
  getDaysByPastYears (number) {
    var year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      days += Date.getYearDays(--year);
    }
    return days;
  },

  /**
   * 获取过去世纪数的天数，不包含当前的世纪
   * @param {number} number
   * @returns {number}
   */
  getDaysByPastCenturies (number) {
    var century = this.getCentury(),
      days = 0;
    for (; number > 0; number--) {
      days += Date.getCenturyDays(--century);
    }
    return days;
  },

  /**
   * 获取过去多个时间跨度量词段的天数，不包含当前的跨度量词段
   * @param {string} classifier
   * @param {number} number
   * @returns {number}
   */
  getDaysByNextClassifiers (classifier, number) {
    switch (classifier) {
      case "day":
        return number;
      case "week":
        return 7 * number;
      case "month":
        return this.getDaysByNextMonths(number);
      case "quarter":
        return this.getDaysByNextQuarters(number);
      case "year":
        return this.getDaysByNextYears(number);
      case "century":
        return this.getDaysByNextCenturies(number);
      default:
        return number;
    }
  },

  /**
   * 获取将来月数的天数，不包含当前的月份
   * @param {number} number
   * @returns {number}
   */
  getDaysByNextMonths (number) {
    var month = this.getMonth() + 1,
      year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      if (++month > 12) {
        month = 1;
        year++;
      }
      days += Date.getMonthDays(month, year);
    }
    return days;
  },

  /**
   * 获取将来季度数的天数，不包含当前的季度
   * @param {number} number
   * @returns {number}
   */
  getDaysByNextQuarters (number) {
    var quarter = this.getQuarter(),
      year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      if (++quarter > 4) {
        quarter = 1;
        year++;
      }
      days += Date.getQuarterDays(quarter, year);
    }
    return days;
  },

  /**
   * 获取将来年数的天数，不包含当前的年份
   * @param {number} number
   * @returns {number}
   */
  getDaysByNextYears (number) {
    var year = this.getFullYear(),
      days = 0;
    for (; number > 0; number--) {
      days += Date.getYearDays(++year);
    }
    return days;
  },

  /**
   * 获取将来世纪数的天数，不包含当前的世纪
   * @param {number} number
   * @returns {number}
   */
  getDaysByNextCenturies (number) {
    var century = this.getCentury(),
      days = 0;
    for (; number > 0; number--) {
      days += Date.getCenturyDays(++century);
    }
    return days;
  },

  // 获取当年第多少周
  getYearWeek () {

  },

  // 获取当季第多少周
  getQuarterWeek () {

  },

  // 获取当月第多少周
  getMonthWeek () {

  },

  /**
   * 通过一组配置项设置时间
   * @param {Object} config
   * @returns {Object} this
   */
  set (config) {
    if (Date.validateMillisecond(config.millisecond)) {
      this.addMilliseconds(config.millisecond - this.getMilliseconds());
    }

    if (Date.validateSecond(config.second)) {
      this.addSeconds(config.second - this.getSeconds());
    }

    if (Date.validateMinute(config.minute)) {
      this.addMinutes(config.minute - this.getMinutes());
    }

    if (Date.validateHour(config.hour)) {
      this.addHours(config.hour - this.getHours());
    }

    if (Date.validateMonth(config.month)) {
      this.addMonths(config.month - this.getMonth());
    }

    if (Date.validateYear(config.year)) {
      this.addYears(config.year - this.getFullYear());
    }

    /* day has to go last because you can't validate the day without first knowing the month */
    if (Date.validateDay(config.day, this.getMonth(), this.getFullYear())) {
      this.addDays(config.day - this.getDate());
    }

    if (config.timezone) {
      this.setTimezone(config.timezone);
    }

    if (config.timezoneOffset) {
      this.setTimezoneOffset(config.timezoneOffset);
    }

    if (config.week && validate(config.week, 0, 53, "week")) {
      this.setWeek(config.week);
    }

    return this;
  },

  /**
   * Get the offset from UTC of the current date.
   * @return {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
   */
  getUTCOffset () {
    var n = this.getTimezoneOffset() * -10 / 6,
      r;
    if (n < 0) {
      r = (n - 10000).toString();
      return r.charAt(0) + r.substr(2);
    } else {
      r = (n + 10000).toString();
      return "+" + r.substr(1);
    }
  },

  /**
   * Get the time zone abbreviation of the current date.
   * @return {String} The abbreviated time zone name (e.g. "EST")
   */
  getTimezone () {
    return Date.getTimezoneAbbreviation(this.getUTCOffset());
  },

  /**
   * Set the time zone abbreviation of the current date.
   * @param {string} offset
   * @return {String} The abbreviated time zone name (e.g. "EST")
   */
  setTimezoneOffset (offset) {
    // 返回协调通用时间(UTC)与当前主机时间之间的分钟差值
    // 函数的返回值为Number类型，返回当前计算机上的时间和UTC时间之间相差的分钟数。
    // 一般而言，如果当地时间早于UTC时间(在UTC时区以东，例如亚洲地区)，则返回值为负；如果当地时间晚于UTC时间(在UTC时区以西，例如美洲地区)，则返回值为正。
    var here = this.getTimezoneOffset(),
      there = Number(offset) * -6 / 10;
    return this.addMinutes(there - here);
  },

  /**
   * Set the time zone abbreviation of the current date.
   * @param {string} offset
   * @return {String} The abbreviated time zone name (e.g. "EST")
   */
  setTimezone (offset) {
    return this.setTimezoneOffset(Date.getTimezoneOffset(offset));
  },

  /**
   * 返回格式化后的日期格式
   * @param {string} format
   * @returns {string}
   */
  format (format) {

    format || (format = Date.FORMAT);

    var date = this,
      a = [
        //[ry, "getFullYear"] //year
        [rM, "getNaturalMonth"], //month + 1
        [rd, "getDate"], //day
        [rh, "getHours"], //hour
        [rm, "getMinutes"], //minute
        [rs, "getSeconds"] //second
        //,[rS, "getMilliseconds"] //millisecond
        //,["q", "getQuarter"]  //quarter
      ],
      i = 0,
      l = a.length;

    format = format.replace(ry, function(m) {
      return (date.getFullYear() + '').substr(-m.length);
    });

    for (; i < l; i++) {
      format = format.replace(a[i][0], function(m) {
        var p = date[a[i][1]]();
        return (p > 9 || m.length < 2 ? '' : '0') + p;
      });
    }

    format = format.replace(rS, function(m) {
      var S = date.getMilliseconds();
      return (S > 99 || m.length < 3 ? '' : '0') + S;
    });

    format = format.replace('q', function(m) {
      return parseInt((date.getMonth() + 3) / 3);
    });

    return format;
  }

});

/**
 * 验证与时间相关数值合法性
 * @param {Number} n 需要验证数值
 * @param {Number} min 指定数值范围的最小值
 * @param {Number} max 指定数值范围的最大值
 * @param {String} name 
 * @returns {Boolean}
 */
function validate (n, min, max, name) {
  if (n == null) {
    return false;
  }
  if (typeof n != "number") {
    throw new TypeError(n + " is not a Number.");
  } else if (n < min || n > max) {
    throw new RangeError(n + " is not a valid value for " + name + ".");
  }
  return true;
}

/**
 * 解析时段用语，返回起始和结束两个日期对象的数组
 * @param {string} period
 * @returns {Array.<Date>} length{2}
 */
function parse2DatesByPeriod (period) {

  var now = new Date(),
    start,
    start0 = new Date(),
    end,
    end2 = new Date(),
    diffStartDays = 0,
    diffEndDays = 0,
    classifier,
    classifierPlural,
    thisClassifierDays;

  // 设置开始时间为那天的 0 时计起
  start0.setTimeToFirst();
  start = start0;
  // 设置结束时间为那天的最后一毫秒截止
  end2.setTimeToLast();
  end = end2;

  switch (period) {
    case 'today': // 今天
      diffStartDays = 0;
      break;
    case 'yesterday': // 昨天
      diffStartDays = -1;
      diffEndDays = -1;
      break;
    case 'thisWeek': // 本周
      diffStartDays = 1 - start.getDay();
      break;
    case 'lastWeek': // 上周
      diffEndDays = -end.getDay();
      diffStartDays = diffEndDays + 1 - 7;
      break;
    case 'thisMonth': // 本月
      diffStartDays = 1 - start.getDate();
      break;
    case 'lastMonth': // 上月
      diffEndDays = -end.getDate();
      now.setDate(0);
      diffStartDays = diffEndDays + 1 - now.getMonthDays();
      break;
    case 'thisQuarter': // 本季度
      diffStartDays = 1 - start.getQuarterDate();
      break;
    case 'lastQuarter': // 上季度
      diffEndDays = -end.getQuarterDate();
      now.setDate(diffEndDays + now.getDate());
      diffStartDays = diffEndDays + 1 - now.getQuarterDays();
      break;
    case 'thisYear': // 本年
      diffStartDays = 1 - start.getYearDate();
      break;
    case 'lastYear': // 上年
      diffEndDays = -end.getYearDate();
      now.setFullYear(now.getFullYear() - 1);
      diffStartDays = diffEndDays + 1 - now.getYearDays();
      break;
    default:
      // last7days, last30days, last90days, last365days...
      // last5months, last3Quarter, last2years, last1centuries...
      // past10days, past4months...
      if (rPeriod.test(period) && (number = parseInt(RegExp.$2)) > 0) {
        classifierPlural = RegExp.$3;
        if (classifier = Date.pluralClassifiers[classifierPlural]) {

          switch (RegExp.$1) {
            // last 表示最近的天、周、月、季度、年、世纪数，分别对应包含今天、本周、本月、本季度、本年、本世纪
            case 'last':
              diffStartDays = -now.getDaysByPastClassifiers(classifier, number) + 1;
              break;
              // past 表示过去的天、周、月、季度、年、世纪数，分别对应不包含今天、本周、本月、本季度、本年、本世纪
            case 'past':
              diffStartDays = -now.getDaysByPastClassifiers(classifier, number);
              thisClassifierDays = now.getDateByClassifier(classifier, number);
              diffStartDays -= thisClassifierDays - 1;
              diffEndDays -= thisClassifierDays;
              break;
              // past 表示将来的天、周、月、季度、年、世纪数，分别对应不包含今天、本周、本月、本季度、本年、本世纪
            case 'next':
              diffEndDays = now.getDaysByNextClassifiers(classifier, number);
              thisClassifierDays = now.getRestDaysByClassifier(classifier, number);
              diffStartDays += thisClassifierDays + 1;
              diffEndDays += thisClassifierDays;
              break;
            default:
          }
        }
      }
      throw new Error('Unknown time period definition: ' + period);
  }
  start.setDate(start.getDate() + diffStartDays);
  end.setDate(end.getDate() + diffEndDays);

  return [start, end];
}

// 扩展静态方法
export default assign(Date, {

  /**
   * 判断是否为日期对象
   * @param {Date} date
   * @returns {boolean}
   */
  isDate (date) {
    return typeOf(date) === 'Date';
  },


  /**
   * 验证每秒的毫秒数值范围
   * @param {Number} range{0, 999}
   * @return {Boolean}
   */
  validateMillisecond (value) {
    return validate(value, 0, 999, "millisecond");
  },

  /**
   * 验证每分钟的秒数值范围
   * @param {Number} range{0, 59}
   * @return {Boolean}
   */
  validateSecond (value) {
    return validate(value, 0, 59, "second");
  },

  /**
   * 验证每小时的分钟数值范围
   * @param {Number} range{0, 59}
   * @return {Boolean}
   */
  validateMinute (value) {
    return validate(value, 0, 59, "minute");
  },

  /**
   * 验证每天的小时数值范围
   * @param {Number} range{0, 23}
   * @return {Boolean}
   */
  validateHour (value) {
    return validate(value, 0, 23, "hour");
  },

  /**
   * 验证每周的天数值范围
   * @param {Number} range{0, 6}
   * @return {Boolean}
   */
  validateDay (value) {
    return validate(value, 0, 6, "day");
  },

  /**
   * 验证每月天数值范围
   * @param {Number} range{0, 31}
   * @return {Boolean}
   */
  validateDate (value, month, year) {
    return validate(value, 1, Date.getMonthDays(month, year), "date");
  },

  /**
   * 验证每年的月份数值范围
   * @param {Number} range{0, 11}
   * @return {Boolean}
   */
  validateMonth (value) {
    return validate(value, 0, 11, "month");
  },

  /**
   * 验证每年的自然月份数值范围
   * @param {Number} range{1, 12}
   * @return {Boolean}
   */
  validateNaturalMonth (value) {
    return validate(value, 1, 12, "natural month");
  },

  /**
   * 验证年份数值范围
   * @param {Number} range{0, 9999}
   * @return {Boolean}
   */
  validateYear (value) {
    return validate(value, 0, 9999, "year");
  },

  /**
   * 创建一个当天的日期对象，时间为 00:00:00 000
   * @returns {Date}
   */
  today () {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  },

  /**
   * 获取某年每月天数的数组
   * @param {number} year 年份
   * @returns {Array.<number>}
   */
  getDaysPerMonth (year) {
    var d = perMonthDays.slice();
    Date.isLeapYear(year) && (d[1] = 29);
    return d;
  },

  /**
   * 获取某年某自然月份的天数
   * @param {number} month 月份
   * @param {number} year 年份
   * @returns {number} range{28, 31}
   */
  getMonthDays (month, year) {
    return month !== 2 ? perMonthDays[month - 1] : year % 4 || !(year % 400) ? 28 : 29;
  },

  /**
   * 获取某年某月份的天数
   * @param {number} month 月份
   * @param {number} year 年份
   * @returns {number} range{28, 31}
   */
  getNaturalMonthDays (month, year) {
    return month !== 1 ? perMonthDays[month] : year % 4 || !(year % 400) ? 28 : 29;
  },

  /**
   * 获取某年某季度的天数
   * @param {number} quarter 季度
   * @param {number} year 年份
   * @returns {number} range{90, 92}
   */
  getQuarterDays (quarter, year) {
    return quarter !== 1 ? perQuarterDays[quarter - 1] : year % 4 || !(year % 400) ? 90 : 91;
  },

  /**
   * 获取某年份的天数
   * @param {number} year 年份
   * @returns {number} range{365,366}
   */
  getYearDays (year) {
    return year % 4 || !(year % 400) ? 365 : 366;
  },

  /**
   * 获取某世纪的天数
   * @param {number} century 世纪
   * @returns {number} range{36523,36524}
   */
  getCenturyDays (century) {
    var days = 0,
      startYear = (Math.abs(century) - 1) * 100;

    days += (100) * 365 + parseInt(99 / 4);
    // 若本世纪元年为闰年，再加一天
    !(startYear % 400) && days++;

    return days;
  },

  /**
   * 获取某年份所属世纪的天数
   * @param {number} year 年份
   * @returns {number} range{36523,36524}
   */
  getCenturyDaysByYear (year) {
    var century = Date.getCentury(year);
    return Date.getCenturyDays(century);
  },

  /**
   * 获取某年份所属的世纪数
   * @param {number} year
   * @returns {number}
   */
  getCentury (year) {
    return parseInt(year / 100) + (year < 0 ? 1 : -1);
  },

  /**
   * 判断年份是否为闰年
   * @param {number} year 年份
   * @returns {boolean}
   */
  isLeapYear (year) {
    return !(year % 4 || !(year % 400));
  },

  /**
   * 判断年份是否为平年
   * @param {number} year 年份
   * @returns {boolean}
   */
  isAverageYear (year) {
    return !!(year % 4) || !(year % 400);
  },

  /**
   * 格式化日期对象、时间毫秒数、时间格式字符串表述的转换
   * @param {Date|Number|String} time 日期对象、时间毫秒数、时间格式字符串表述
   * @returns {String}
   */
  format (time, format, timeFormat) {
    // 解析为时间对象
    var date = Date.parse2Date(time, timeFormat);
    return date.format(format);
  },

  /**
   * 解析格式化的日期，返回相应的日期对象
   * @param {string} time '2012-3-13 11:11:11 111' | '2012-3-13T11:11:11.111Z' | '2012-3-13' | '3/13/2012' | ...
   * @param {string} format  'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ' |  'yyyy-MM-dd' | 'MM/dd/yyyy' | ...
   * @returns {Date}
   */
  parse2Date (time, format) {
    switch (typeOf(time)) {
        // 若为毫秒数
      case 'Number':
        return new Date(time);
        // 若为日期对象
      case 'Date':
        return time.format(format);
    }
    // 统一作转化为字符串处理
    time = String(time);

    // 若能正确解析，返回该时间的毫秒数
    // 若不能正确解析，返回NaN
    var M = Date.parse(time);
    if (M === M) {
      return new Date(M);
    }

    format = format ? format.replace(rMdhms_g, function(m) {
      return (m = m.charAt(0)) + m;
    }) : Date.FORMAT;

    time = time.replace(rDigits_g, function(m) {
      return m.length < 2 ? '0' + m : m;
    });

    var r, m, n,
      d = new Date,
      a = [
        [ry_g, "setFullYear"] //year
        ,
        [rM_g, "setNaturalMonth"] //month + 1
        ,
        [rd_g, "setDate"] //day
        ,
        [rh_g, "setHours"] //hour
        ,
        [rm_g, "setMinutes"] //minute
        ,
        [rs_g, "setSeconds"] //second
        ,
        [rS_g, "setMilliseconds"] //millisecond
      ],
      i = -1,
      l = a.length;

    while (++i < l) {
      r = a[i][0];
      m = a[i][1];
      d[m](r.test(format) ? parseInt(time.slice(r.lastIndex - RegExp.lastMatch.length, r.lastIndex)) || 0 : 0);
      r.lastIndex = 0;
    }
    return d;
  },

  /**
   * 解析时段用语，返回起始和结束两个时间格式字符串的数组
   * @param {string} period
   * @param {string} format
   * @returns {Array.<string>}
   */
  parse2DateFormatsByPeriod (period, format) {
    var dates = parse2DatesByPeriod(period);
    format || (format = Date.FORMAT);
    return [
      dates[0].format(format),
      dates[1].format(format)
    ];
  },

  /**
   * 解析时段用语，返回起始和结束两个日期对象的数组
   * @param {string} period
   * @returns {Array.<Date>}
   */
  parse2DateObjectsByPeriod (period) {
    return parse2DatesByPeriod(period);
  },

  /**
   * 根据时区的偏移量（字符串表述）获取时区的缩写名
   * @param {String} offset The 4-character offset string prefixed with + or - (e.g. "-0500")
   * @returns {String} 如：UTC|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT
   */
  getTimezoneAbbreviation (offset) {
    var CultureInfo = getCultureInfo(),
      timezones = CultureInfo.timezones;
    for (let i = 0, l = timezones.length; i < l; i++) {
      if (timezones[i].offset === offset) {
        return timezones[i].name;
      }
    }
    return null;
  },

  /**
   * 根据时区的缩写名获取时区的偏移量（字符串表述）
   * @param {String} name 如：UTC|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT
   * @returns {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
   */
  getTimezoneOffset (name) {
    var CultureInfo = getCultureInfo(),
      timezones = CultureInfo.timezones;
    for (let i = 0, l = timezones.length; i < l; i++) {
      if (timezones[i].name === name.toUpperCase()) {
        return timezones[i].offset;
      }
    }
    return null;
  },

  FORMAT: 'yyyy-MM-dd hh:mm:ss SSS',
  FORMAT_DATE: 'yyyy-MM-dd',
  FORMAT_DATETIME: 'yyyy-MM-dd hh:mm:ss',

  UTC_FORMAT: 'yyyy-MM-ddThh:mm:ss.SSSZ',

  // Hash表：时间量词复数词对应原词
  // 毫秒、秒、分钟、小时、天、周、月、季度、年、世纪
  pluralClassifiers: {
    milliseconds: "millisecond",
    seconds: "second",
    minutes: "minute",
    hours: "hour",
    days: "day",
    weeks: "week",
    months: "month",
    quarters: "quarter",
    years: "year",
    centuries: "century"
  },

  // 匹配时段语句的正则表达式
  rPeriod: rPeriod,

  CultureInfos,
  getCultureInfo,

})