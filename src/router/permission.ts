import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // 如果沒有登陸
  if (!token) {
    // 如果在免登錄的白名單中，則直接進入
    if (isWhiteList(to)) return next()
    // 其他沒有訪問許可權的頁面將被重定向到登錄頁面
    return next("/login")
  }

  // 如果已經登錄，並準備進入 Login 頁面，則重定向到主頁
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 如果使用者已經獲得其許可權角色
  if (userStore.roles.length !== 0) return next()

  // 否則要重新獲取許可權角色
  try {
    await userStore.getInfo()
    // 注意：角色必須是一個陣列！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 產生可訪問的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 將 "有訪問許可權的動態路由" 新增到 Router 中
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 確保新增路由已完成
    // 設定 replace: true, 因此導航將不會留下歷史記錄
    next({ ...to, replace: true })
  } catch (err: any) {
    // 過程中發生任何錯誤，都直接重置 Token，並重定向到登錄頁面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守衛過程發生錯誤")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
