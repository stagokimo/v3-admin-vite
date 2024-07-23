<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue"
import { type ElMessageBoxOptions, ElMessageBox, ElMessage } from "element-plus"
import { deleteTableDataApi, getTableDataApi } from "@/api/table"
import { type GetTableResponseData } from "@/api/table/types/table"
import RoleColumnSolts from "./tsx/RoleColumnSolts"
import StatusColumnSolts from "./tsx/StatusColumnSolts"
import {
  type VxeGridInstance,
  type VxeGridProps,
  type VxeModalInstance,
  type VxeModalProps,
  type VxeFormInstance,
  type VxeFormProps
} from "vxe-table"

defineOptions({
  // 命名目前元件
  name: "VxeTable"
})

//#region vxe-grid
interface RowMeta {
  id: string
  username: string
  roles: string
  phone: string
  email: string
  status: boolean
  createTime: string
  /** vxe-table 自動新增上去的屬性 */
  _VXE_ID?: string
}
const xGridDom = ref<VxeGridInstance>()
const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  /** 分頁配置項 */
  pagerConfig: {
    align: "right"
  },
  /** 表單配置項 */
  formConfig: {
    items: [
      {
        field: "username",
        itemRender: {
          name: "$input",
          props: { placeholder: "使用者名稱", clearable: true }
        }
      },
      {
        field: "phone",
        itemRender: {
          name: "$input",
          props: { placeholder: "手機號", clearable: true }
        }
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: { type: "submit", content: "查詢", status: "primary" }
            },
            {
              props: { type: "reset", content: "重置" }
            }
          ]
        }
      }
    ]
  },
  /** 工具欄配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: { buttons: "toolbar-btns" }
  },
  /** 自定義列配置項 */
  customConfig: {
    /** 是否允許列選中  */
    checkMethod: ({ column }) => !["username"].includes(column.field)
  },
  /** 列配置 */
  columns: [
    {
      type: "checkbox",
      width: "50px"
    },
    {
      field: "username",
      title: "使用者名稱"
    },
    {
      field: "roles",
      title: "角色",
      /** 自定義列與 type: "html" 的列一起使用，會產生錯誤，所以採用 TSX 實現 */
      slots: RoleColumnSolts
    },
    {
      field: "phone",
      title: "手機號"
    },
    {
      field: "email",
      title: "郵箱"
    },
    {
      field: "status",
      title: "狀態",
      slots: StatusColumnSolts
    },
    {
      field: "createTime",
      title: "建立時間"
    },
    {
      title: "操作",
      width: "150px",
      fixed: "right",
      showOverflow: false,
      slots: { default: "row-operate" }
    }
  ],
  /** 數據代理配置項（基於 Promise API） */
  proxyConfig: {
    /** 啟用動態序號代理 */
    seq: true,
    /** 是否代理表單 */
    form: true,
    /** 是否自動載入，預設為 true */
    // autoLoad: false,
    props: {
      total: "total"
    },
    ajax: {
      query: ({ page, form }) => {
        xGridOpt.loading = true
        crudStore.clearTable()
        return new Promise((resolve) => {
          let total = 0
          let result: RowMeta[] = []
          /** 載入數據 */
          const callback = (res: GetTableResponseData) => {
            if (res?.data) {
              // 總數
              total = res.data.total
              // 列表數據
              result = res.data.list
            }
            xGridOpt.loading = false
            // 返回值有格式要求，詳情見 vxe-table 官方文件
            resolve({ total, result })
          }

          /** 介面需要的參數 */
          const params = {
            username: form.username || undefined,
            phone: form.phone || undefined,
            size: page.pageSize,
            currentPage: page.currentPage
          }
          /** 呼叫介面 */
          getTableDataApi(params).then(callback).catch(callback)
        })
      }
    }
  }
})
//#endregion

//#region vxe-modal
const xModalDom = ref<VxeModalInstance>()
const xModalOpt: VxeModalProps = reactive({
  title: "",
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate()
    return Promise.resolve()
  }
})
//#endregion

