export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密碼 */
  password: string
  /** 驗證碼 */
  code: string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ token: string }>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
