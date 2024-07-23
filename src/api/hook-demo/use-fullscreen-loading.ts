/** 模擬介面響應數據 */
const SUCCESS_RESPONSE_DATA = {
  code: 0,
  data: {
    list: [] as number[]
  },
  message: "獲取成功"
}

/** 模擬請求介面成功 */
export function getSuccessApi(list: number[]) {
  return new Promise<typeof SUCCESS_RESPONSE_DATA>((resolve) => {
    setTimeout(() => {
      resolve({ ...SUCCESS_RESPONSE_DATA, data: { list } })
    }, 1000)
  })
}

/** 模擬請求介面失敗 */
export function getErrorApi() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error("發生錯誤"))
    }, 1000)
  })
}
