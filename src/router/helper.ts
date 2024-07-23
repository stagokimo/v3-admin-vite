import {
  type Router,
  type RouteRecordNormalized,
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
import { cloneDeep, omit } from "lodash-es"

/** 路由模式 */
export const history =
  import.meta.env.VITE_ROUTER_HISTORY === "hash"
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH)

/** 路由降級（把三級及其以上的路由轉化為二級路由） */
export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  const routesMirror = cloneDeep(routes)
  routesMirror.forEach((route) => {
    // 如果路由是三級及其以上路由，對其進行降級處理
    isMultipleRoute(route) && promoteRouteLevel(route)
  })
  return routesMirror
}

/** 判斷路由層級是否大於 2 */
const isMultipleRoute = (route: RouteRecordRaw) => {
  const children = route.children
  if (children?.length) {
    // 只要有一個子路由的 children 長度大於 0，就說明是三級及其以上路由
    return children.some((child) => child.children?.length)
  }
  return false
}

/** 產生二級路由 */
const promoteRouteLevel = (route: RouteRecordRaw) => {
  // 建立 router 實例是爲了獲取到目前傳入的 route 的所有路由資訊
  let router: Router | null = createRouter({
    history,
    routes: [route]
  })
  const routes = router.getRoutes()
  // 在 addToChildren 函式中使用上面獲取到的路由資訊來更新 route 的 children
  addToChildren(routes, route.children || [], route)
  router = null
  // 轉為二級路由后，去除所有子路由中的 children
  route.children = route.children?.map((item) => omit(item, "children") as RouteRecordRaw)
}

/** 將給定的子路由新增到指定的路由模組中 */
const addToChildren = (routes: RouteRecordNormalized[], children: RouteRecordRaw[], routeModule: RouteRecordRaw) => {
  children.forEach((child) => {
    const route = routes.find((item) => item.name === child.name)
    if (route) {
      // 初始化 routeModule 的 children
      routeModule.children = routeModule.children || []
      // 如果 routeModule 的 children 屬性中不包含該路由，則將其新增進去
      if (!routeModule.children.includes(route)) {
        routeModule.children.push(route)
      }
      // 如果該子路由還有自己的子路由，則遞迴呼叫此函式將它們也新增進去
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}
