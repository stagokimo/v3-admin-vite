import { type LoadingOptions, ElLoading } from "element-plus"

const defaultOptions = {
  lock: true,
  text: "載入中..."
}

interface LoadingInstance {
  close: () => void
}

interface UseFullscreenLoading {
  <T extends (...args: any[]) => ReturnType<T>>(
    fn: T,
    options?: LoadingOptions
  ): (...args: Parameters<T>) => Promise<ReturnType<T>>
}

/**
 * 傳入一個函式 fn，在它執行週期內，加上「全屏」loading
 * @param fn 要執行的函式
 * @param options LoadingOptions
 * @returns 返回一個新的函式，該函式返回一個 Promise
 */
export const useFullscreenLoading: UseFullscreenLoading = (fn, options = {}) => {
  let loadingInstance: LoadingInstance
  return async (...args) => {
    try {
      loadingInstance = ElLoading.service({ ...defaultOptions, ...options })
      return await fn(...args)
    } finally {
      loadingInstance?.close()
    }
  }
}
