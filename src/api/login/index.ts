import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 獲取登錄驗證碼 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登錄並返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}

/** 獲取使用者詳情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}
