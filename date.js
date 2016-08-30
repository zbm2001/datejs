/*
 * @name: datejs
 * @version: 1.0.0
 * @description: javascript Date Object extend
 * @author: zbm2001@aliyun.com
 * @license: Apache 2.0
 */
(function () {
'use strict';

var toString = Object.prototype.toString;

function typeOf(object) {
  return toString.call(object).slice(8, -1);
}

var sPop = Array.prototype.pop + '';
var sNativeCode = sPop.slice(sPop.indexOf('{'));

function isNativeFunction(func) {
  return typeOf(func) === 'Function' && sNativeCode === (func += '').slice(func.indexOf('{'));
}

isNativeFunction(Object.assign) ? Object.assign :
  (Object.assign = function assign(target) {
    var arguments$1 = arguments;

    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target), i = 1, l = arguments.length, prop, source;
    for (; i < l; i++) {
      source = arguments$1[i];
      if (source != null) {
        for (prop in source) {
          if (source.hasOwnProperty(prop)) {
            output[prop] = source[prop];
          }
        }
      }
    }
    return output;
  });

var ry = /y+/;
var rM = /M+/;
var rd = /d+/;
var rh = /h+/;
var rm = /m+/;
var rs = /s+/;
var rS = /S+/;
var ryG = /y+/g;
var rMG = /M+/g;
var rdG = /d+/g;
var rhG = /h+/g;
var rmG = /m+/g;
var rsG = /s+/g;
var rSG = /S+/g;
var rMdhmsG = /[Mdhms]+/g;
var rDigitsG = /\d+/g;
var rPeriod = /^(this|last|past|next)([0-9]*)(days?|weeks?|months?|quarters?|years?|centuries?)$/i;
var perMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var perQuarterDays = [90, 91, 92, 92];
// 扩展日期类的原型方法
  Object.assign(Date.prototype, {

    /**
     * 设置日期对象的时间为 00:00:00 000
     * @returns {number} 当前日期对象的毫秒数
     */
    setTimeToFirst: function () {
      return this.setHours(0, 0, 0, 0);
    },

    /**
     * 设置日期对象的时间为 23:59:59 999
     * @returns {number} 当前日期对象的毫秒数
     */
    setTimeToLast: function () {
      return this.setHours(23, 59, 59, 999);
    },

    /**
     * 设置时间与目标日期对象的时间一致 hh:mm:ss SSS
     * @param {Date} date
     * @returns {number} 当前日期对象的毫秒数
     */
    setTimeByDate: function (date) {
      return this.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    },

    /**
     * 与另一个日期对象比较毫秒数大小
     * @param {Date} date
     * @returns {number} range{-1,0,1}
     */
    compareTo: function (date) {
      if (Date.isDate(date)) {
        return this < date ? -1 : this > date ? 1 : 0;
      }
      throw new TypeError(date + "is not a Date object");
    },

    /**
     * 复制一个日期对象
     * @returns {Date}
     */
    clone: function () {
      return new Date(this.getTime());
    },

    /**
     * 增加日期的毫秒数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addMilliseconds: function (number) {
      this.setMilliseconds(this.getMilliseconds() + number * 1);
      return this;
    },

    /**
     * 增加日期的秒数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addSeconds: function (number) {
      return this.addMilliseconds(number * 1000);
    },

    /**
     * 增加日期的分钟数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addMinutes: function (number) {
      return this.addMilliseconds(number * 60 * 1000);
    },

    /**
     * 增加日期的小时数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addHours: function (number) {
      return this.addMilliseconds(number * 60 * 60 *1000);
    },

    /**
     * 增加日期的天数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addDays: function (number) {
      this.setDate(this.getDate() + number * 1);
      return this;
    },

    /**
     * 增加日期的周数
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addWeeks: function (number) {
      return this.addDays(number * 7);
    },

    /**
     * 增加日期的月份
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addMonths: function (number) {
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
    addYears: function (number) {
      return this.addMonths(number * 12);
    },

    /**
     * 获取当月份自然数
     * @returns {number} range{1,12}
     */
    getNaturalMonth: function () {
      return this.getMonth() + 1;
    },

    /**
     * 设置当前日期对象的月份
     * @param {number} month 月份
     * @returns {number} 当前日期对象的毫秒数
     */
    setNaturalMonth: function (month) {
      month = Number(month);
      if (typeof month === 'number') {
        month = parseInt(month);
        if (month === 0) {
          return this.getTime();
        }
        month > 0 && month--;
      }
      return this.setMonth(month);
    },

    /**
     * 获取当年每月天数的数组
     * @returns {Array.<number>} length{12} range{28,31}
     */
    getDaysPerMonth: function () {
      var year = this.getFullYear(),
        d = perMonthDays.slice();
      (year % 4 || !(year % 400)) || (d[1] = 29);
      return d;
    },

    /**
     * 获取当年每季度天数的数组
     * @returns {Array.<number>} length{4} range{91,92}
     */
    getDaysPerQuarter: function () {
      var year = this.getFullYear(),
        d = perQuarterDays.slice();
      (year % 4 || !(year % 400)) || (d[0] = 91);
      return d;
    },

    /**
     * 获取当年当月的天数
     * @returns {number} range{28,31}
     */
    getMonthDays: function () {
      var month = this.getMonth(), year;
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
    getQuarterDays: function () {
      var quarter = this.getQuarter(), year;
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
    getYearDays: function () {
      var year = this.getFullYear();
      return year % 4 || !(year % 400) ? 365 : 366;
    },

    /**
     * 获取当世纪的天数
     * @returns {number} range{36523,36524}
     */
    getCenturyDays: function () {
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
    getQuarter: function () {
      return parseInt((this.getMonth() + 3) / 3);
    },

    /**
     * 获取当世纪数
     * @returns {Number}
     */
    getCentury: function () {
      var year = this.getFullYear();
      return parseInt(year / 100);
    },

    /**
     * 获取当季度的第多少天
     * @returns {number} range{1,92}
     */
    getQuarterDate: function () {
      var month = this.getMonth(),
        days = month && this.getDaysPerMonth().slice(parseInt(month / 3) * 3, month).reduce(function (a, b) {
            return a + b;
          }, 0);
      return days + this.getDate();
    },

    /**
     * 获取当年的第多少天
     * @returns {number} range{1,366}
     */
    getYearDate: function () {
      var month = this.getMonth(),
        days = month && this.getDaysPerMonth().slice(0, month).reduce(function (a, b) {
            return a + b;
          }, 0);
      return days + this.getDate();
    },

    /**
     * 获取当个世纪的第多少天
     * @returns {number} range{1,36524}
     */
    getCenturyDate: function () {
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
    isLeapYear: function () {
      var year = this.getFullYear();
      return !(year % 4 || !(year % 400));
    },

    /**
     * 判断当年是否为平年
     * @returns {boolean}
     */
    isAverageYear: function () {
      var year = this.getFullYear();
      return !!(year % 4) || !(year % 400);
    },

    /**
     * 获取当个时间跨度量词段的第多少天
     * @param {string} classifier
     * @returns {number} range{1,36524}
     */
    getDateByClassifier: function (classifier) {
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
    getRestDaysByClassifier: function (classifier) {
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
    getDaysByClassifier: function (classifier) {
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
    getDaysByPastClassifiers: function (classifier, number) {
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
    getDaysByPastMonths: function (number) {
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
    getDaysByPastQuarters: function (number) {
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
    getDaysByPastYears: function (number) {
      var year = this.getFullYear(), days = 0;
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
    getDaysByPastCenturies: function (number) {
      var century = this.getCentury(), days = 0;
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
    getDaysByNextClassifiers: function (classifier, number) {
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
    getDaysByNextMonths: function (number) {
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
    getDaysByNextQuarters: function (number) {
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
    getDaysByNextYears: function (number) {
      var year = this.getFullYear(), days = 0;
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
    getDaysByNextCenturies: function (number) {
      var century = this.getCentury(), days = 0;
      for (; number > 0; number--) {
        days += Date.getCenturyDays(++century);
      }
      return days;
    },

    // 获取当年第多少周
    getYearWeek: function () {

    },

    // 获取当季第多少周
    getQuarterWeek: function () {

    },

    // 获取当月第多少周
    getMonthWeek: function () {

    },

    /**
     * 返回格式化后的日期格式
     * @param {string} format
     * @returns {string}
     */
    format: function (format) {

      format || ( format = Date.FORMAT );

      var date = this, a = [
        //[ry, "getFullYear"] //year
        [rM, "getNaturalMonth"] //month + 1
        , [rd, "getDate"]    //day
        , [rh, "getHours"]   //hour
        , [rm, "getMinutes"] //minute
        , [rs, "getSeconds"] //second
        //,[rS, "getMilliseconds"] //millisecond
        //,["q", "getQuarter"]  //quarter
      ], i = 0, l = a.length;

      format = format.replace(ry, function (m) {
        return (date.getFullYear() + '').substr(-m.length);
      });

      for (; i < l; i++) {
        format = format.replace(a[i][0], function (m) {
          var p = date[a[i][1]]();
          return ( p > 9 || m.length < 2 ? '' : '0' ) + p;
        });
      }

      format = format.replace(rS, function (m) {
        var S = date.getMilliseconds();
        return ( S > 99 || m.length < 3 ? '' : '0' ) + S;
      });

      format = format.replace('q', function (m) {
        return parseInt((date.getMonth() + 3) / 3);
      });

      return format;
    }

  });

  // 扩展静态方法
  Object.assign(Date, {

    /**
     * 判断是否为日期对象
     * @param {Date} date
     * @returns {boolean}
     */
    isDate: function (date) {
      return Object.prototype.toString.call(date) === '[object Date]';
    },

    /**
     * 获取某年每月天数的数组
     * @param {number} year 年份
     * @returns {Array.<number>}
     */
    getDaysPerMonth: function (year) {
      var d = perMonthDays.slice();
      Date.isLeapYear(year) && (d[1] = 29);
      return d;
    },

    /**
     * 获取某年某月份的天数
     * @param {number} month 月份
     * @param {number} year 年份
     * @returns {number} range{28, 31}
     */
    getMonthDays: function (month, year) {
      return month !== 2 ? perMonthDays[month - 1] : year % 4 || !(year % 400) ? 28 : 29;
    },

    /**
     * 获取某年某季度的天数
     * @param {number} quarter 季度
     * @param {number} year 年份
     * @returns {number} range{90, 92}
     */
    getQuarterDays: function (quarter, year) {
      return quarter !== 1 ? perQuarterDays[quarter - 1] : year % 4 || !(year % 400) ? 90 : 91;
    },

    /**
     * 获取某年份的天数
     * @param {number} year 年份
     * @returns {number} range{365,366}
     */
    getYearDays: function (year) {
      return year % 4 || !(year % 400) ? 365 : 366;
    },

    /**
     * 获取某世纪的天数
     * @param {number} century 世纪
     * @returns {number} range{36523,36524}
     */
    getCenturyDays: function (century) {
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
    getCenturyDaysByYear: function (year) {
      var century = Date.getCentury(year);
      return Date.getCenturyDays(century);
    },

    /**
     * 获取某年份所属的世纪数
     * @param {number} year
     * @returns {number}
     */
    getCentury: function (year) {
      return parseInt(year / 100) + (year < 0 ? 1 : -1);
    },

    /**
     * 判断年份是否为闰年
     * @param {number} year 年份
     * @returns {boolean}
     */
    isLeapYear: function (year) {
      return !(year % 4 || !(year % 400));
    },

    /**
     * 判断年份是否为平年
     * @param {number} year 年份
     * @returns {boolean}
     */
    isAverageYear: function (year) {
      return !!(year % 4) || !(year % 400);
    },

    /**
     * 解析格式化的日期，返回相应的日期对象
     * @param {string} time '2012-3-13 11:11:11 111' | '2012-3-13T11:11:11.111Z' | '2012-3-13' | '3/13/2012' | ...
     * @param {string} format  'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ' |  'yyyy-MM-dd' | 'MM/dd/yyyy' | ...
     * @returns {Date}
     */
    parse2Date: function (time, format) {

      var M = Date.parse(time);

      if(M === M){
        return new Date(M);
      }

      format = format ? format.replace(rMdhmsG, function (m) {
        return (m = m.charAt(0)) + m;
      }) : Date.FORMAT;

      time = time.replace(rDigitsG, function (m) {
        return m.length < 2 ? '0' + m : m;
      });

      var r, m, n,
        d = new Date, a = [
          [ryG, "setFullYear"] //year
          , [rMG, "setRealMonth"] //month + 1
          , [rdG, "setDate"]    //day
          , [rhG, "setHours"]   //hour
          , [rmG, "setMinutes"] //minute
          , [rsG, "setSeconds"] //second
          , [rSG, "setMilliseconds"] //millisecond
        ], i = -1, l = a.length;

      while (++i < l) {
        r = a[i][0];
        m = a[i][1];
        d[m](r.test(format) ? parseInt(time.slice(r.lastIndex - RegExp.lastMatch.length, r.lastIndex)) : 0);
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
    parse2DateFormatsByPeriod: function (period, format) {
      var dates = parse2DatesByPeriod(period);
      format || ( format = Date.FORMAT );
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
    parse2DateObjectsByPeriod: function (period) {
      return parse2DatesByPeriod(period);
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
    rPeriod: rPeriod

  });

  /**
   * 解析时段用语，返回起始和结束两个日期对象的数组
   * @param {string} period
   * @returns {Array.<Date>} length{2}
   */
  function parse2DatesByPeriod(period) {

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
      case 'thisWeek':  // 本周
        diffStartDays = 1 - start.getDay();
        break;
      case 'lastWeek': // 上周
        diffEndDays = -end.getDay();
        diffStartDays = diffEndDays + 1 - 7;
        break;
      case 'thisMonth':  // 本月
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
      case 'lastYear':  // 上年
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
        throw new Error('Unknown time period definition: ' + 'period');
    }
    start.setDate(start.getDate() + diffStartDays);
    end.setDate(end.getDate() + diffEndDays);

    return [start, end];
  }

var i18n = {
  /* Culture Name */
  name: "zh-CN",
  englishName: "Chinese (People's Republic of China)",
  nativeName: "中文(中华人民共和国)",

  /* Day Name Strings */
  dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  abbreviatedDayNames: ["日", "一", "二", "三", "四", "五", "六"],
  shortestDayNames: ["日", "一", "二", "三", "四", "五", "六"],
  firstLetterDayNames: ["日", "一", "二", "三", "四", "五", "六"],

  /* Month Name Strings */
  monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  abbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],

  /* AM/PM Designators */
  amDesignator: "上午",
  pmDesignator: "下午",

  firstDayOfWeek: 0,
  twoDigitYearMax: 2029,

  /**
   * The dateElementOrder is based on the order of the
   * format specifiers in the formatPatterns.DatePattern.
   *
   * Example:
   <pre>
   shortDatePattern    dateElementOrder
   ------------------  ----------------
   "M/d/yyyy"          "mdy"
   "dd/MM/yyyy"        "dmy"
   "yyyy-MM-dd"        "ymd"
   </pre>
   *
   * The correct dateElementOrder is required by the parser to
   * determine the expected order of the date elements in the
   * string being parsed.
   */
  dateElementOrder: "ymd",

  /* Standard date and time format patterns */
  formatPatterns: {
    shortDate: "yyyy/M/d",
    longDate: "yyyy'年'M'月'd'日'",
    shortTime: "H:mm",
    longTime: "H:mm:ss",
    fullDateTime: "yyyy'年'M'月'd'日' H:mm:ss",
    sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
    universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
    rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
    monthDay: "M'月'd'日'",
    yearMonth: "yyyy'年'M'月'"
  },

  /* date and time Names hash String */
  unitNames: {
    millisecond: "毫秒",
    second: "秒",
    minute: "分钟",
    hour: "小时",
    day: "天",
    week: "周",
    month: "月",
    quarter: "季度",
    year: "年",
    century: "世纪"
  },

  /**
   * NOTE: If a string format is not parsing correctly, but
   * you would expect it parse, the problem likely lies below.
   *
   * The following regex patterns control most of the string matching
   * within the parser.
   *
   * The Month name and Day name patterns were automatically generated
   * and in general should be (mostly) correct.
   *
   * Beyond the month and day name patterns are natural language strings.
   * Example: "next", "today", "months"
   *
   * These natural language string may NOT be correct for this culture.
   * If they are not correct, please translate and edit this file
   * providing the correct regular expression pattern.
   *
   * If you modify this file, please post your revised CultureInfo file
   * to the Datejs Forum located at http://www.datejs.com/forums/.
   *
   * Please mark the subject of the post with [CultureInfo]. Example:
   *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)
   *
   * We will add the modified patterns to the master source files.
   *
   * As well, please review the list of "Future Strings" section below.
   */
  regexPatterns: {
    jan: /^一月/i,
    feb: /^二月/i,
    mar: /^三月/i,
    apr: /^四月/i,
    may: /^五月/i,
    jun: /^六月/i,
    jul: /^七月/i,
    aug: /^八月/i,
    sep: /^九月/i,
    oct: /^十月/i,
    nov: /^十一月/i,
    dec: /^十二月/i,

    sun: /^星期日/i,
    mon: /^星期一/i,
    tue: /^星期二/i,
    wed: /^星期三/i,
    thu: /^星期四/i,
    fri: /^星期五/i,
    sat: /^星期六/i,

    future: /^next/i,
    past: /^last|past|prev(ious)?/i,
    add: /^(\+|aft(er)?|from|hence)/i,
    subtract: /^(\-|bef(ore)?|ago)/i,

    yesterday: /^yes(terday)?/i,
    today: /^t(od(ay)?)?/i,
    tomorrow: /^tom(orrow)?/i,
    now: /^n(ow)?/i,

    millisecond: /^ms|milli(second)?s?/i,
    second: /^sec(ond)?s?/i,
    minute: /^mn|min(ute)?s?/i,
    hour: /^h(our)?s?/i,
    week: /^w(eek)?s?/i,
    month: /^m(onth)?s?/i,
    day: /^d(ay)?s?/i,
    year: /^y(ear)?s?/i,

    shortMeridian: /^(a|p)/i,
    longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
    timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,
    ordinalSuffix: /^\s*(st|nd|rd|th)/i,
    timeContext: /^\s*(\:|a(?!u|p)|p)/i
  },

  timezones: [{name:"UTC", offset:"-000"}, {name:"GMT", offset:"-000"}, {name:"EST", offset:"-0500"}, {name:"EDT", offset:"-0400"}, {name:"CST", offset:"-0600"}, {name:"CDT", offset:"-0500"}, {name:"MST", offset:"-0700"}, {name:"MDT", offset:"-0600"}, {name:"PST", offset:"-0800"}, {name:"PDT", offset:"-0700"}]
};

/********************
 ** Future Strings **
 ********************
 *
 * The following list of strings may not be currently being used, but
 * may be incorporated into the Datejs library later.
 *
 * We would appreciate any help translating the strings below.
 *
 * If you modify this file, please post your revised CultureInfo file
 * to the Datejs Forum located at http://www.datejs.com/forums/.
 *
 * Please mark the subject of the post with [CultureInfo]. Example:
 *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)b
 *
 * English Name        Translated
 * ------------------  -----------------
 * about               about
 * ago                 ago
 * date                date
 * time                time
 * calendar            calendar
 * show                show
 * hourly              hourly
 * daily               daily
 * weekly              weekly
 * bi-weekly           bi-weekly
 * fortnight           fortnight
 * monthly             monthly
 * bi-monthly          bi-monthly
 * quarter             quarter
 * quarterly           quarterly
 * yearly              yearly
 * annual              annual
 * annually            annually
 * annum               annum
 * again               again
 * between             between
 * after               after
 * from now            from now
 * repeat              repeat
 * times               times
 * per                 per
 * min (abbrev minute) min
 * morning             morning
 * noon                noon
 * night               night
 * midnight            midnight
 * mid-night           mid-night
 * evening             evening
 * final               final
 * future              future
 * spring              spring
 * summer              summer
 * fall                fall
 * winter              winter
 * end of              end of
 * end                 end
 * long                long
 * short               short
 */

Date.i18n = i18n;
//export * from './core';

}());