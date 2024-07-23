<script lang="ts" setup>
import { watchEffect } from "vue"
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/store/modules/settings"
import { useLayoutMode } from "@/hooks/useLayoutMode"
import { resetConfigLayout } from "@/utils"
import SelectLayoutMode from "./SelectLayoutMode.vue"
import { Refresh } from "@element-plus/icons-vue"

const { isLeft } = useLayoutMode()
const settingsStore = useSettingsStore()

/** 使用 storeToRefs 將提取的屬性保持其響應性 */
const {
  showTagsView,
  showLogo,
  fixedHeader,
  showFooter,
  showNotify,
  showThemeSwitch,
  showScreenfull,
  showSearchMenu,
  cacheTagsView,
  showWatermark,
  showGreyMode,
  showColorWeakness
} = storeToRefs(settingsStore)

/** 定義 switch 設定項 */
const switchSettings = {
  顯示標籤欄: showTagsView,
  "顯示 Logo": showLogo,
  "固定 Header": fixedHeader,
  "顯示頁尾 Footer": showFooter,
  顯示訊息通知: showNotify,
  顯示切換主題按鈕: showThemeSwitch,
  顯示全屏按鈕: showScreenfull,
  顯示搜索按鈕: showSearchMenu,
  是否快取標籤欄: cacheTagsView,
  開啟系統水印: showWatermark,
  顯示灰色模式: showGreyMode,
  顯示色弱模式: showColorWeakness
}

/** 非左側模式時，Header 都是 fixed 佈局 */
watchEffect(() => {
  !isLeft.value && (fixedHeader.value = true)
})
</script>

<template>
  <div class="setting-container">
    <h4>佈局配置</h4>
    <SelectLayoutMode />
    <el-divider />
    <h4>功能配置</h4>
    <div class="setting-item" v-for="(settingValue, settingName, index) in switchSettings" :key="index">
      <span class="setting-name">{{ settingName }}</span>
      <el-switch v-model="settingValue.value" :disabled="!isLeft && settingName === '固定 Header'" />
    </div>
    <el-button type="danger" :icon="Refresh" @click="resetConfigLayout">重 置</el-button>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.setting-container {
  padding: 20px;
  .setting-item {
    font-size: 14px;
    color: var(--el-text-color-regular);
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-name {
      @extend %ellipsis;
    }
  }
  .el-button {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
