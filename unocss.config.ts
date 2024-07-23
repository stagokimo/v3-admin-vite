import { defineConfig, presetAttributify, presetUno } from "unocss"

export default defineConfig({
  /** 預設 */
  presets: [
    /** 屬性化模式 & 無值的屬性模式 */
    presetAttributify(),
    /** 預設預設 */
    presetUno()
  ],
  /** 自定義規則 */
  rules: [["uno-padding-20", { padding: "20px" }]],
  /** 自定義快捷方式 */
  shortcuts: {
    "uno-wh-full": "w-full h-full",
    "uno-flex-center": "flex justify-center items-center",
    "uno-flex-x-center": "flex justify-center",
    "uno-flex-y-center": "flex items-center"
  }
})
