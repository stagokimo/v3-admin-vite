<script lang="ts" setup>
import { ref } from "vue"
import { type RouteLocationMatched, useRoute, useRouter } from "vue-router"
import { useRouteListener } from "@/hooks/useRouteListener"
import { compile } from "path-to-regexp"

const route = useRoute()
const router = useRouter()
const { listenerRouteChange } = useRouteListener()

/** 定義響應式數據 breadcrumbs，用於儲存麵包屑導航資訊 */
const breadcrumbs = ref<RouteLocationMatched[]>([])

/** 獲取麵包屑導航資訊 */
const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
}

/** 編譯路由路徑 */
const pathCompile = (path: string) => {
  const toPath = compile(path)
  return toPath(route.params)
}

/** 處理麵包屑導航點選事件 */
const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(pathCompile(path))
}

/** 監聽路由變化，更新麵包屑導航資訊 */
listenerRouteChange((route) => {
  if (route.path.startsWith("/redirect/")) return
  getBreadcrumb()
}, true)
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">
        {{ item.meta.title }}
      </span>
      <a v-else @click.prevent="handleLink(item)">
        {{ item.meta.title }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  line-height: var(--v3-navigationbar-height);
  .no-redirect {
    color: var(--el-text-color-placeholder);
  }
  a {
    font-weight: normal;
  }
}
</style>
