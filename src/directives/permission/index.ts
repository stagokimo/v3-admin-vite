import { type Directive } from "vue"
import { useUserStoreHook } from "@/store/modules/user"

/** 許可權指令，和許可權判斷函式 checkPermission 功能類似 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding
    const { roles } = useUserStoreHook()
    if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = roles.some((role) => permissionRoles.includes(role))
      // hasPermission || (el.style.display = "none") // 隱藏
      hasPermission || el.parentNode?.removeChild(el) // 銷燬
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
