<template>
  <div class="app-container">
    <h4>
      三級及其以上路由快取功能預設關閉，需要請前往此配置檔案中打開：
      <el-link
        type="primary"
        href="https://github.com/un-pany/v3-admin-vite/blob/main/src/config/route.ts"
        target="_blank"
      >
        src/config/route.ts
      </el-link>
    </h4>
    <el-card header="二級路由 - menu1">
      <router-view />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-link {
  font-size: 18px;
}
</style>
