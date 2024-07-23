/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from "vite"
import path, { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import svgLoader from "vite-svg-loader"
import UnoCSS from "unocss/vite"

/** 配置項文件：https://cn.vitejs.dev/config */
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv
  const { VITE_PUBLIC_PATH } = viteEnv
  return {
    /** 打包時根據實際情況修改 base */
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        /** @ 符號指向 src 目錄 */
        "@": resolve(__dirname, "./src")
      }
    },
    server: {
      /** 設定 host: true 才可以使用 Network 的形式，以 IP 訪問專案 */
      host: true, // host: "0.0.0.0"
      /** 埠號 */
      port: 3333,
      /** 是否自動打開瀏覽器 */
      open: false,
      /** 跨域設定允許 */
      cors: true,
      /** 埠被佔用時，是否直接退出 */
      strictPort: false,
      /** 介面代理 */
      proxy: {
        "/api/v1": {
          target: "https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212",
          ws: true,
          /** 是否允許跨域 */
          changeOrigin: true
        }
      },
      /** 預熱常用檔案，提高初始頁面載入速度 */
      warmup: {
        clientFiles: ["./src/layouts/**/*.vue"]
      }
    },
    build: {
      /** 單個 chunk 檔案的大小超過 2048KB 時發出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 壓縮大小報告 */
      reportCompressedSize: false,
      /** 打包后靜態資源目錄 */
      assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * 分塊策略
           * 1. 注意這些包名必須存在，否則打包會報錯
           * 2. 如果你不想自定義 chunk 分割策略，可以直接移除這段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"],
            vxe: ["vxe-table", "vxe-table-plugin-element", "xe-utils"]
          }
        }
      }
    },
    /** 混淆器 */
    esbuild:
      mode === "development"
        ? undefined
        : {
            /** 打包時移除 console.log */
            pure: ["console.log"],
            /** 打包時移除 debugger */
            drop: ["debugger"],
            /** 打包時移除所有註釋 */
            legalComments: "none"
          },
    /** Vite 外掛 */
    plugins: [
      vue(),
      vueJsx(),
      /** 將 SVG 靜態圖轉化為 Vue 元件 */
      svgLoader({ defaultImport: "url" }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      }),
      /** UnoCSS */
      UnoCSS()
    ],
    /** Vitest 單元測試配置：https://cn.vitest.dev/config */
    test: {
      include: ["tests/**/*.test.ts"],
      environment: "jsdom"
    }
  }
}
