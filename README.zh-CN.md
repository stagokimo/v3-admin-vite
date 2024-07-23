<div align="center">
  <img alt="V3 Admin Vite Logo" width="120" height="120" src="./src/assets/layouts/logo.png">
  <h1>V3 Admin Vite</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

## ⚡ 簡介

V3 Admin Vite 是一個免費開源的中後臺管理系統基礎解決方案，基於 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技術

- Vue Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

國內倉庫：[Gitee](https://gitee.com/un-pany/v3-admin-vite)

## 📚 文件

- 中文文件：[鏈接](https://juejin.cn/post/7089377403717287972)
- 手摸手教程：[鏈接](https://juejin.cn/column/7207659644487139387)

## 📺 線上預覽

| 位置         | 賬號            | 鏈接                                            |
| ------------ | --------------- | ----------------------------------------------- |
| github-pages | admin 或 editor | [鏈接](https://un-pany.github.io/v3-admin-vite) |

## ❤️ 用愛發電

- **完全免費**：但希望你點一個 star ！！！
- **非常簡潔**：沒有複雜的封裝，沒有複雜的型別體操，開箱即用
- **詳細的註釋**：各個配置項都寫有儘可能詳細的註釋
- **最新的依賴**: 定期更新所有三方依賴至最新版
- **有一點規整**: 程式碼風格統一，命名風格統一，註釋風格統一

## 特性

- **Vue3**：採用 Vue3 + script setup 最新的 Vue3 組合式 API
- **Element Plus**：Element UI 的 Vue3 版本
- **Pinia**: 傳說中的 Vuex5
- **Vite**：真的很快
- **Vue Router**：路由路由
- **TypeScript**：JavaScript 語言的超集
- **PNPM**：更快速的，節省磁碟空間的包管理工具
- **Scss**：和 Element Plus 保持一致
- **CSS 變數**：主要控制專案的佈局和顏色
- **ESlint**：程式碼校驗
- **Prettier**：程式碼格式化
- **Axios**：發送網路請求（已封裝好）
- **UnoCSS**：具有高效能且極具靈活性的即時原子化 CSS 引擎
- **相容移動端**: 佈局相容移動端頁面解析度

## 功能

- **使用者管理**：登錄、登出演示
- **許可權管理**：頁面級許可權（動態路由）、按鈕級許可權（指令許可權、許可權函式）、路由守衛
- **多環境**：開發環境（development）、預發佈環境（staging）、正式環境（production）
- **多主題**：普通、黑暗、深藍, 三種主題模式
- **多佈局**：左側、頂部、混合, 三種佈局模式
- **錯誤頁面**: 403、404
- **Dashboard**：根據不同使用者顯示不同的 Dashboard 頁面
- **其他內建功能**：SVG、動態側邊欄、動態麵包屑、標籤頁快捷導航、Screenfull 全屏、自適應收縮側邊欄、Hook（Composables）

## 🚀 開發

```bash
# 配置
1. 一鍵安裝 .vscode 目錄中推薦的外掛
2. node 版本 18.x 或 20+
3. pnpm 版本 8.x 或最新版

# 克隆專案
git clone https://github.com/un-pany/v3-admin-vite.git

# 進入專案目錄
cd v3-admin-vite

# 安裝依賴
pnpm i

# 啟動服務
pnpm dev
```

## ✔️ 預覽

```bash
# 預覽預發佈環境
pnpm preview:stage

# 預覽正式環境
pnpm preview:prod
```

## 📦️ 多環境打包

```bash
# 構建預發佈環境
pnpm build:stage

# 構建正式環境
pnpm build:prod
```

## 🔧 程式碼檢查

```bash
# 程式碼格式化
pnpm lint

# 單元測試
pnpm test
```

## Git 提交規範參考

- `feat` 增加新的業務功能
- `fix` 修復業務問題/BUG
- `perf` 優化效能
- `style` 更改程式碼風格, 不影響執行結果
- `refactor` 重構程式碼
- `revert` 撤銷更改
- `test` 測試相關, 不涉及業務程式碼的更改
- `docs` 文件和註釋相關
- `chore` 更新依賴/修改腳手架配置等瑣事
- `workflow` 工作流改進
- `ci` 持續整合相關
- `types` 型別定義檔案更改
- `wip` 開發中

## 專案預覽圖

![preview1.png](./src/assets/docs/preview1.png)
![preview2.png](./src/assets/docs/preview2.png)
![preview3.png](./src/assets/docs/preview3.png)

## 💕 貢獻者

感謝所有的貢獻者！

<a href="https://github.com/un-pany/v3-admin-vite/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=un-pany/v3-admin-vite" />
</a>

## 💕 感謝 Star

小專案獲取 star 不易，如果你喜歡這個專案的話，歡迎支援一個 star！這是作者持續維護的唯一動力（小聲：畢竟是免費的）

## ☕ Donate

[檢視捐贈方式](https://github.com/un-pany/v3-admin-vite/issues/69)

## 可有可無的群

[檢視進群方式](https://github.com/un-pany/v3-admin-vite/issues/191)

## 📄 License

[MIT](./LICENSE)

Copyright (c) 2022-present [pany](https://github.com/pany-ang)
