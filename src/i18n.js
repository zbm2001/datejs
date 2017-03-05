import en_US from './i18n/en-US'
import zh_CN from './i18n/zh-CN'

const CultureInfos = [en_US, zh_CN]

function getCultureInfo (culture) {
  culture || (culture = typeof navigator === 'object' ? navigator.language || 'en-US' : 'en-US')
  for (let i = 0, l = CultureInfos.length; i < l; i++) {
    if (CultureInfos[i].name === culture) {
      return CultureInfos[i]
    }
  }
  return null
}

export {
	CultureInfos,
	getCultureInfo
}