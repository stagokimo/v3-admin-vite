import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"

/** 退出登錄並強制重新整理頁面（會重定向到登錄頁） */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

/** 建立請求實例 */
function createService() {
  // 建立一個 axios 實例命名為 service
  const service = axios.create()
  // 請求攔截
  service.interceptors.request.use(
    (config) => config,
    // 發送失敗
    (error) => Promise.reject(error)
  )
  // 響應攔截（可根據具體業務作出相應的調整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 api 返回的數據
      const apiData = response.data
      // 二進制數據則直接返回
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData
      // 這個 code 是和後端約定的業務 code
      const code = apiData.code
      // 如果沒有 code, 代表這不是專案後端開發的 api
      if (code === undefined) {
        ElMessage.error("非本系統的介面")
        return Promise.reject(new Error("非本系統的介面"))
      }
      switch (code) {
        case 0:
          // 本系統採用 code === 0 來表示沒有業務錯誤
          return apiData
        case 401:
          // Token 過期時
          return logout()
        default:
          // 不是正確的 code
          ElMessage.error(apiData.message || "Error")
          return Promise.reject(new Error("Error"))
      }
    },
    (error) => {
      // status 是 HTTP 狀態碼
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "請求錯誤"
          break
        case 401:
          // Token 過期時
          logout()
          break
        case 403:
          error.message = "拒絕訪問"
          break
        case 404:
          error.message = "請求地址出錯"
          break
        case 408:
          error.message = "請求超時"
          break
        case 500:
          error.message = "伺服器內部錯誤"
          break
        case 501:
          error.message = "服務未實現"
          break
        case 502:
          error.message = "閘道器錯誤"
          break
        case 503:
          error.message = "服務不可用"
          break
        case 504:
          error.message = "閘道器超時"
          break
        case 505:
          error.message = "HTTP 版本不受支援"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 建立請求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        // 攜帶 Token
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 將預設配置 defaultConfig 和傳入的自定義配置 config 進行合併成為 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** 用於網路請求的實例 */
const service = createService()
/** 用於網路請求的方法 */
export const request = createRequest(service)
