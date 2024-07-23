<script lang="ts" setup>
import { ref, nextTick } from "vue"
import { RouterLink, useRoute } from "vue-router"
import { useSettingsStore } from "@/store/modules/settings"
import { useRouteListener } from "@/hooks/useRouteListener"
import Screenfull from "@/components/Screenfull/index.vue"
import { ElScrollbar } from "element-plus"
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue"

interface Props {
  tagRefs: InstanceType<typeof RouterLink>[]
}

const props = defineProps<Props>()

const route = useRoute()
const settingsStore = useSettingsStore()
const { listenerRouteChange } = useRouteListener()

/** 滾動條元件元素的引用 */
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
/** 滾動條內容元素的引用 */
const scrollbarContentRef = ref<HTMLDivElement>()

/** 目前滾動條距離左邊的距離 */
let currentScrollLeft = 0
/** 每次滾動距離 */
const translateDistance = 200

/** 滾動時觸發 */
const scroll = ({ scrollLeft }: { scrollLeft: number }) => {
  currentScrollLeft = scrollLeft
}

/** 滑鼠滾輪滾動時觸發 */
const wheelScroll = ({ deltaY }: WheelEvent) => {
  if (/^-/.test(deltaY.toString())) {
    scrollTo("left")
  } else {
    scrollTo("right")
  }
}

/** 獲取可能需要的寬度 */
const getWidth = () => {
  /** 可滾動內容的長度 */
  const scrollbarContentRefWidth = scrollbarContentRef.value!.clientWidth
  /** 滾動可視區寬度 */
  const scrollbarRefWidth = scrollbarRef.value!.wrapRef!.clientWidth
  /** 最後剩餘可滾動的寬度 */
  const lastDistance = scrollbarContentRefWidth - scrollbarRefWidth - currentScrollLeft

  return { scrollbarContentRefWidth, scrollbarRefWidth, lastDistance }
}

/** 左右滾動 */
const scrollTo = (direction: "left" | "right", distance: number = translateDistance) => {
  let scrollLeft = 0
  const { scrollbarContentRefWidth, scrollbarRefWidth, lastDistance } = getWidth()
  // 沒有橫向滾動條，直接結束
  if (scrollbarRefWidth > scrollbarContentRefWidth) return
  if (direction === "left") {
    scrollLeft = Math.max(0, currentScrollLeft - distance)
  } else {
    scrollLeft = Math.min(currentScrollLeft + distance, currentScrollLeft + lastDistance)
  }
  scrollbarRef.value!.setScrollLeft(scrollLeft)
}

/** 移動到目標位置 */
const moveTo = () => {
  const tagRefs = props.tagRefs
  for (let i = 0; i < tagRefs.length; i++) {
    // @ts-ignore
    if (route.path === tagRefs[i].$props.to.path) {
      // @ts-ignore
      const el: HTMLElement = tagRefs[i].$el
      const offsetWidth = el.offsetWidth
      const offsetLeft = el.offsetLeft
      const { scrollbarRefWidth } = getWidth()
      // 目前 tag 在可視區域左邊時
      if (offsetLeft < currentScrollLeft) {
        const distance = currentScrollLeft - offsetLeft
        scrollTo("left", distance)
        return
      }
      // 目前 tag 在可視區域右邊時
      const width = scrollbarRefWidth + currentScrollLeft - offsetWidth
      if (offsetLeft > width) {
        const distance = offsetLeft - width
        scrollTo("right", distance)
        return
      }
    }
  }
}

/** 監聽路由變化，移動到目標位置 */
listenerRouteChange(() => {
  nextTick(moveTo)
})
</script>

<template>
  <div class="scroll-container">
    <el-icon class="arrow left" @click="scrollTo('left')">
      <ArrowLeft />
    </el-icon>
    <el-scrollbar ref="scrollbarRef" @wheel.passive="wheelScroll" @scroll="scroll">
      <div ref="scrollbarContentRef" class="scrollbar-content">
        <slot />
      </div>
    </el-scrollbar>
    <el-icon class="arrow right" @click="scrollTo('right')">
      <ArrowRight />
    </el-icon>
    <Screenfull v-if="settingsStore.showScreenfull" :content="true" class="screenfull" />
  </div>
</template>

<style lang="scss" scoped>
.scroll-container {
  height: 100%;
  user-select: none;
  display: flex;
  justify-content: space-between;
  .arrow {
    width: 40px;
    height: 100%;
    font-size: 18px;
    cursor: pointer;
    &.left {
      box-shadow: 5px 0 5px -6px var(--el-border-color-darker);
    }
    &.right {
      box-shadow: -5px 0 5px -6px var(--el-border-color-darker);
    }
  }
  .el-scrollbar {
    flex: 1;
    // 防止換行（超出寬度時，顯示滾動條）
    white-space: nowrap;
    .scrollbar-content {
      display: inline-block;
    }
  }
  .screenfull {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
