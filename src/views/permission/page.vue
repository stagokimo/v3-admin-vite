<script lang="ts" setup>
import SwitchRoles from "./components/SwitchRoles.vue"
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <el-tag type="warning" size="large">目前頁面只有 admin 角色可見，切換角色后將不能進入該頁面</el-tag>
  </div>
</template>

<style lang="scss" scoped>
.el-tag {
  margin-top: 15px;
}
</style>
