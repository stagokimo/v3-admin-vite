<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
// 將 Element Plus 的語言設定為中文
import zhTw from "element-plus/es/locale/lang/zh-tw"

const { initTheme } = useTheme()

/** 初始化主題 */
initTheme()

/** 作者小心思 */
ElNotification({
  title: "Hello",
  type: "success",
  dangerouslyUseHTMLString: true,
  message:
    "<a style='color: teal' target='_blank' href='https://github.com/un-pany/v3-admin-vite'>小專案獲取 star 不易，如果你喜歡這個專案的話，歡迎點選這裡支援一個 star ！這是作者持續維護的唯一動力（小聲：畢竟是免費的）</a>",
  duration: 0,
  position: "bottom-right"
})
</script>

<template>
  <el-config-provider :locale="zhTw">
    <router-view />
  </el-config-provider>
</template>
