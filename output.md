

<!-- Start date.js -->

## setTimeToFirst()

设置日期对象的时间为 00:00:00 000

### Return:

* **number** 当前日期对象的毫秒数

## setTimeToLast()

设置日期对象的时间为 23:59:59 999

### Return:

* **number** 当前日期对象的毫秒数

## setTimeByDate(date)

设置时间与目标日期对象的时间一致 hh:mm:ss SSS

### Params:

* **Date** *date* 

### Return:

* **number** 当前日期对象的毫秒数

## compareTo(date)

与另一个日期对象比较毫秒数大小

### Params:

* **Date** *date* 

### Return:

* **number** range{-1,0,1}

## clone()

复制一个日期对象

### Return:

* **Date** 

## addMilliseconds(number)

增加日期的毫秒数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addSeconds(number)

增加日期的秒数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addMinutes(number)

增加日期的分钟数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addHours(number)

增加日期的小时数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addDays(number)

增加日期的天数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addWeeks(number)

增加日期的周数

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addMonths(number)

增加日期的月份

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## addYears(number)

增加日期的年份

### Params:

* **Number** *number* [Required]

### Return:

* **Date** this

## getNaturalMonth()

获取当月份自然数

### Return:

* **number** range{1,12}

## setNaturalMonth(month)

设置当前日期对象的月份

### Params:

* **number** *month* 月份

### Return:

* **number** 当前日期对象的毫秒数

## getDaysPerMonth()

获取当年每月天数的数组

### Return:

* **Array.\<number>** length{12} range{28,31}

## getDaysPerQuarter()

获取当年每季度天数的数组

### Return:

* **Array.\<number>** length{4} range{91,92}

## getMonthDays()

获取当年当月的天数

### Return:

* **number** range{28,31}

## getQuarterDays()

获取当年当季度的天数

### Return:

* **number** range{91,92}

## getYearDays()

获取当年的天数

### Return:

* **number** range{365,366}

## getCenturyDays()

获取当世纪的天数

### Return:

* **number** range{36523,36524}

## getQuarter()

获取当季度数

### Return:

* **number** range{1,4}

## getCentury()

获取当世纪数

### Return:

* **Number** 

## getQuarterDate()

获取当季度的第多少天

### Return:

* **number** range{1,92}

## getYearDate()

获取当年的第多少天

### Return:

* **number** range{1,366}

## getCenturyDate()

获取当个世纪的第多少天

### Return:

* **number** range{1,36524}

## isLeapYear()

判断当年是否为闰年

### Return:

* **boolean** 

## isAverageYear()

判断当年是否为平年

### Return:

* **boolean** 

## getDateByClassifier(classifier)

获取当个时间跨度量词段的第多少天

### Params:

* **string** *classifier* 

### Return:

* **number** range{1,36524}

## getRestDaysByClassifier(classifier)

获取当个时间跨度量词段的剩余天数

### Params:

* **string** *classifier* 

### Return:

* **number** 

## getDaysByClassifier(classifier)

获取当个时间跨度量词段的天数

### Params:

* **string** *classifier* 

### Return:

* **number** range{1, 36524}

## getDaysByPastClassifiers(classifier, number)

获取过去多个时间跨度量词段的天数，不包含当前的跨度量词段

### Params:

* **string** *classifier* 
* **number** *number* 

### Return:

* **number** 

## getDaysByPastMonths(number)

获取过去月数的天数，不包含当前的月份

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByPastQuarters(number)

获取过去季度数的天数，不包含当前的季度

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByPastYears(number)

获取过去年数的天数，不包含当前的年份

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByPastCenturies(number)

获取过去世纪数的天数，不包含当前的世纪

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByNextClassifiers(classifier, number)

获取过去多个时间跨度量词段的天数，不包含当前的跨度量词段

### Params:

* **string** *classifier* 
* **number** *number* 

### Return:

* **number** 

## getDaysByNextMonths(number)

获取将来月数的天数，不包含当前的月份

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByNextQuarters(number)

获取将来季度数的天数，不包含当前的季度

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByNextYears(number)

获取将来年数的天数，不包含当前的年份

### Params:

* **number** *number* 

### Return:

* **number** 

## getDaysByNextCenturies(number)

获取将来世纪数的天数，不包含当前的世纪

### Params:

* **number** *number* 

### Return:

* **number** 

## format(format)

返回格式化后的日期格式

### Params:

* **string** *format* 

### Return:

* **string** 

## isDate(date)

判断是否为日期对象

### Params:

* **Date** *date* 

### Return:

* **boolean** 

## getDaysPerMonth(year)

获取某年每月天数的数组

### Params:

* **number** *year* 年份

### Return:

* **Array.\<number>** 

## getMonthDays(month, year)

获取某年某月份的天数

