// 今日
export function getToday (moment) {
  return moment()
}
// 昨日
export function getYesterday (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 上一周期
export function getLastWeek (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 下一周期
export function getNextWeek (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 本周
export function getWeek (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 本月
export function getMonth (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 近10天
export function get10days (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 近15天
export function get15days (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
// 近30天
export function get30days (moment, str) {
  if (str === undefined) str = 'YYYY-MM-DD HH:mm:ss'
  return moment().format('YYYY-MM-DD')
}
