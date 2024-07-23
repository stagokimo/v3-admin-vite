<script lang="ts" setup>
import { ref } from "vue"

defineOptions({
  name: "Menu2"
})

const text = ref("")
</script>

<template>
  <div class="app-container">
    <el-card header="二級路由快取 - menu2">
      <el-input v-model="text" />
    </el-card>
  </div>
</template>
