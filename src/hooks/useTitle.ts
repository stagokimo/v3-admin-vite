import { ref, watch } from "vue"

/** 專案標題 */
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE ?? "V3 Admin Vite"

/** 動態標題 */
const dynamicTitle = ref<string>("")

/** 設定標題 */
const setTitle = (title?: string) => {
  dynamicTitle.value = title ? `${VITE_APP_TITLE} | ${title}` : VITE_APP_TITLE
}

/** 監聽標題變化 */
watch(dynamicTitle, (value, oldValue) => {
  if (document && value !== oldValue) {
    document.title = value
  }
})

export function useTitle() {
  return { setTitle }
}
