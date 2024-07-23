/** 判斷是否為陣列 */
export const isArray = (arg: unknown) => {
  return Array.isArray ? Array.isArray(arg) : Object.prototype.toString.call(arg) === "[object Array]"
}

/** 判斷是否為字串 */
export const isString = (str: unknown) => {
  return typeof str === "string" || str instanceof String
}

/** 判斷是否為外鏈 */
export const isExternal = (path: string) => {
  const reg = /^(https?:|mailto:|tel:)/
  return reg.test(path)
}

/** 判斷是否為網址（帶協議） */
export const isUrl = (url: string) => {
  const reg = /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/
  return reg.test(url)
}

/** 判斷是否為網址或 IP（帶埠） */
export const isUrlPort = (url: string) => {
  const reg = /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/
  return reg.test(url)
}

/** 判斷是否為域名（不帶協議） */
export const isDomain = (domain: string) => {
  const reg = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/
  return reg.test(domain)
}

/** 判斷版本號格式是否為 X.Y.Z */
export const isVersion = (version: string) => {
  const reg = /^\d+(?:\.\d+){2}$/
  return reg.test(version)
}

/** 判斷時間格式是否為 24 小時制（HH:mm:ss） */
export const is24H = (time: string) => {
  const reg = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
  return reg.test(time)
}

/** 判斷是否為手機號（1 開頭） */
export const isPhoneNumber = (str: string) => {
  const reg = /^(?:(?:\+|00)86)?1\d{10}$/
  return reg.test(str)
}

/** 判斷是否為第二代身份證（18 位） */
export const isChineseIdCard = (str: string) => {
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  return reg.test(str)
}

/** 判斷是否為 Email（支援中文郵箱） */
export const isEmail = (email: string) => {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

/** 判斷是否為 MAC 地址 */
export const isMAC = (mac: string) => {
  const reg =
    /^(([a-f0-9][0,2,4,6,8,a,c,e]:([a-f0-9]{2}:){4})|([a-f0-9][0,2,4,6,8,a,c,e]-([a-f0-9]{2}-){4}))[a-f0-9]{2}$/i
  return reg.test(mac)
}

/** 判斷是否為 IPv4 地址 */
export const isIPv4 = (ip: string) => {
  const reg =
    /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/
  return reg.test(ip)
}

/** 判斷是否為車牌（相容新能源車牌） */
export const isLicensePlate = (str: string) => {
  const reg =
    /^[京津滬渝冀豫云遼黑湘皖魯新蘇浙贛鄂桂甘晉蒙陜吉閩貴粵青藏川寧瓊使領][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9掛學警港澳]$/
  return reg.test(str)
}
