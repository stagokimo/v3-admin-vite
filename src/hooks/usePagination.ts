import { reactive } from "vue"

interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 預設的分頁參數 */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** 合併分頁參數 */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** 改變目前頁碼 */
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  /** 改變頁面大小 */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
