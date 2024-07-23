/**
 * 修改配置後重啟編輯器
 * 配置項文件：https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

export default {
  /** 每一行的寬度 */
  printWidth: 120,
  /** 在對像中的括號之間是否用空格來間隔 */
  bracketSpacing: true,
  /** 箭頭函式的參數無論有幾個，都要括號包裹 */
  arrowParens: "always",
  /** 換行符的使用 */
  endOfLine: "auto",
  /** 是否採用單引號 */
  singleQuote: false,
  /** 對像或者陣列的最後一個元素後面不要加逗號 */
  trailingComma: "none",
  /** 是否加分號 */
  semi: false
}
