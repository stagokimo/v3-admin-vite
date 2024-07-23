export interface CreateOrUpdateTableRequestData {
  id?: string
  username: string
  password?: string
}

export interface GetTableRequestData {
  /** 目前頁碼 */
  currentPage: number
  /** 查詢條數 */
  size: number
  /** 查詢參數：使用者名稱 */
  username?: string
  /** 查詢參數：手機號 */
  phone?: string
}

export interface GetTableData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
