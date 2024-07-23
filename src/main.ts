// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"

const app = createApp(App)

/** 載入外掛 */
loadPlugins(app)
/** 載入全域性 SVG */
loadSvg(app)
/** 載入自定義指令 */
loadDirectives(app)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
