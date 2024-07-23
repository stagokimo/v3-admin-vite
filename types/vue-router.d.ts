import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 設定該路由在側邊欄和麵包屑中展示的名字
     */
    title?: string
    /**
     * 設定該路由的圖示，記得將 svg 匯入 @/icons/svg
     */
    svgIcon?: string
    /**
     * 設定該路由的圖示，直接使用 Element Plus 的 Icon（與 svgIcon 同時設定時，svgIcon 將優先生效）
     */
    elIcon?: string
    /**
     * 預設 false，設定 true 的時候該路由不會在側邊欄出現
     */
    hidden?: boolean
    /**
     * 設定能進入該路由的角色，支援多個角色疊加
     */
    roles?: string[]
    /**
     * 預設 true，如果設定為 false，則不會在麵包屑中顯示
     */
    breadcrumb?: boolean
    /**
     * 預設 false，如果設定為 true，它則會固定在 tags-view 中
     */
    affix?: boolean
    /**
     * 當一個路由下面的 children 聲明的路由大於 1 個時，自動會變成巢狀的模式，
     * 只有一個時，會將那個子路由當做根路由顯示在側邊欄，
     * 若想不管路由下面的 children 聲明的個數都顯示你的根路由，
     * 可以設定 alwaysShow: true，這樣就會忽略之前定義的規則，一直顯示根路由
     */
    alwaysShow?: boolean
    /**
     * 示例: activeMenu: "/xxx/xxx"，
     * 當設定了該屬性進入路由時，則會高亮 activeMenu 屬性對應的側邊欄。
     * 該屬性適合使用在有 hidden: true 屬性的路由上
     */
    activeMenu?: string
    /**
     * 是否快取該路由頁面
     * 預設為 false，為 true 時代表需要快取，此時該路由和該頁面都需要設定一致的 Name
     */
    keepAlive?: boolean
  }
}
