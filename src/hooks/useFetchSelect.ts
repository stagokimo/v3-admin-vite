import { ref, onMounted } from "vue"

type OptionValue = string | number

/** Select 需要的數據格式 */
interface SelectOption {
  value: OptionValue
  label: string
  disabled?: boolean
}

/** 介面響應格式 */
type ApiData = ApiResponseData<SelectOption[]>

/** 入參格式，暫時只需要傳遞 api 函式即可 */
interface FetchSelectProps {
  api: () => Promise<ApiData>
}

export function useFetchSelect(props: FetchSelectProps) {
  const { api } = props

  const loading = ref<boolean>(false)
  const options = ref<SelectOption[]>([])
  const value = ref<OptionValue>("")

  /** 呼叫介面獲取數據 */
  const loadData = () => {
    loading.value = true
    options.value = []
    api()
      .then((res) => {
        options.value = res.data
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    loadData()
  })

  return {
    loading,
    options,
    value
  }
}
