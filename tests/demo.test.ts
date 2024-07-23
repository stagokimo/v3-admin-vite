import { describe, expect, it } from "vitest"

/**
 * @description 該檔案所有示例均是爲了向你演示 Vitest 最基本的用法
 * @link https://cn.vitest.dev/api
 * @api describe: 形成一個作用域
 * @api test/it: 定義了一組關於測試期望的方法，它接收測試名稱和一個含有測試期望的函式
 * @api expect: 用來建立斷言
 * @api toBe: 可以用於斷言原始型別是否相等，或者對象是否共享相同的引用
 * @api toEqual: 斷言實際值是否等於接收到的值或具有相同的結構（如果是對象，則遞迴比較它們）
 */

const author1 = {
  name: "pany",
  email: "939630029@qq.com",
  url: "https://github.com/pany-ang"
}

const author2 = {
  name: "pany",
  email: "939630029@qq.com",
  url: "https://github.com/pany-ang"
}

describe("這裡填寫作用域名稱", () => {
  it("測試基礎數據型別", () => {
    expect(1 + 1).toBe(2)
  })
  it("測試引用型別", () => {
    expect(author1).toEqual(author2)
  })
})
