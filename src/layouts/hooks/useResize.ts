import { onBeforeMount, onMounted, onBeforeUnmount } from "vue"
import { useAppStore } from "@/store/modules/app"
import { useRouteListener } from "@/hooks/useRouteListener"
import { DeviceEnum } from "@/constants/app-key"

/** 參考 Bootstrap 的響應式設計將最大移動端寬度設定為 992 */
const MAX_MOBILE_WIDTH = 992

/** 根據瀏覽器寬度變化，變換 Layout 佈局 */
export default () => {
  const appStore = useAppStore()
  const { listenerRouteChange } = useRouteListener()

  /** 用於判斷目前裝置是否為移動端 */
  const _isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < MAX_MOBILE_WIDTH
  }

  /** 用於處理視窗大小變化事件 */
  const _resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = _isMobile()
      appStore.toggleDevice(isMobile ? DeviceEnum.Mobile : DeviceEnum.Desktop)
      isMobile && appStore.closeSidebar(true)
    }
  }
  /** 監聽路由變化，根據裝置型別調整佈局 */
  listenerRouteChange(() => {
    if (appStore.device === DeviceEnum.Mobile && appStore.sidebar.opened) {
      appStore.closeSidebar(false)
    }
  })

  /** 在元件掛載前新增視窗大小變化事件監聽器 */
  onBeforeMount(() => {
    window.addEventListener("resize", _resizeHandler)
  })

  /** 在元件掛載后根據視窗大小判斷裝置型別並調整佈局 */
  onMounted(() => {
    if (_isMobile()) {
      appStore.toggleDevice(DeviceEnum.Mobile)
      appStore.closeSidebar(true)
    }
  })

  /** 在元件解除安裝前移除視窗大小變化事件監聽器 */
  onBeforeUnmount(() => {
    window.removeEventListener("resize", _resizeHandler)
  })
}
