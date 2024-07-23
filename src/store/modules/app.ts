import { reactive, ref, watch } from "vue"
import { defineStore } from "pinia"
import { getSidebarStatus, setSidebarStatus } from "@/utils/cache/local-storage"
import { DeviceEnum, SIDEBAR_OPENED, SIDEBAR_CLOSED } from "@/constants/app-key"

interface Sidebar {
  opened: boolean
  withoutAnimation: boolean
}

/** 設定側邊欄狀態本地快取 */
function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED)
}

export const useAppStore = defineStore("app", () => {
  /** 側邊欄狀態 */
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  })
  /** 裝置型別 */
  const device = ref<DeviceEnum>(DeviceEnum.Desktop)

  /** 監聽側邊欄 opened 狀態 */
  watch(
    () => sidebar.opened,
    (opened) => handleSidebarStatus(opened)
  )

  /** 切換側邊欄 */
  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 關閉側邊欄 */
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 切換裝置型別 */
  const toggleDevice = (value: DeviceEnum) => {
    device.value = value
  }

  return { device, sidebar, toggleSidebar, closeSidebar, toggleDevice }
})
