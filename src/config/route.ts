/** 路由配置 */
interface RouteSettings {
  /**
   * 是否開啟動態路由功能？
   * 1. 開啟后需要後端配合，在查詢使用者詳情介面返回目前使用者可以用來判斷並載入動態路由的欄位（該專案用的是角色 roles 欄位）
   * 2. 假如專案不需要根據不同的使用者來顯示不同的頁面，則應該將 dynamic: false
   */
  dynamic: boolean
  /** 當動態路由功能關閉時：
   * 1. 應該將所有路由都寫到常駐路由裡面（表明所有登錄的使用者能訪問的頁面都是一樣的）
   * 2. 系統自動給目前登錄使用者賦值一個沒有任何作用的預設角色
   */
  defaultRoles: Array<string>
  /**
   * 是否開啟三級及其以上路由快取功能？
   * 1. 開啟後會進行路由降級（把三級及其以上的路由轉化為二級路由）
   * 2. 由於都會轉成二級路由，所以二級及其以上路由有內嵌子路由將會失效
   */
  thirdLevelRouteCache: boolean
}

const routeSettings: RouteSettings = {
  dynamic: true,
  defaultRoles: ["DEFAULT_ROLE"],
  thirdLevelRouteCache: false
}

export default routeSettings
