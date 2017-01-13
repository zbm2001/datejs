import CultureInfo_0 from './i18n/en-US';
import CultureInfo_1 from './i18n/zh-CN';

var CultureInfos = [CultureInfo_0, CultureInfo_1];

function getCultureInfo() {
  var cultureName = typeof navigator === 'object' ? navigator.language || 'en-US' : 'en-US';
  for (let i = 0, l = CultureInfos.length; i < l; i++) {
    if (CultureInfos[i].name === cultureName) {
      return CultureInfos[i];
    }
  }
  return null;
}

export default {
	CultureInfos,
	getCultureInfo
}