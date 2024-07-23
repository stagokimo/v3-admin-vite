import { type RouteLocationNormalized } from "vue-router"

/** 免登錄白名單（匹配路由 path） */
const whiteListByPath: string[] = ["/login"]

/** 免登錄白名單（匹配路由 name） */
const whiteListByName: string[] = []

/** 判斷是否在白名單 */
const isWhiteList = (to: RouteLocationNormalized) => {
  // path 和 name 任意一個匹配上即可
  return whiteListByPath.indexOf(to.path) !== -1 || whiteListByName.indexOf(to.name as any) !== -1
}

export default isWhiteList
