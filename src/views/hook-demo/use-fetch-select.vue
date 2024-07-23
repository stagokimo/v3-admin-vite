<script lang="ts" setup>
import { useFetchSelect } from "@/hooks/useFetchSelect"
import { getSelectDataApi } from "@/api/hook-demo/use-fetch-select"

const { loading, options, value } = useFetchSelect({
  api: getSelectDataApi
})
</script>

<template>
  <div class="app-container">
    <h4>該示例是演示：通過 hook 自動呼叫 api 后拿到 Select 元件需要的數據並傳遞給 Select 元件</h4>
    <h5>Select 示例</h5>
    <el-select :loading="loading" v-model="value" filterable>
      <el-option v-for="(item, index) in options" v-bind="item" :key="index" placeholder="請選擇" />
    </el-select>
    <h5>Select V2 示例（如果數據量過多，可以選擇該元件）</h5>
    <el-select-v2 :loading="loading" v-model="value" :options="options" filterable placeholder="請選擇" />
  </div>
</template>
