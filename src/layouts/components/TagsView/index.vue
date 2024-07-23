<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, watch } from "vue"
import { type RouteLocationNormalizedLoaded, type RouteRecordRaw, RouterLink, useRoute, useRouter } from "vue-router"
import { type TagView, useTagsViewStore } from "@/store/modules/tags-view"
import { usePermissionStore } from "@/store/modules/permission"
import { useRouteListener } from "@/hooks/useRouteListener"
import path from "path-browserify"
import ScrollPane from "./ScrollPane.vue"
import { Close } from "@element-plus/icons-vue"

const instance = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const { listenerRouteChange } = useRouteListener()

/** 標籤頁元件元素的引用陣列 */
const tagRefs = ref<InstanceType<typeof RouterLink>[]>([])

/** 右鍵菜單的狀態 */
const visible = ref(false)
/** 右鍵菜單的 top 位置 */
const top = ref(0)
/** 右鍵菜單的 left 位置 */
const left = ref(0)
/** 目前正在右鍵操作的標籤頁 */
const selectedTag = ref<TagView>({})
/** 固定的標籤頁 */
let affixTags: TagView[] = []

/** 判斷標籤頁是否啟用 */
const isActive = (tag: TagView) => {
  return tag.path === route.path
}

/** 判斷標籤頁是否固定 */
const isAffix = (tag: TagView) => {
  return tag.meta?.affix
}

/** 篩選出固定標籤頁 */
const filterAffixTags = (routes: RouteRecordRaw[], basePath = "/") => {
  const tags: TagView[] = []
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      tags.push(...childTags)
    }
  })
  return tags
}

/** 初始化標籤頁 */
const initTags = () => {
  affixTags = filterAffixTags(permissionStore.routes)
  for (const tag of affixTags) {
    // 必須含有 name 屬性
    tag.name && tagsViewStore.addVisitedView(tag)
  }
}

/** 新增標籤頁 */
const addTags = (route: RouteLocationNormalizedLoaded) => {
  if (route.name) {
    tagsViewStore.addVisitedView(route)
    tagsViewStore.addCachedView(route)
  }
}

/** 重新整理目前正在右鍵操作的標籤頁 */
const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view)
  router.replace({ path: "/redirect" + view.path, query: view.query })
}

/** 關閉目前正在右鍵操作的標籤頁 */
const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  isActive(view) && toLastView(tagsViewStore.visitedViews, view)
}

/** 關閉其他標籤頁 */
const closeOthersTags = () => {
  const fullPath = selectedTag.value.fullPath
  if (fullPath !== route.path && fullPath !== undefined) {
    router.push(fullPath)
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value)
  tagsViewStore.delOthersCachedViews(selectedTag.value)
}

/** 關閉所有標籤頁 */
const closeAllTags = (view: TagView) => {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  if (affixTags.some((tag) => tag.path === route.path)) return
  toLastView(tagsViewStore.visitedViews, view)
}

/** 跳轉到最後一個標籤頁 */
const toLastView = (visitedViews: TagView[], view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  const fullPath = latestView?.fullPath
  if (fullPath !== undefined) {
    router.push(fullPath)
  } else {
    // 如果 TagsView 全部被關閉了，則預設重定向到主頁
    if (view.name === "Dashboard") {
      // 重新載入主頁
      router.push({ path: "/redirect" + view.path, query: view.query })
    } else {
      router.push("/")
    }
  }
}

/** 打開右鍵菜單面板 */
const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  // 目前元件距離瀏覽器左端的距離
  const offsetLeft = instance!.proxy!.$el.getBoundingClientRect().left
  // 目前元件寬度
  const offsetWidth = instance!.proxy!.$el.offsetWidth
  // 面板的最大左邊距
  const maxLeft = offsetWidth - menuMinWidth
  // 面板距離滑鼠指針的距離
  const left15 = e.clientX - offsetLeft + 15
  left.value = left15 > maxLeft ? maxLeft : left15
  top.value = e.clientY
  // 顯示面板
  visible.value = true
  // 更新目前正在右鍵操作的標籤頁
  selectedTag.value = tag
}

/** 關閉右鍵菜單面板 */
const closeMenu = () => {
  visible.value = false
}

watch(visible, (value) => {
  value ? document.body.addEventListener("click", closeMenu) : document.body.removeEventListener("click", closeMenu)
})

onMounted(() => {
  initTags()
  /** 監聽路由變化 */
  listenerRouteChange(async (route) => {
    addTags(route)
  }, true)
})
</script>

<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper" :tag-refs="tagRefs">
      <router-link
        ref="tagRefs"
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="{ active: isActive(tag) }"
        class="tags-view-item"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <el-icon v-if="!isAffix(tag)" :size="12" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">重新整理</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">關閉</li>
      <li @click="closeOthersTags">關閉其它</li>
      <li @click="closeAllTags(selectedTag)">關閉所有</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--v3-tagsview-height);
  width: 100%;
  color: var(--v3-tagsview-text-color);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--v3-tagsview-tag-border-color);
      border-radius: var(--v3-tagsview-tag-border-radius);
      background-color: var(--v3-tagsview-tag-bg-color);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--v3-tagsview-tag-active-bg-color);
        color: var(--v3-tagsview-tag-active-text-color);
        border-color: var(--v3-tagsview-tag-active-border-color);
      }
      .el-icon {
        margin: 0 2px;
        vertical-align: middle;
        border-radius: 50%;
        &:hover {
          background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
          color: var(--v3-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    color: var(--v3-tagsview-contextmenu-text-color);
    background-color: var(--v3-tagsview-contextmenu-bg-color);
    box-shadow: var(--v3-tagsview-contextmenu-box-shadow);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        color: var(--v3-tagsview-contextmenu-hover-text-color);
        background-color: var(--v3-tagsview-contextmenu-hover-bg-color);
      }
    }
  }
}
</style>
