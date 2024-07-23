<script lang="ts" setup>
import { ref } from "vue"
import { useWatermark } from "@/hooks/useWatermark"

const localRef = ref<HTMLElement | null>(null)
const { setWatermark, clearWatermark } = useWatermark(localRef)
const { setWatermark: setGlobalWatermark, clearWatermark: clearGlobalWatermark } = useWatermark()
</script>

<template>
  <div class="app-container">
    <h4>
      該示例是演示：通過呼叫 hook，開啟或關閉水印，
      支援區域性、全域性、自定義樣式（顏色、透明度、字型大小、字型、傾斜角度等），並自帶防禦（防刪、防隱藏）和自適應功能
    </h4>
    <div ref="localRef" class="local" />
    <el-button-group>
      <el-button type="primary" @click="setWatermark('區域性水印', { color: '#409eff' })">建立區域性水印</el-button>
      <el-button type="warning" @click="setWatermark('沒有防禦功能的區域性水印', { color: '#e6a23c', defense: false })">
        關閉防禦功能
      </el-button>
      <el-button type="danger" @click="clearWatermark">清除區域性水印</el-button>
    </el-button-group>
    <el-button-group>
      <el-button type="primary" @click="setGlobalWatermark('全域性水印', { color: '#409eff' })">建立全域性水印</el-button>
      <el-button
        type="warning"
        @click="setGlobalWatermark('沒有防禦功能的全域性水印', { color: '#e6a23c', defense: false })"
      >
        關閉防禦功能
      </el-button>
      <el-button type="danger" @click="clearGlobalWatermark">清除全域性水印</el-button>
    </el-button-group>
  </div>
</template>

<style lang="scss" scoped>
.local {
  height: 30vh;
  border: 2px dashed var(--el-color-primary);
  margin-bottom: 20px;
}

.el-button-group {
  margin-right: 12px;
}
</style>
