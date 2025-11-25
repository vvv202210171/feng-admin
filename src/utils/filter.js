import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {
  cycleStatus,
  enteustStatusMapping,
  styleMapping,
  typeMapping,
  contractStateMapping,
  profitLossStateMapping,
  tdModeMapping,
  statusMapping,
  merchartStateMapping
} from './const'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) return ''
  return moment.parseZone(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.filter('cycleStateFormat', function (dataStr) {
  const cucleStatus = cycleStatus.find((v) => v.val === dataStr)
  return cucleStatus
    ? cucleStatus.title
    : dataStr === 'win'
    ? '必赢'
    : dataStr === 'lose'
    ? '必输'
    : dataStr === 'normal'
    ? '正常'
    : dataStr
})

Vue.filter('enteustStatusMappingFormat', function (dataStr) {
  const enteustMappingObj = enteustStatusMapping.find((v) => v.val === dataStr)
  return enteustMappingObj ? enteustMappingObj.title : dataStr
})

Vue.filter('styleMappingFormat', function (dataStr) {
  const obj = styleMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('typeMappingFormat', function (dataStr) {
  const obj = typeMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('contractStateMappingFormat', function (dataStr) {
  const obj = contractStateMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('tdModeMappingFormat', function (dataStr) {
  const obj = tdModeMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('profitLossStateMappingFormat', function (dataStr) {
  const obj = profitLossStateMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('statusMappingFormat', function (dataStr) {
  const obj = statusMapping.find((v) => v.val === dataStr)
  return obj ? obj.title : dataStr
})
Vue.filter('merchartStateMappingFormat', function (dataStr) {
  const obj = merchartStateMapping.find((v) => v.val === dataStr)

  const title = obj ? obj.title : dataStr
  return title
})
