import { type Ref, ref, watch } from "vue"
import { defineStore } from "pinia"
import { type LayoutSettings, layoutSettings } from "@/config/layouts"
import { setConfigLayout } from "@/utils/cache/local-storage"

type SettingsStore = {
  // 使用對映型別來遍歷 layoutSettings 對象的鍵
  [Key in keyof LayoutSettings]: Ref<LayoutSettings[Key]>
}

type SettingsStoreKey = keyof SettingsStore

export const useSettingsStore = defineStore("settings", () => {
  /** 狀態對像 */
  const state = {} as SettingsStore
  // 遍歷 layoutSettings 對象的鍵值對
  for (const [key, value] of Object.entries(layoutSettings)) {
    // 使用型別斷言來指定 key 的型別，將 value 包裝在 ref 函式中，建立一個響應式變數
    const refValue = ref(value)
    // @ts-ignore
    state[key as SettingsStoreKey] = refValue
    // 監聽每個響應式變數
    watch(refValue, () => {
      // 快取
      const settings = _getCacheData()
      setConfigLayout(settings)
    })
  }
  /** 獲取要快取的數據：將 state 對像轉化為 settings 對像 */
  const _getCacheData = () => {
    const settings = {} as LayoutSettings
    for (const [key, value] of Object.entries(state)) {
      // @ts-ignore
      settings[key as SettingsStoreKey] = value.value
    }
    return settings
  }

  return state
})
