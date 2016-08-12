/**
 * @version: 1.0
 * @author: zhoubaimin@rongcapital.cn
 * @date: 2016-08-15
 * @copyright: Copyright (c) 2008-2016, Object.NET, Inc. (http://object.net). All rights reserved.
 * @license: See LICENSE and https://github.com/datejs/Datejs/blob/master/LICENSE
 * @website: https://github.com/zbm2001/
 */

(function(){
	
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
	rDigitsG = /\d+/g;

    // 扩展日期类的原型方法
    Object.assign(Date.prototype, {
		
		// 获取当年每月天数
		getDaysPerMonth: function(){
			var year = this.getFullYear(),
				d = monthDays.slice();
			(year%4 || !(year%400)) || (d[1] = 29);
			return d;
		},

		// 获取当年天数
		getYearDays: function(){
			var year = this.getFullYear();
			return year%4 || !(year%400) ? 365 : 366;
		},

		// 获取当年当月天数
		getMonthDays: function(){
			var M = this.getMonth(), year;
			if( M !== 1 ){
				return monthDays[ M ];
			}
			year = this.getFullYear();
			return year%4 || !(year%400) ? 28 : 29;
		},
		
		// 判断当年是否为闰年
		isLeapYear: function(){
			var year = this.getFullYear();
			return !(year%4 || !(year%400));
		},
		
//		// 判断当年是否为平年
//		isAverageYear: function(){
//			var year = this.getFullYear();
//			return !!(year%4) || !(year%400);
//		},
		
		// 获取当月份自然数
		getRealMonth: function(){
			return this.getMonth() + 1;
		},
		
		// 设置当月份自然数
		setRealMonth: function( M ){
			return this.setMonth( M < 1 ? M : (M - 1) );
		},
		
		// 获取当季度数
		getQuarter: function(){
			return Math.floor( (this.getMonth()+3)/3 );
		},
		
		// 获取当年周数
		getYearWeek: function(){
			
		},
		
		// 获取当月周数
		getMonthWeek: function(){
			
		},
		
		// 返回格式化后的日期格式
		// @format string 'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ'
		/**
     * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
     * @param {Boolean}  .clone() this date instance before clearing Time
     * @return {Date}    this
     */
		format: function( format ){
			
			format || ( format = Date.FORMAT );
			
			var d = this, a = [ 
				//[ry, "getFullYear"] //year
				[rM, "getRealMonth"] //month + 1
				,[rd, "getDate"]    //day 
				,[rh, "getHours"]   //hour 
				,[rm, "getMinutes"] //minute 
				,[rs, "getSeconds"] //second 
				//,[rS, "getMilliseconds"] //millisecond 
				//,["q", "getQuarter"]  //quarter 
  			], i = 0, l = a.length;
			
			format = format.replace( ry, function(m){
				return (d.getFullYear() + '').substr( -m.length );
			});
			
			for(; i < l; i++){
				format = format.replace(a[i][0], function(m){
					var p = d[ a[i][1] ]();
					return ( p > 9 || m.length < 2 ? '' : '0' ) + p;
				});
			}
			
			format = format.replace( rS, function(m){
				var S = d.getMilliseconds();
				return ( S > 99 || m.length < 3 ? '' : '0' ) + S;
			});
			
			format = format.replace( 'q', function(m){
				return Math.floor( (d.getMonth()+3)/3 );
			});
			
			return format;
		}
		
    });
	
	// 每月天数（平年）
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	// 扩展静态方法
	Object.assign(Date, {
		
		// 获取一个每月份天数的数组
		// @isLeapYear 是否为闰年 true/false
		// return array
		getDaysPerMonth: function( isLeapYear ){
			var d = monthDays.slice();
			isLeapYear && (d[1] = 29);
			return d;
		},
		
		// 获取某月份的天数
		// @month 月份 1-12
		// @isLeapYear 是否为闰年
		// return number
		getDaysByMonth: function( month, isLeapYear ){
			return month !== 2 ? monthDays[ month - 1 ] : isLeapYear ? 29 : 28;
		},

		// 根据年份（平年/闰年）获取当年天数
		getDaysByYear: function( year ){
			return year%4 || !(year%400) ? 365 : 366;
		},
		
		// 判断年份是否为闰年
		isLeapYear: function(year){
			return !(year%4 || !(year%400));
		},
		
//		// 判断年份是否为平年
//		isAverageYear: function(year){
//			return !!(year%4) || !(year%400);
//		},
		
		// 解析格式化的日期，返回相应的日期对象
		// @time string '2012-3-13 11:11:11 111' | '2012-3-13T11:11:11.111Z'
		// @format string  'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ'
		parse: function( time, format ){
			
			format = format ? format.replace(rMdhmsG, function(m){
				return (m = m.charAt(0)) + m;
			}) : Date.FORMAT;
			
			time = time.replace(rDigitsG, function(m){
				return m.length < 2 ? '0' + m : m;
			});
			
			var r, m, n, 
			d = new Date, a = [ 
				[ryG, "setFullYear"] //year
				,[rMG, "setRealMonth"] //month + 1
				,[rdG, "setDate"]    //day 
				,[rhG, "setHours"]   //hour 
				,[rmG, "setMinutes"] //minute 
				,[rsG, "setSeconds"] //second 
				,[rSG, "setMilliseconds"] //millisecond 
  			], i = -1, l = a.length;
			
			while( ++i < l ){
				r = a[i][0];
				m = a[i][1];
				d[m](r.test( format ) ? parseInt( time.slice(r.lastIndex - RegExp.lastMatch.length, r.lastIndex) ) : 0);
				r.lastIndex = 0;
			}
			return d;
		},
		
		FORMAT: 'yyyy-MM-dd hh:mm:ss SSS',
		
		UTC_FORMAT: 'yyyy-MM-ddThh:mm:ss.SSSZ'
		
	});

})();