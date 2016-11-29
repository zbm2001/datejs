// 宽松解析时间字符串为时间对象
// 时间分割为冒号 ":"
// 日期分隔符为除冒号外的键盘特殊字符
// 月份词（包含缩写）和星期词（包含缩写）若位置合法，会联合参与解析
// 若出现非法字符，会解析为非法日期对象（toString 出 "invalid date"） 

var rDelimiter = /`~!@#$%^&*()_-=+[{]}\|;:'",<.>/?/;

var sDelimiters = "`~!@#$%^&*()_-=+[{]}\\|;:'\",<.>/?";


// 时间分隔符
var sDelimiters = "`~!@#$%^&*()_-=+[{]}\\|;:'\",<.>/?".split('').filter(function(d){
	var sDate = ['12', '12', '2012'].join(d);
	return String(new Date(sDate)) !== 'Invalid Date';
}).join('');

var rDelimiter = "!@#$%&*(-=;:'",<.>/?";






