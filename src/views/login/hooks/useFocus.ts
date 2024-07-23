import { ref } from "vue"

export function useFocus() {
  /** 是否有焦點 */
  const isFocus = ref<boolean>(false)

  /** 失去焦點 */
  const handleBlur = () => {
    isFocus.value = false
  }
  /** 獲取焦點 */
  const handleFocus = () => {
    isFocus.value = true
  }

  return { isFocus, handleBlur, handleFocus }
}