//#region vxe-form
const xFormDom = ref<VxeFormInstance>()
const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: "100px",
  loading: false,
  /** 是否顯示標題冒號 */
  titleColon: false,
  /** 表單數據 */
  data: {
    username: "",
    password: ""
  },
  /** 項列表 */
  items: [
    {
      field: "username",
      title: "使用者名稱",
      itemRender: { name: "$input", props: { placeholder: "請輸入" } }
    },
    {
      field: "password",
      title: "密碼",
      itemRender: { name: "$input", props: { placeholder: "請輸入" } }
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => xModalDom.value?.close() } },
          {
            props: { type: "submit", content: "確定", status: "primary" },
            events: { click: () => crudStore.onSubmitForm() }
          }
        ]
      }
    }
  ],
  /** 校驗規則 */
  rules: {
    username: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("請輸入")
            case !itemValue.trim():
              return new Error("空格無效")
          }
        }
      }
    ],
    password: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("請輸入")
            case !itemValue.trim():
              return new Error("空格無效")
          }
        }
      }
    ]
  }
})
//#endregion

//#region 增刪改查
const crudStore = reactive({
  /** 表單型別，true 表示修改，false 表示新增 */
  isUpdate: true,
  /** 載入表格數據 */
  commitQuery: () => xGridDom.value?.commitProxy("query"),
  /** 清空表格數據 */
  clearTable: () => xGridDom.value?.reloadData([]),
  /** 點選顯示彈窗 */
  onShowModal: (row?: RowMeta) => {
    if (row) {
      crudStore.isUpdate = true
      xModalOpt.title = "修改使用者"
      // 賦值
      xFormOpt.data.username = row.username
    } else {
      crudStore.isUpdate = false
      xModalOpt.title = "新增使用者"
    }
    // 禁用表單項
    const props = xFormOpt.items?.[0]?.itemRender?.props
    props && (props.disabled = crudStore.isUpdate)
    xModalDom.value?.open()
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset()
      xFormDom.value?.clearValidate()
    })
  },
  /** 確定並儲存 */
  onSubmitForm: () => {
    if (xFormOpt.loading) return
    xFormDom.value?.validate((errMap) => {
      if (errMap) return
      xFormOpt.loading = true
      const callback = () => {
        xFormOpt.loading = false
        xModalDom.value?.close()
        ElMessage.success("操作成功")
        !crudStore.isUpdate && crudStore.afterInsert()
        crudStore.commitQuery()
      }
      if (crudStore.isUpdate) {
        // 模擬呼叫修改介面成功
        setTimeout(() => callback(), 1000)
      } else {
        // 模擬呼叫新增介面成功
        setTimeout(() => callback(), 1000)
      }
    })
  },
  /** 新增后是否跳入最後一頁 */
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize
      if (currentTotal === pager.total) {
        ++pager.currentPage
      }
    }
  },
  /** 刪除 */
  onDelete: (row: RowMeta) => {
    const tip = `確定 <strong style="color: var(--el-color-danger);"> 刪除 </strong> 使用者 <strong style="color: var(--el-color-primary);"> ${row.username} </strong> ？`
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "取消",
      confirmButtonText: "確定",
      dangerouslyUseHTMLString: true
    }
    ElMessageBox.confirm(tip, "提示", config).then(() => {
      deleteTableDataApi(row.id).then(() => {
        ElMessage.success("刪除成功")
        crudStore.afterDelete()
        crudStore.commitQuery()
      })
    })
  },
  /** 刪除后是否返回上一頁 */
  afterDelete: () => {
    const tableData: RowMeta[] = xGridDom.value!.getData()
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage
    }
  },
  /** 更多自定義方法 */
  moreFn: () => {}
})
//#endregion
</script>

<template>
  <div class="app-container">
    <!-- 表格 -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt">
      <!-- 左側按鈕列表 -->
      <template #toolbar-btns>
        <vxe-button status="primary" icon="vxe-icon-add" @click="crudStore.onShowModal()">新增使用者</vxe-button>
        <vxe-button status="danger" icon="vxe-icon-delete">批量刪除</vxe-button>
      </template>
      <!-- 操作 -->
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">修改</el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">刪除</el-button>
      </template>
    </vxe-grid>
    <!-- 彈窗 -->
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <!-- 表單 -->
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>
