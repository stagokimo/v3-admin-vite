<script lang="ts" setup>
import { useFullscreenLoading } from "@/hooks/useFullscreenLoading"
import { getSuccessApi, getErrorApi } from "@/api/hook-demo/use-fullscreen-loading"
import { ElMessage } from "element-plus"

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

const options = {
  text: "即將發生錯誤...",
  background: "#F56C6C20",
  svg,
  svgViewBox: "-10, -10, 50, 50"
}

const querySuccess = async () => {
  // 注意：
  // 1. getSuccessApi 是一個函式而非函式呼叫
  // 2. 如需給 getSuccessApi 函式傳遞參數，請在後面的括號中進行（真正的 getSuccessApi 呼叫）
  const res = await useFullscreenLoading(getSuccessApi)([2, 3, 3])
  ElMessage.success(`${res.message}，傳參為 ${res.data.list.toString()}`)
}

const queryError = async () => {
  try {
    await useFullscreenLoading(getErrorApi, options)()
  } catch (err: any) {
    ElMessage.error(err.message)
  }
}
</script>

<template>
  <div class="app-container">
    <h4>該示例是演示：通過將要執行的函式傳遞給 hook，讓 hook 自動開啟全屏 loading，函式執行結束后自動關閉 loading</h4>
    <el-button type="primary" @click="querySuccess">查詢成功</el-button>
    <el-button type="danger" @click="queryError">查詢失敗</el-button>
  </div>
</template>
