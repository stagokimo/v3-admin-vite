<script lang="ts" setup>
import { computed, ref, watchEffect } from "vue"
import { ElMessage } from "element-plus"
import screenfull from "screenfull"

interface Props {
  /** 全屏的元素，預設是 html */
  element?: string
  /** 打開全屏提示語 */
  openTips?: string
  /** 關閉全屏提示語 */
  exitTips?: string
  /** 是否只針對內容區 */
  content?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  element: "html",
  openTips: "全屏",
  exitTips: "退出全屏",
  content: false
})

//#region 全屏
const isFullscreen = ref<boolean>(false)
const fullscreenTips = computed(() => {
  return isFullscreen.value ? props.exitTips : props.openTips
})
const fullscreenSvgName = computed(() => {
  return isFullscreen.value ? "fullscreen-exit" : "fullscreen"
})
const handleFullscreenClick = () => {
  const dom = document.querySelector(props.element) || undefined
  screenfull.isEnabled ? screenfull.toggle(dom) : ElMessage.warning("您的瀏覽器無法工作")
}
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
  // 退出全屏時清除所有的 class
  isFullscreen.value || (document.body.className = "")
}
watchEffect((onCleanup) => {
  // 掛載元件時自動執行
  screenfull.isEnabled && screenfull.on("change", handleFullscreenChange)
  // 解除安裝元件時自動執行
  onCleanup(() => {
    screenfull.isEnabled && screenfull.off("change", handleFullscreenChange)
  })
})
//#endregion

//#region 內容區
const isContentLarge = ref<boolean>(false)
const contentLargeTips = computed(() => {
  return isContentLarge.value ? "內容區復原" : "內容區放大"
})
const contentLargeSvgName = computed(() => {
  return isContentLarge.value ? "fullscreen-exit" : "fullscreen"
})
const handleContentLargeClick = () => {
  isContentLarge.value = !isContentLarge.value
  // 內容區放大時，將不需要的元件隱藏
  document.body.className = isContentLarge.value ? "content-large" : ""
}
const handleContentFullClick = () => {
  // 取消內容區放大
  isContentLarge.value && handleContentLargeClick()
  // 內容區全屏時，將不需要的元件隱藏
  document.body.className = "content-full"
  // 開啟全屏
  handleFullscreenClick()
}
//#endregion
</script>

<template>
  <div>
    <!-- 全屏 -->
    <el-tooltip v-if="!content" effect="dark" :content="fullscreenTips" placement="bottom">
      <SvgIcon :name="fullscreenSvgName" @click="handleFullscreenClick" />
    </el-tooltip>
    <!-- 內容區 -->
    <el-dropdown v-else :disabled="isFullscreen">
      <SvgIcon :name="contentLargeSvgName" />
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 內容區放大 -->
          <el-dropdown-item @click="handleContentLargeClick">{{ contentLargeTips }}</el-dropdown-item>
          <!-- 內容區全屏 -->
          <el-dropdown-item @click="handleContentFullClick">內容區全屏</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
