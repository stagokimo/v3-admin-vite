<script lang="ts" setup>
import { ref, computed } from "vue"
import { ElMessage } from "element-plus"
import { Bell } from "@element-plus/icons-vue"
import NotifyList from "./NotifyList.vue"
import { type ListItem, notifyData, messageData, todoData } from "./data"

type TabName = "通知" | "訊息" | "待辦"

interface DataItem {
  name: TabName
  type: "primary" | "success" | "warning" | "danger" | "info"
  list: ListItem[]
}

/** 角標目前值 */
const badgeValue = computed(() => {
  return data.value.reduce((sum, item) => sum + item.list.length, 0)
})
/** 角標最大值 */
const badgeMax = 99
/** 面板寬度 */
const popoverWidth = 350
/** 目前 Tab */
const activeName = ref<TabName>("通知")
/** 所有數據 */
const data = ref<DataItem[]>([
  // 通知數據
  {
    name: "通知",
    type: "primary",
    list: notifyData
  },
  // 訊息數據
  {
    name: "訊息",
    type: "danger",
    list: messageData
  },
  // 待辦數據
  {
    name: "待辦",
    type: "warning",
    list: todoData
  }
])

const handleHistory = () => {
  ElMessage.success(`跳轉到${activeName.value}歷史頁面`)
}
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" :max="badgeMax" :hidden="badgeValue === 0">
          <el-tooltip effect="dark" content="訊息通知" placement="bottom">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane v-for="(item, index) in data" :name="item.name" :key="index">
            <template #label>
              {{ item.name }}
              <el-badge :value="item.list.length" :max="badgeMax" :type="item.type" />
            </template>
            <el-scrollbar height="400px">
              <NotifyList :list="item.list" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="notify-history">
          <el-button link @click="handleHistory">檢視{{ activeName }}歷史</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify {
  margin-right: 10px;
}

.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
