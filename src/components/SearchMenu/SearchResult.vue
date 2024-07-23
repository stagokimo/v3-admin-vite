<script lang="ts" setup>
import { getCurrentInstance, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue"
import { type RouteRecordName, type RouteRecordRaw } from "vue-router"

interface Props {
  list: RouteRecordRaw[]
  isPressUpOrDown: boolean
}

/** 選中的菜單 */
const modelValue = defineModel<RouteRecordName | undefined>({ required: true })
const props = defineProps<Props>()

const instance = getCurrentInstance()
const scrollbarHeight = ref<number>(0)

/** 菜單的樣式 */
const itemStyle = (item: RouteRecordRaw) => {
  const flag = item.name === modelValue.value
  return {
    background: flag ? "var(--el-color-primary)" : "",
    color: flag ? "#ffffff" : ""
  }
}

/** 滑鼠移入 */
const handleMouseenter = (item: RouteRecordRaw) => {
  // 如果上鍵或下鍵與 mouseenter 事件同時生效，則以上下鍵為準，不執行該函式的賦值邏輯
  if (props.isPressUpOrDown) return
  modelValue.value = item.name
}

/** 計算滾動可視區高度 */
const getScrollbarHeight = () => {
  // el-scrollbar max-height="40vh"
  scrollbarHeight.value = Number((window.innerHeight * 0.4).toFixed(1))
}

/** 根據下標計算到頂部的距離 */
const getScrollTop = (index: number) => {
  const currentInstance = instance?.proxy?.$refs[`resultItemRef${index}`] as HTMLDivElement[]
  if (!currentInstance) return 0
  const currentRef = currentInstance[0]
  const scrollTop = currentRef.offsetTop + 128 // 128 = 兩個 result-item （56 + 56 = 112）高度與上下 margin（8 + 8 = 16）大小之和
  return scrollTop > scrollbarHeight.value ? scrollTop - scrollbarHeight.value : 0
}

/** 在元件掛載前新增視窗大小變化事件監聽器 */
onBeforeMount(() => {
  window.addEventListener("resize", getScrollbarHeight)
})

/** 在元件掛載時立即計算滾動可視區高度 */
onMounted(() => {
  getScrollbarHeight()
})

/** 在元件解除安裝前移除視窗大小變化事件監聽器 */
onBeforeUnmount(() => {
  window.removeEventListener("resize", getScrollbarHeight)
})

defineExpose({ getScrollTop })
</script>

<template>
  <!-- 外層 div 不能刪除，是用來接收父元件 click 事件的 -->
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      :ref="`resultItemRef${index}`"
      class="result-item"
      :style="itemStyle(item)"
      @mouseenter="handleMouseenter(item)"
    >
      <SvgIcon v-if="item.meta?.svgIcon" :name="item.meta.svgIcon" />
      <component v-else-if="item.meta?.elIcon" :is="item.meta.elIcon" class="el-icon" />
      <span class="result-item-title">
        {{ item.meta?.title }}
      </span>
      <SvgIcon v-if="modelValue && modelValue === item.name" name="keyboard-enter" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 15px;
  margin-top: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  .svg-icon {
    min-width: 1em;
    font-size: 18px;
  }
  .el-icon {
    width: 1em;
    font-size: 18px;
  }
  &-title {
    flex: 1;
    margin-left: 12px;
  }
}
</style>
