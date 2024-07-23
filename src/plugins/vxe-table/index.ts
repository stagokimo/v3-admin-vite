import { type App } from "vue"
// https://vxetable.cn/#/table/start/install
import VXETable from "vxe-table"
// https://github.com/x-extends/vxe-table-plugin-element
import VXETablePluginElement from "vxe-table-plugin-element"

VXETable.use(VXETablePluginElement)

/** 全域性預設參數 */
VXETable.setConfig({
  /** 全域性尺寸 */
  size: "medium",
  /** 全域性 zIndex 起始值，如果專案的的 z-index 樣式值過大時就需要跟隨設定更大，避免被遮擋 */
  zIndex: 9999,
  /** 版本號，對於某些帶數據快取的功能有用到，上升版本號可以用於重置數據 */
  version: 0,
  /** 全域性 loading 提示內容，如果為 null 則不顯示文字 */
  loadingText: null,
  table: {
    showHeader: true,
    showOverflow: "tooltip",
    showHeaderOverflow: "tooltip",
    autoResize: true,
    // stripe: false,
    border: "inner",
    // round: false,
    emptyText: "暫無數據",
    rowConfig: {
      isHover: true,
      isCurrent: true,
      // 行數據的唯一主鍵欄位名
      keyField: "_VXE_ID"
    },
    columnConfig: {
      resizable: false
    },
    align: "center",
    headerAlign: "center"
  },
  pager: {
    // size: "medium",
    /** 配套的樣式 */
    perfect: false,
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 20, 50],
    layouts: ["Total", "PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "Sizes", "FullJump"]
  },
  modal: {
    minWidth: 500,
    minHeight: 400,
    lockView: true,
    mask: true,
    // duration: 3000,
    // marginSize: 20,
    dblclickZoom: false,
    showTitleOverflow: true,
    transfer: true,
    draggable: false
  }
})

export function loadVxeTable(app: App) {
  /** Vxe Table 元件完整引入 */
  app.use(VXETable)
}
