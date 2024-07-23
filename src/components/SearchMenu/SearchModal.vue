<script lang="ts" setup>
import { computed, ref, shallowRef } from "vue"
import { type RouteRecordName, type RouteRecordRaw, useRouter } from "vue-router"
import { usePermissionStore } from "@/store/modules/permission"
import SearchResult from "./SearchResult.vue"
import SearchFooter from "./SearchFooter.vue"
import { ElMessage, ElScrollbar } from "element-plus"
import { cloneDeep, debounce } from "lodash-es"
import { useDevice } from "@/hooks/useDevice"
import { isExternal } from "@/utils/validate"

/** 控制 modal 顯隱 */
const modelValue = defineModel<boolean>({ required: true })

const router = useRouter()
const { isMobile } = useDevice()

const inputRef = ref<HTMLInputElement | null>(null)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const searchResultRef = ref<InstanceType<typeof SearchResult> | null>(null)

const keyword = ref<string>("")
const resultList = shallowRef<RouteRecordRaw[]>([])
const activeRouteName = ref<RouteRecordName | undefined>(undefined)
/** 是否按下了上鍵或下鍵（用於解決和 mouseenter 事件的衝突） */
const isPressUpOrDown = ref<boolean>(false)

/** 控制搜索對話方塊寬度 */
const modalWidth = computed(() => (isMobile.value ? "80vw" : "40vw"))
/** 樹形菜單 */
const menusData = computed(() => cloneDeep(usePermissionStore().routes))

/** 搜索（防抖） */
const handleSearch = debounce(() => {
  const flatMenusData = flatTree(menusData.value)
  resultList.value = flatMenusData.filter((menu) =>
    keyword.value ? menu.meta?.title?.toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase().trim()) : false
  )
  // 預設選中搜索結果的第一項
  const length = resultList.value?.length
  activeRouteName.value = length > 0 ? resultList.value[0].name : undefined
}, 500)

/** 將樹形菜單扁平化為一維陣列，用於菜單搜索 */
const flatTree = (arr: RouteRecordRaw[], result: RouteRecordRaw[] = []) => {
  arr.forEach((item) => {
    result.push(item)
    item.children && flatTree(item.children, result)
  })
  return result
}

/** 關閉搜索對話方塊 */
const handleClose = () => {
  modelValue.value = false
  // 延時處理防止使用者看到重置數據的操作
  setTimeout(() => {
    keyword.value = ""
    resultList.value = []
  }, 200)
}

/** 根據下標位置進行滾動 */
const scrollTo = (index: number) => {
  if (!searchResultRef.value) return
  const scrollTop = searchResultRef.value.getScrollTop(index)
  // 手動控制 el-scrollbar 滾動條滾動，設定滾動條到頂部的距離
  scrollbarRef.value?.setScrollTop(scrollTop)
}

/** 鍵盤上鍵 */
const handleUp = () => {
  isPressUpOrDown.value = true
  const { length } = resultList.value
  if (length === 0) return
  // 獲取該 name 在菜單中第一次出現的位置
  const index = resultList.value.findIndex((item) => item.name === activeRouteName.value)
  // 如果已處在頂部
  if (index === 0) {
    const bottomName = resultList.value[length - 1].name
    // 如果頂部和底部的 bottomName 相同，且長度大於 1，就再跳一個位置（可解決遇到首尾兩個相同 name 導致的上鍵不能生效的問題）
    if (activeRouteName.value === bottomName && length > 1) {
      activeRouteName.value = resultList.value[length - 2].name
      scrollTo(length - 2)
    } else {
      // 跳轉到底部
      activeRouteName.value = bottomName
      scrollTo(length - 1)
    }
  } else {
    activeRouteName.value = resultList.value[index - 1].name
    scrollTo(index - 1)
  }
}

/** 鍵盤下鍵 */
const handleDown = () => {
  isPressUpOrDown.value = true
  const { length } = resultList.value
  if (length === 0) return
  // 獲取該 name 在菜單中最後一次出現的位置（可解決遇到連續兩個相同 name 導致的下鍵不能生效的問題）
  const index = resultList.value.map((item) => item.name).lastIndexOf(activeRouteName.value)
  // 如果已處在底部
  if (index === length - 1) {
    const topName = resultList.value[0].name
    // 如果底部和頂部的 topName 相同，且長度大於 1，就再跳一個位置（可解決遇到首尾兩個相同 name 導致的下鍵不能生效的問題）
    if (activeRouteName.value === topName && length > 1) {
      activeRouteName.value = resultList.value[1].name
      scrollTo(1)
    } else {
      // 跳轉到頂部
      activeRouteName.value = topName
      scrollTo(0)
    }
  } else {
    activeRouteName.value = resultList.value[index + 1].name
    scrollTo(index + 1)
  }
}

/** 鍵盤迴車鍵 */
const handleEnter = () => {
  const { length } = resultList.value
  if (length === 0) return
  const name = activeRouteName.value
  const path = resultList.value.find((item) => item.name === name)?.path
  if (path && isExternal(path)) {
    window.open(path, "_blank", "noopener, noreferrer")
    return
  }
  if (!name) {
    ElMessage.warning("無法通過搜索進入該菜單，請為對應的路由設定唯一的 Name")
    return
  }
  try {
    router.push({ name })
  } catch {
    ElMessage.error("該菜單有必填的動態參數，無法通過搜索進入")
    return
  }
  handleClose()
}

/** 釋放上鍵或下鍵 */
const handleReleaseUpOrDown = () => {
  isPressUpOrDown.value = false
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    @opened="inputRef?.focus()"
    @closed="inputRef?.blur()"
    @keydown.up="handleUp"
    @keydown.down="handleDown"
    @keydown.enter="handleEnter"
    @keyup.up.down="handleReleaseUpOrDown"
    :before-close="handleClose"
    :width="modalWidth"
    top="5vh"
    class="search-modal__private"
    append-to-body
  >
    <el-input ref="inputRef" v-model="keyword" @input="handleSearch" placeholder="搜索菜單" size="large" clearable>
      <template #prefix>
        <SvgIcon name="search" />
      </template>
    </el-input>
    <el-empty v-if="resultList.length === 0" description="暫無搜索結果" :image-size="100" />
    <template v-else>
      <p>搜索結果</p>
      <el-scrollbar ref="scrollbarRef" max-height="40vh" always>
        <SearchResult
          ref="searchResultRef"
          v-model="activeRouteName"
          :list="resultList"
          :isPressUpOrDown="isPressUpOrDown"
          @click="handleEnter"
        />
      </el-scrollbar>
    </template>
    <template #footer>
      <SearchFooter :total="resultList.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
.search-modal__private {
  .svg-icon {
    font-size: 18px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
    padding: var(--el-dialog-padding-primary);
  }
}
</style>
