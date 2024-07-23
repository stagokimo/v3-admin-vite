/** 所有 api 介面的響應數據都應該準守該格式 */
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}
