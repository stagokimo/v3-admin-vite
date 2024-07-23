import { type App } from "vue"
import { permission } from "./permission"

/** 掛載自定義指令 */
export function loadDirectives(app: App) {
  app.directive("permission", permission)
}
