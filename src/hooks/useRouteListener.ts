import { onBeforeUnmount } from "vue"
import mitt, { type Handler } from "mitt"
import { type RouteLocationNormalized } from "vue-router"

/** 回撥函式的型別 */
type Callback = (route: RouteLocationNormalized) => void

const emitter = mitt()
const key = Symbol("ROUTE_CHANGE")
let latestRoute: RouteLocationNormalized

/** 設定最新的路由資訊，觸發路由變化事件 */
export const setRouteChange = (to: RouteLocationNormalized) => {
  // 觸發事件
  emitter.emit(key, to)
  // 快取最新的路由資訊
  latestRoute = to
}

/** 單獨監聽路由會浪費渲染效能，使用發佈訂閱模式去進行分發管理 */
export function useRouteListener() {
  /** 回撥函式集合 */
  const callbackList: Callback[] = []

  /** 監聽路由變化（可以選擇立即執行） */
  const listenerRouteChange = (callback: Callback, immediate = false) => {
    // 快取回撥函式
    callbackList.push(callback)
    // 監聽事件
    emitter.on(key, callback as Handler)
    // 可以選擇立即執行一次回撥函式
    immediate && latestRoute && callback(latestRoute)
  }

  /** 移除路由變化事件監聽器 */
  const removeRouteListener = (callback: Callback) => {
    emitter.off(key, callback as Handler)
  }

  /** 元件銷燬前移除監聽器 */
  onBeforeUnmount(() => {
    for (let i = 0; i < callbackList.length; i++) {
      removeRouteListener(callbackList[i])
    }
  })

  return { listenerRouteChange, removeRouteListener }
}
