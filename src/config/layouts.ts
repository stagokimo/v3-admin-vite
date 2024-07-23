import { getConfigLayout } from "@/utils/cache/local-storage"
import { LayoutModeEnum } from "@/constants/app-key"

/** 專案配置型別 */
export interface LayoutSettings {
  /** 是否顯示 Settings Panel */
  showSettings: boolean
  /** 佈局模式 */
  layoutMode: LayoutModeEnum
  /** 是否顯示標籤欄 */
  showTagsView: boolean
  /** 是否顯示 Logo */
  showLogo: boolean
  /** 是否固定 Header */
  fixedHeader: boolean
  /** 是否顯示頁尾 Footer */
  showFooter: boolean
  /** 是否顯示訊息通知 */
  showNotify: boolean
  /** 是否顯示切換主題按鈕 */
  showThemeSwitch: boolean
  /** 是否顯示全屏按鈕 */
  showScreenfull: boolean
  /** 是否顯示搜索按鈕 */
  showSearchMenu: boolean
  /** 是否快取標籤欄 */
  cacheTagsView: boolean
  /** 開啟系統水印 */
  showWatermark: boolean
  /** 是否顯示灰色模式 */
  showGreyMode: boolean
  /** 是否顯示色弱模式 */
  showColorWeakness: boolean
}

/** 預設配置 */
const defaultSettings: LayoutSettings = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: true,
  showGreyMode: false,
  showColorWeakness: false
}

/** 專案配置 */
export const layoutSettings: LayoutSettings = { ...defaultSettings, ...getConfigLayout() }
