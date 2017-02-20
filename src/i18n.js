import CultureInfo_0 from './i18n/en-US'
import CultureInfo_1 from './i18n/zh-CN'

const CultureInfos = [CultureInfo_0, CultureInfo_1]

function getCultureInfo() {
  let cultureName = typeof navigator === 'object' ? navigator.language || 'en-US' : 'en-US'
  for (let i = 0, l = CultureInfos.length; i < l; i++) {
    if (CultureInfos[i].name === cultureName) {
      return CultureInfos[i]
    }
  }
  return null
}

export {
	CultureInfos,
	getCultureInfo
}

export default {
  CultureInfos,
  getCultureInfo
}