### Params:

* **number** *month* 月份
* **number** *year* 年份

### Return:

* **number** range{28, 31}

## getQuarterDays(quarter, year)

获取某年某季度的天数

### Params:

* **number** *quarter* 季度
* **number** *year* 年份

### Return:

* **number** range{90, 92}

## getYearDays(year)

获取某年份的天数

### Params:

* **number** *year* 年份

### Return:

* **number** range{365,366}

## getCenturyDays(century)

获取某世纪的天数

### Params:

* **number** *century* 世纪

### Return:

* **number** range{36523,36524}

## getCenturyDaysByYear(year)

获取某年份所属世纪的天数

### Params:

* **number** *year* 年份

### Return:

* **number** range{36523,36524}

## getCentury(year)

获取某年份所属的世纪数

### Params:

* **number** *year* 

### Return:

* **number** 

## isLeapYear(year)

判断年份是否为闰年

### Params:

* **number** *year* 年份

### Return:

* **boolean** 

## isAverageYear(year)

判断年份是否为平年

### Params:

* **number** *year* 年份

### Return:

* **boolean** 

## parse(time, format)

解析格式化的日期，返回相应的日期对象

### Params:

* **string** *time* '2012-3-13 11:11:11 111' | '2012-3-13T11:11:11.111Z' | '2012-3-13' | '3/13/2012' | ...
* **string** *format* 'yyyy-MM-dd hh:mm:ss SSS' | 'yyyy-MM-ddThh:mm:ss.SSSZ' | 'yyyy-MM-dd' | 'MM/dd/yyyy' | ...

### Return:

* **Date** 

## parse2DateFormatsByPeriod(period, format)

解析时段用语，返回起始和结束两个时间格式字符串的数组

### Params:

* **string** *period* 
* **string** *format* 

### Return:

* **Array.\<string>** 

## parse2DateObjectsByPeriod(period)

解析时段用语，返回起始和结束两个日期对象的数组

### Params:

* **string** *period* 

### Return:

* **Array.\<Date>** 

## parse2DatesByPeriod(period)

解析时段用语，返回起始和结束两个日期对象的数组

### Params:

* **string** *period* 

### Return:

* **Array.\<Date>** length{2}

## name

Culture Name

## dayNames

Day Name Strings

## monthNames

Month Name Strings

## amDesignator

AM/PM Designators

## dateElementOrder

The dateElementOrder is based on the order of the
format specifiers in the formatPatterns.DatePattern.

Example:
   <pre>
   shortDatePattern    dateElementOrder
   ------------------  ----------------
   "M/d/yyyy"          "mdy"
   "dd/MM/yyyy"        "dmy"
   "yyyy-MM-dd"        "ymd"
   </pre>

The correct dateElementOrder is required by the parser to
determine the expected order of the date elements in the
string being parsed.

## formatPatterns

Standard date and time format patterns

## unitNames

date and time Names hash String

## regexPatterns

NOTE: If a string format is not parsing correctly, but
you would expect it parse, the problem likely lies below.

The following regex patterns control most of the string matching
within the parser.

The Month name and Day name patterns were automatically generated
and in general should be (mostly) correct.

Beyond the month and day name patterns are natural language strings.
Example: "next", "today", "months"

These natural language string may NOT be correct for this culture.
If they are not correct, please translate and edit this file
providing the correct regular expression pattern.

If you modify this file, please post your revised CultureInfo file
to the Datejs Forum located at http://www.datejs.com/forums/.

Please mark the subject of the post with [CultureInfo]. Example:
   Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)

We will add the modified patterns to the master source files.

As well, please review the list of "Future Strings" section below.

## i18n

******************
* Future Strings **
*******************

The following list of strings may not be currently being used, but
may be incorporated into the Datejs library later.

We would appreciate any help translating the strings below.

If you modify this file, please post your revised CultureInfo file
to the Datejs Forum located at http://www.datejs.com/forums/.

Please mark the subject of the post with [CultureInfo]. Example:
   Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)b

English Name        Translated
------------------  -----------------
about               about
ago                 ago
date                date
time                time
calendar            calendar
show                show
hourly              hourly
daily               daily
weekly              weekly
bi-weekly           bi-weekly
fortnight           fortnight
monthly             monthly
bi-monthly          bi-monthly
quarter             quarter
quarterly           quarterly
yearly              yearly
annual              annual
annually            annually
annum               annum
again               again
between             between
after               after
from now            from now
repeat              repeat
times               times
per                 per
min (abbrev minute) min
morning             morning
noon                noon
night               night
midnight            midnight
mid-night           mid-night
evening             evening
final               final
future              future
spring              spring
summer              summer
fall                fall
winter              winter
end of              end of
end                 end
long                long
short               short

<!-- End date.js -->

