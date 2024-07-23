<script lang="ts" setup>
import { ref } from "vue"

defineOptions({
  name: "Menu1-2-1"
})

const text = ref("")
</script>

<template>
  <div class="app-container">
    <el-card header="四級路由快取 - menu1-2-1">
      <el-input v-model="text" />
    </el-card>
  </div>
</template>
