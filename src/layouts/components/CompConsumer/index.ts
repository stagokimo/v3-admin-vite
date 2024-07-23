import { type VNode, cloneVNode, createVNode, defineComponent, h, KeepAlive } from "vue"
import { useRoute } from "vue-router"
import { useTagsViewStore } from "@/store/modules/tags-view"

interface CompConsumerProps {
  component: VNode
}

/** 定義 compMap 對象，用於儲存路由名稱和對應的元件 */
const compMap = new Map<string, VNode>()

/**
 * CompConsumer 元件
 * 用法：替換 <keep-alive> 標籤以及內部程式碼，變成：<CompConsumer :component="Component" />
 * 優點：快取路由時只需寫路由 Name，無需再寫元件 Name
 * 缺點：當路由表有動態路由匹配時（指向同一個元件），會出現複用元件的情況（例如修改 /info/1 時 /info/2 也會跟著改變）
 */
export const CompConsumer = defineComponent(
  (props: CompConsumerProps) => {
    const tagsViewStore = useTagsViewStore()
    const route = useRoute()
    return () => {
      // 獲取傳入的元件
      const component = props.component
      // 判斷目前是否包含 name，如果不包含 name，那就直接處理掉 name
      if (!route.name) return component
      // 獲取目前元件的名稱
      const compName = (component.type as any)?.name
      // 獲取目前路由的名稱
      const routeName = route.name as string
      let Comp: VNode
      // 檢查 compMap 中是否已經存在對應的元件
      if (compMap.has(routeName)) {
        // 如果存在，則直接使用該元件進行渲染
        Comp = compMap.get(routeName)!
      } else {
        // 如果不存在，則克隆傳入的元件並建立一個新的元件，將其新增到 compMap 中
        const node = cloneVNode(component)
        if (compName && compName === routeName) {
          ;(node.type as any).name = `__${compName}__CUSTOM_NAME`
        }
        // @ts-expect-error this is VNode
        Comp = defineComponent({
          name: routeName,
          setup() {
            return () => node
          }
        })
        compMap.set(routeName, Comp)
      }
      // 使用 createVNode 函式建立一個 KeepAlive 元件，並快取 cachedViews 陣列中對應的元件
      return createVNode(
        KeepAlive,
        {
          include: tagsViewStore.cachedViews
        },
        {
          default: () => h(Comp)
        }
      )
    }
  },
  {
    name: "CompConsumer",
    props: ["component"]
  }
)
