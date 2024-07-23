import dayjs from "dayjs"
import { removeConfigLayout } from "@/utils/cache/local-storage"

/** 格式化時間 */
export const formatDateTime = (time: string | number | Date) => {
  return time ? dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") : "N/A"
}

/** 用 JS 獲取全域性 css 變數 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ""
  try {
    // 沒有拿到值時，會返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 用 JS 設定全域性 CSS 變數 */
export const setCssVariableValue = (cssVariableName: string, cssVariableValue: string) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** 重置專案配置 */
export const resetConfigLayout = () => {
  removeConfigLayout()
  location.reload()
}
