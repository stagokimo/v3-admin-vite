/** 裝置型別 */
export enum DeviceEnum {
  Mobile,
  Desktop
}

/** 佈局模式 */
export enum LayoutModeEnum {
  Left = "left",
  Top = "top",
  LeftTop = "left-top"
}

/** 側邊欄打開狀態常量 */
export const SIDEBAR_OPENED = "opened"
/** 側邊欄關閉狀態常量 */
export const SIDEBAR_CLOSED = "closed"

export type SidebarOpened = typeof SIDEBAR_OPENED
export type SidebarClosed = typeof SIDEBAR_CLOSED
