/** 模擬介面響應數據 */
const SELECT_RESPONSE_DATA = {
  code: 0,
  data: [
    {
      label: "蘋果",
      value: 1
    },
    {
      label: "香蕉",
      value: 2
    },
    {
      label: "橘子",
      value: 3,
      disabled: true
    }
  ],
  message: "獲取 Select 數據成功"
}

/** 模擬介面 */
export function getSelectDataApi() {
  return new Promise<typeof SELECT_RESPONSE_DATA>((resolve, reject) => {
    // 模擬介面響應時間 2s
    setTimeout(() => {
      // 模擬介面呼叫成功
      if (Math.random() < 0.8) {
        resolve(SELECT_RESPONSE_DATA)
      } else {
        // 模擬介面呼叫出錯
        reject(new Error("介面發生錯誤"))
      }
    }, 2000)
  })
}
