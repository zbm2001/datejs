/**
 * @language: Javascript ECMA5
 * @name: datejs
 * @description: Javascript Date Object extend
 * @version: 1.0.0
 * @author: zbm2001@aliyun.com
 * @date: 2016-08-15
 * @copyright: Copyright (c) 2008-2016, Zhou Bai Min. (https://github.com/zbm2001). All rights reserved.
 * @license: See LICENSE and https://github.com/zbm2001/datejs/blob/master/LICENSE
 * @website: https://github.com/zbm2001
 */

(function () {

  var ry = /y+/,
    rM = /M+/,
    rd = /d+/,
    rh = /h+/,
    rm = /m+/,
    rs = /s+/,
    rS = /S+/,

    ryG = /y+/g,
    rMG = /M+/g,
    rdG = /d+/g,
    rhG = /h+/g,
    rmG = /m+/g,
    rsG = /s+/g,
    rSG = /S+/g,

    rMdhmsG = /[Mdhms]+/g,
    rDigitsG = /\d+/g,
    rPeriod = /^(last|past|next)([0-9]*)([dD]ays|[wW]eeks|[mM]onths|[qQ]uarters|[yY]ears|[cC]enturies)$/,

  // ÿ��������ƽ�꣩
    perMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  // ÿ����������ƽ�꣩
    perQuarterDays = [90, 91, 92, 92],

    toString = Object.prototype.toString;

  // ��չ�������ԭ�ͷ���
  Object.assign(Date.prototype, {

    /**
     * �������ڶ����ʱ��Ϊ 00:00:00 000
     * @returns {number} ��ǰ���ڶ���ĺ�����
     */
    setTimeToFirst: function () {
      return this.setHour(0, 0, 0, 0);
    },

    /**
     * �������ڶ����ʱ��Ϊ 23:59:59 999
     * @returns {number} ��ǰ���ڶ���ĺ�����
     */
    setTimeToLast: function () {
      return this.setHour(23, 59, 59, 999);
    },

    /**
     * ����ʱ����Ŀ�����ڶ����ʱ��һ�� hh:mm:ss SSS
     * @param {Date} date
     * @returns {number} ��ǰ���ڶ���ĺ�����
     */
    setTimeByDate: function (date) {
      return this.setHour(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    },

    /**
     * ����һ�����ڶ���ȽϺ�������С
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
     * ����һ�����ڶ���
     * @returns {Date}
     */
    clone: function () {
      return new Date(this.getTime());
    },

    /**
     * �������ڵĺ�����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addMilliseconds: function (number) {
      this.setMilliseconds(this.getMilliseconds() + number * 1);
      return this;
    },

    /**
     * �������ڵ�����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addSeconds: function (number) {
      return this.addMilliseconds(number * 1000);
    },

    /**
     * �������ڵķ�����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addMinutes: function (number) {
      return this.addMilliseconds(number * 60 * 1000);
    },

    /**
     * �������ڵ�Сʱ��
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addHours: function (number) {
      return this.addMilliseconds(number * 60 * 60 *1000);
    },

    /**
     * �������ڵ�����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addDays: function (number) {
      this.setDate(this.getDate() + number * 1);
      return this;
    },

    /**
     * �������ڵ�����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addWeeks: function (number) {
      return this.addDays(number * 7);
    },

    /**
     * �������ڵ��·�
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
     * �������ڵ����
     * @param {Number} number [Required]
     * @return {Date} this
     */
    addYears: function (number) {
      return this.addMonths(number * 12);
    },

    /**
     * ��ȡ���·���Ȼ��
     * @returns {number} range{1,12}
     */
    getNaturalMonth: function () {
      return this.getMonth() + 1;
    },

    /**
     * ���õ�ǰ���ڶ�����·�
     * @param {number} month �·�
     * @returns {number} ��ǰ���ڶ���ĺ�����
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
     * ��ȡ����ÿ������������
     * @returns {Array.<number>} length{12} range{28,31}
     */
    getDaysPerMonth: function () {
      var year = this.getFullYear(),
        d = perMonthDays.slice();
      (year % 4 || !(year % 400)) || (d[1] = 29);
      return d;
    },

    /**
     * ��ȡ����ÿ��������������
     * @returns {Array.<number>} length{4} range{91,92}
     */
    getDaysPerQuarter: function () {
      var year = this.getFullYear(),
        d = perQuarterDays.slice();
      (year % 4 || !(year % 400)) || (d[0] = 91);
      return d;
    },

    /**
     * ��ȡ���굱�µ�����
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
     * ��ȡ���굱���ȵ�����
     * @returns {number} range{91,92}
     */
    getQuarterDays: function () {
      var quarter = this.getQuarter(), year;
      if (quarter !== 0) {
        return perQuarterDays[quarter];
      }
      year = this.getFullYear();
      return year % 4 || !(year % 400) ? 90 : 91;
    },

    /**
     * ��ȡ���������
     * @returns {number} range{365,366}
     */
    getYearDays: function () {
      var year = this.getFullYear();
      return year % 4 || !(year % 400) ? 365 : 366;
    },

    /**
     * ��ȡ�����͵�����
     * @returns {number} range{36523,36524}
     */
    getCenturyDays: function () {
      var days = 0,
        year = this.getFullYear(),
        startYear = parseInt(year / 100) * 100;

      days += 100 * 365 + parseInt(99 / 4);
      // ��������Ԫ��Ϊ���꣬�ټ�һ��
      !(startYear % 400) && days++;

      return days;
    },

    /**
     * ��ȡ��������
     * @returns {number} range{1,4}
     */
    getQuarter: function () {
      return parseInt((this.getMonth() + 3) / 3);
    },

    /**
     * ��ȡ��������
     * @returns {Number}
     */
    getCentury: function () {
      var year = this.getFullYear();
      return parseInt(year / 100);
    },

    /**
     * ��ȡ�����ȵĵڶ�����
     * @returns {number} range{1,92}
     */
    getQuarterDate: function () {
      var month = this.getMonth(),
        days = month || this.getDaysPerMonth().slice(parseInt(month / 3) * 3, month).reduce(function (a, b) {
            return a + b;
          }, 0);
      return days + this.getDate();
    },

    /**
     * ��ȡ����ĵڶ�����
     * @returns {number} range{1,366}
     */
    getYearDate: function () {
      var month = this.getMonth(),
        days = month || this.getDaysPerMonth().slice(0, month).reduce(function (a, b) {
            return a + b;
          }, 0);
      return days + this.getDate();
    },

    /**
     * ��ȡ�������͵ĵڶ�����
     * @returns {number} range{1,36524}
     */
    getCenturyDate: function () {
      var date = this.getYearDate(),
        year = this.getFullYear(),
        startYear = parseInt(year / 100) * 100;

      date += (year - startYear - 1) * 365 + parseInt((year - startYear) / 4);
      // ��������Ԫ��Ϊ���꣬�ټ�һ��
      !(startYear % 400) && date++;

      return date;
    },

    /**
     * �жϵ����Ƿ�Ϊ����
     * @returns {boolean}
     */
    isLeapYear: function () {
      var year = this.getFullYear();
      return !(year % 4 || !(year % 400));
    },

    /**
     * �жϵ����Ƿ�Ϊƽ��
     * @returns {boolean}
     */
    isAverageYear: function () {
      var year = this.getFullYear();
      return !!(year % 4) || !(year % 400);
    },

    /**
     * ��ȡ����ʱ�������ʶεĵڶ�����
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
     * ��ȡ����ʱ�������ʶε�ʣ������
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
     * ��ȡ����ʱ�������ʶε�����
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
     * ��ȡ��ȥ���ʱ�������ʶε���������������ǰ�Ŀ�����ʶ�
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
     * ��ȡ��ȥ��������������������ǰ���·�
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
     * ��ȡ��ȥ����������������������ǰ�ļ���
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
     * ��ȡ��ȥ��������������������ǰ�����
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
     * ��ȡ��ȥ����������������������ǰ������
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
     * ��ȡ��ȥ���ʱ�������ʶε���������������ǰ�Ŀ�����ʶ�
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
     * ��ȡ������������������������ǰ���·�
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
     * ��ȡ��������������������������ǰ�ļ���
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
     * ��ȡ������������������������ǰ�����
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
     * ��ȡ��������������������������ǰ������
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

    // ��ȡ����ڶ�����
    getYearWeek: function () {

    },

    // ��ȡ�����ڶ�����
    getQuarterWeek: function () {

    },

    // ��ȡ���µڶ�����
    getMonthWeek: function () {

    },

    /**
     * ���ظ�ʽ��������ڸ�ʽ
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

  // ��չ��̬����
  Object.assign(Date, {

    /**
     * �ж��Ƿ�Ϊ���ڶ���
     * @param {Date} date
     * @returns {boolean}
     */
    isDate: function (date) {
      return toString.call(date) === '[object Date]';
    },

    /**
     * ��ȡĳ��ÿ������������
     * @param {number} year ���
     * @returns {Array.<number>}
     */
    getDaysPerMonth: function (year) {
      var d = perMonthDays.slice();
      Date.isLeapYear(year) && (d[1] = 29);
      return d;
    },

    /**
     * ��ȡĳ��ĳ�·ݵ�����
     * @param {number} month �·�
     * @param {number} year ���
     * @returns {number} range{28, 31}
     */
    getMonthDays: function (month, year) {
      return month !== 2 ? perMonthDays[month - 1] : year % 4 || !(year % 400) ? 28 : 29;
    },

    /**
     * ��ȡĳ��ĳ���ȵ�����
     * @param {number} quarter ����
     * @param {number} year ���
     * @returns {number} range{90, 92}
     */
    getQuarterDays: function (quarter, year) {
      return quarter !== 0 ? perQuarterDays[quarter - 1] : year % 4 || !(year % 400) ? 90 : 91;
    },

    /**
     * ��ȡĳ��ݵ�����
     * @param {number} year ���
     * @returns {number} range{365,366}
     */
    getYearDays: function (year) {
      return year % 4 || !(year % 400) ? 365 : 366;
    },

    /**
     * ��ȡĳ���͵�����
     * @param {number} century ����
     * @returns {number} range{36523,36524}
     */
    getCenturyDays: function (century) {
      var days = 0,
        startYear = (Math.abs(century) - 1) * 100;

      days += (100) * 365 + parseInt(99 / 4);
      // ��������Ԫ��Ϊ���꣬�ټ�һ��
      !(startYear % 400) && days++;

      return days;
    },

    /**
     * ��ȡĳ����������͵�����
     * @param {number} year ���
     * @returns {number} range{36523,36524}
     */
    getCenturyDaysByYear: function (year) {
      var century = Date.getCentury(year);
      return Date.getCenturyDays(century);
    },

    /**
     * ��ȡĳ���������������
     * @param {number} year
     * @returns {number}
     */
    getCentury: function (year) {
      return parseInt(year / 100) + (year < 0 ? 1 : -1);
    },

    /**
     * �ж�����Ƿ�Ϊ����
     * @param {number} year ���
     * @returns {boolean}
     */
    isLeapYear: function (year) {
      return !(year % 4 || !(year % 400));
    },

    /**
     * �ж�����Ƿ�Ϊƽ��
     * @param {number} year ���
     * @returns {boolean}
     */
    isAverageYear: function (year) {
      return !!(year % 4) || !(year % 400);
    },

    /**
     * ������ʽ�������ڣ�������Ӧ�����ڶ���
     * @param {string} time '2012-3-13 11:11:11 111' | '2012-3-13T11:11:11.111Z' | '2012-3-13' | '3/13/2012' | ...
     * @param {string} format  'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ' |  'yyyy-MM-dd' | 'MM/dd/yyyy' | ...
     * @returns {Date}
     */
    parse2: function (time, format) {

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
     * ����ʱ�����������ʼ�ͽ�������ʱ���ʽ�ַ���������
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
     * ����ʱ�����������ʼ�ͽ����������ڶ��������
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

    // Hash��ʱ�����ʸ����ʶ�Ӧԭ��
    // ���롢�롢���ӡ�Сʱ���졢�ܡ��¡����ȡ��ꡢ����
    pluralClassifiers: {
      millisecond: "millisecond",
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

    // ƥ��ʱ������������ʽ
    rPeriod: rPeriod

  });

  /**
   * ����ʱ�����������ʼ�ͽ����������ڶ��������
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
      thisClassifierDays,
      number;

    // ���ÿ�ʼʱ��Ϊ����� 0 ʱ����
    start0.setTimeToFirst();
    start = start0;
    // ���ý���ʱ��Ϊ��������һ�����ֹ
    end2.setTimeToLast();
    end = end2;

    switch (period) {
      case 'today': // ����
        diffStartDays = 0;
        break;
      case 'yesterday': // ����
        diffStartDays = -1;
        diffEndDays = -1;
        break;
      case 'thisWeek':  // ����
        diffStartDays = 1 - start.getDay();
        break;
      case 'lastWeek': // ����
        diffEndDays = -end.getDay();
        diffStartDays = diffEndDays + 1 - 7;
        break;
      case 'thisMonth':  // ����
        diffStartDays = 1 - start.getDate();
        break;
      case 'lastMonth': // ����
        diffEndDays = -end.getDate();
        now.setDate(0);
        diffStartDays = diffEndDays + 1 - now.getMonthDays();
        break;
      case 'thisQuarter': // ������
        diffStartDays = 1 - start.getQuarterDate();
        break;
      case 'lastQuarter': // �ϼ���
        diffEndDays = -end.getQuarterDate();
        now.setDate(diffEndDays + now.getDate());
        diffStartDays = diffEndDays + 1 - now.getQuarterDays();
        break;
      case 'thisYear': // ����
        diffStartDays = 1 - start.getYearDate();
        break;
      case 'lastYear':  // ����
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
              // last ��ʾ������졢�ܡ��¡����ȡ��ꡢ���������ֱ��Ӧ�������졢���ܡ����¡������ȡ����ꡢ������
              case 'last':
                diffStartDays = -now.getDaysByPastClassifiers(classifier, number);
              // past ��ʾ��ȥ���졢�ܡ��¡����ȡ��ꡢ���������ֱ��Ӧ���������졢���ܡ����¡������ȡ����ꡢ������
              case 'past':
                thisClassifierDays = now.getDateByClassifier(classifier);
                diffStartDays -= thisClassifierDays;
                diffEndDays -= thisClassifierDays;
                break;
              // past ��ʾ�������졢�ܡ��¡����ȡ��ꡢ���������ֱ��Ӧ���������졢���ܡ����¡������ȡ����ꡢ������
              case 'next':
                diffEndDays = now.getDaysByNextClassifiers(classifier, number);
                thisClassifierDays = now.getRestDaysByClassifier(classifier);
                diffStartDays += thisClassifierDays;
                diffEndDays += thisClassifierDays;
                break;
              default:
            }
          }
        }
    }
    start.setDate(start.getDate() + diffStartDays);
    end.setDate(end.getDate() + diffEndDays);

    return [start, end];
  }

})();