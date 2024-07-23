import { useUserStoreHook } from "@/store/modules/user"

/** 全域性許可權判斷函式，和許可權指令 v-permission 功能類似 */
export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error("need roles! Like checkPermission(['admin','editor'])")
    return false
  }
}
